import datetime
import functools
import os
import time

from flask import Flask, request, jsonify, make_response

from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename

from MongoEngine import allUsers, all_ads, all_models, get_models_by_category_and_manufacturer, \
    get_manufacturer_by_category, add_new_user, log_in, get_ads_by_category, get_ad_by_id, user_exists, \
    add_to_favorites, remove_from_favorites, get_favorites_ads_ids, get_my_ads, add_new_ad, remove_ad_by_id, update_ad, \
    update_user_details , add_view

app = Flask(__name__ , static_url_path = "", static_folder = "public")
app.config['CORS_HEADERS'] = "Content-Type"
CORS(app)
UPLOAD_FOLDER = 'public\\images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def upload_images(files):
    images = []
    for file in files:
        filename = str(round(time.time() * 1000)) + secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        images.append(filename)
    return images



def is_log_in(func):
    @functools.wraps(func)
    def wrapper():
        token = request.cookies.get("token")
        res = user_exists(token)
        if (res["status"] == "ok"):
            return func(token)
        else:
            return func()
    return wrapper


def token_valid(func):
    @functools.wraps(func)
    def my_wrapper(*args, **kwargs):
        token = request.cookies.get("token")
        res = user_exists(token)
        if (res["status"] == "ok"):
            return func(*args, token, **kwargs)
        else:
            return make_response(jsonify({"status": "failed", "message": "invalid token"}, 401))

    return my_wrapper


def general_handler_error(func):
    @functools.wraps(func)
    def wrapper(*args , **kwargs):
        try:
            return func(*args , **kwargs)
        except Exception as err:
            print(err)
            return make_response(jsonify({"status":"failed" , "message":"קיימת שגיאת מערכת נסה שוב מאוחר יותר"}) , 500)
    return wrapper
@app.route("/token")
@cross_origin(supports_credentials=True)
@general_handler_error
def check_valid_token():
    token = request.cookies.get("token")
    res = user_exists(token)
    return jsonify(res)


@app.route("/users", methods=["POST", "GET" , "PUT"])
@cross_origin(supports_credentials=True)
@is_log_in
@general_handler_error
def users(token):
    if (request.method == "POST"):
        data = request.get_json()
        user = {
            "user_name": data["user"],
            "password": data["password"],
            "user_categories": data["chooseCategories"],
            "email": data["email"]
        }
        return jsonify(add_new_user(user))
    elif request.method == "PUT":
        userDetails = request.get_json()
        user = {
            "user_name": userDetails["user"],
            "user_categories": userDetails["chooseCategories"],
            "email": userDetails["email"]
        }
        res_db = update_user_details(token ,user)
        return jsonify(res_db)

    return jsonify(allUsers())



@app.route("/ads/<adId>" , methods=["GET" , "DELETE" , "PUT"])
@cross_origin(supports_credentials=True)
@general_handler_error
def add_and_remove_ad(adId):
    if request.method == "GET":
        return jsonify({"status": "ok", "data": [get_ad_by_id(adId)]})
    elif request.method == "DELETE":
        remove_ad_by_id(adId)
        return make_response({"status":"ok" , "message":"ad delete"})
    elif request.method == "PUT":
        ad_data = dict(request.form)
        uploaded_files = request.files.getlist("carImages")
        if len(uploaded_files):
            ad_data["images"] = upload_images(uploaded_files)
        update_ad(adId , ad_data)
        return jsonify({"status":"ok"})

@app.route("/ads/views/<adId>" , methods = ["PUT"])
@cross_origin(supports_credentials=True)
@general_handler_error
def update_views(adId):
    add_view(adId)
    return make_response(jsonify({"status":"ok"}) , 204)

@app.route("/logIn", methods=["POST"])
@cross_origin(supports_credentials=True)
@general_handler_error
def logIn():
    data = request.get_json()
    mongo_res = log_in(**data)

    if (mongo_res["status"] == "ok"):
        response = make_response(jsonify(mongo_res))
        response.set_cookie('token', mongo_res["data"]["id"])
        response.headers["Content-Type"] = "application/json"
        return response
    return mongo_res

@app.route("/ads" , methods = ["POST", "GET"])
@cross_origin(supports_credentials=True)
@is_log_in
@general_handler_error
def ads(is_logIn=False):
    if request.method == "GET":
        category = request.args.getlist("category")
        adId = request.args.get("adId")
        if (category):
            return jsonify({"status": "ok", "data": get_ads_by_category(category, is_logIn)})
        elif (adId):
            return jsonify({"status": "ok", "data": [get_ad_by_id(adId)]})
        return jsonify({"status": "ok", "data": all_ads(is_logIn)})

    elif request.method == "POST" and  is_logIn:
        dic = dict(request.form)
        uploaded_files = request.files.getlist("carImages")
        dic["images"] = upload_images(uploaded_files)
        ad = add_new_ad( dic, is_logIn)
        return jsonify({"status":"ok" , "adId":ad["adid"] })





@app.route("/ads/favorites/<adId>", methods=["PUT", "DELETE"])
@cross_origin(supports_credentials=True)
@token_valid
@general_handler_error
def favorites_ads(userId, adId):
    if (request.method == "DELETE"):
        like_ids = remove_from_favorites(adId, userId)
        return make_response(jsonify(like_ids[0].user_favorites))
    elif request.method == "PUT":
        like_ids = add_to_favorites(adId, userId)
        return make_response(jsonify(like_ids[0].user_favorites))


@app.route("/ads/favorites")
@cross_origin(supports_credentials=True)
@token_valid
@general_handler_error
def get_favorites_ids(userId):
    adIds, ads = get_favorites_ads_ids(userId)
    return jsonify({"status": "ok", "adsIds": adIds, "ads": ads})


@app.route("/ads/myAds")
@cross_origin(supports_credentials=True)
@token_valid
@general_handler_error
def get_ads_by_user_id(userId):
    ads = get_my_ads(userId)
    return jsonify({"status": "ok", "data": ads})


@app.route("/cars")
@cross_origin(supports_credentials=True)
@general_handler_error
def cars():
    category = request.args.get("category")
    manufacturer = request.args.get("manufacturer")

    if (category and manufacturer):
        return jsonify(get_models_by_category_and_manufacturer(category, manufacturer))
    elif (category):
        return jsonify(get_manufacturer_by_category(category))
    return jsonify(all_models())


app.run(port=int("8000"))
