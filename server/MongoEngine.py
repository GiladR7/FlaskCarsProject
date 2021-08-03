import functools

from mongoengine import *
from datetime import datetime

connect(host="mongodb+srv://gilad:123456Gad@cluster0.gqrun.mongodb.net/Cars?retryWrites=true&w=majority")


class Users(Document):
    email = StringField(required=True, unique=True)
    user_name = StringField(required=True)
    password = StringField(required=True)
    date_create = DateTimeField(default=datetime.utcnow)
    user_categories = ListField()
    user_favorites = ListField(default=[])

    def json(self):
        user_dic = {
            "id": str(self.id),
            "user": self.user_name,
            "email": self.email,
            "chooseCategories": self.user_categories
        }
        return user_dic


class Ads(Document):
    create_by = ReferenceField(Users, required=True)
    model = StringField(required=True)
    cartype = StringField(required=True)
    manufactur = StringField(required=True)
    gear = StringField()
    moreDetails = StringField(default="")
    post_date = DateTimeField(default=datetime.utcnow)
    owners = IntField(max_value=10, required=True, min_value=1)
    price = IntField(max_value=10000000, required=True, min_value=0)
    year = StringField(required=True)
    km = IntField(max_value=500000, required=True, min_value=0)
    city = StringField(required=True)
    color = StringField(required=True)
    phone = StringField(required=True)
    codeArea = StringField(required=True)
    post_views = IntField(default=0)
    images = ListField(max_length=5, default=[])

    def json(self, token=False):
        ad = {
            "adid": str(self.id),
            "modelname": self.model,
            "category": self.cartype,
            "manufacturername": self.manufactur,
            "gearname": self.gear,
            "description": self.moreDetails,
            "adDate": str(self.post_date),
            "owners": self.owners,
            "carprice": self.price,
            "modelyear": self.year,
            "km": self.km,
            "city": self.city,
            "color": self.color,
            "phone": self.phone,
            "codeArea": self.codeArea,
            "views": self.post_views,
            "images": self.images
        }

        if (token != False):
            ad["userAd"] = str(self.create_by.id) == token
        return ad


class Models(Document):
    category = StringField()
    manufacturer = StringField()
    model = StringField()

    def json(self):
        return {
            "category": self.category,
            "manufacturer": self.manufacturer,
            "model": self.model
        }


def allUsers():
    users = []
    userObj = Users.objects
    for user in userObj:
        users.append(user.json())
    return users


def handlerUniqueError(message):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
               return  func(*args, **kwargs)

            except NotUniqueError:
                return {
                    "status": "failed",
                    "message": message
                }
            except:
                return {
                    "status": "failed",
                    "message": "קיימת שגיאת מערכת נסה שנית מאוחר יותר"
                }

        return wrapper

    return decorator


def handler_general_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except:
            return {
                "status": "failed",
                "message": "קיימת שגיאת מערכת נסה שנית מאוחר יותר"
            }

    return wrapper


@handlerUniqueError("איימיל  קיים במערכת")
def add_new_user(user):
    Users(**user).save()
    return{
                    "status": "ok"

                }


@handler_general_error
def user_exists(token):
    return {"status": "ok", "data": Users.objects(id=token).get().json()}


def log_in(email, password):
    try:
        user = Users.objects(email=email, password=password).get()
        return {
            "status": "ok",
            "data": user.json()
        }
    except DoesNotExist:
        return {
            "status": "failed",
            "message": "שם משתמש או סיסמא אינם נכונים"
        }


def add_to_favorites(adId, userId):
    user = Users.objects(id=userId).get()
    user.update(add_to_set__user_favorites=[adId])
    return Users.objects(id=userId)


def get_favorites_ads_ids(userId):
    ids = Users.objects(id=userId)[0].user_favorites
    ads = []
    for ad in Ads.objects.filter(id__in=ids):
        ads.append(ad.json())
    return Users.objects(id=userId)[0].user_favorites, ads


def remove_from_favorites(adId, userId):
    user = Users.objects(id=userId).get()
    user.update(pull__user_favorites=adId)
    return Users.objects(id=userId)


def all_ads(token=False):
    ads = []
    for ad in Ads.objects:
        ads.append(ad.json(token))
     
    return ads

def add_view(adId):
    ad = Ads.objects(id = adId).get()
    ad.update(post_views =  ad.post_views +1)

def get_my_ads(userId):
    ads = []
    for ad in Ads.objects(create_by=userId):
        ads.append(ad.json(userId))
    return ads


def get_ad_by_id(adId):
    return Ads.objects(id=adId).get().json()


def add_new_ad(ad_data, userId):
    user = Users.objects(id=userId).get()
    ad_data["create_by"] = user
    ad = Ads(**ad_data).save()
    return ad.json()


def remove_ad_by_id(adId):
    Ads.objects(id=adId).delete()


def update_ad(adId, ad_data):
    Ads.objects(id=adId).get().update(**ad_data)

@handlerUniqueError("איימל קיים במערכת")
def update_user_details(userId, userDetails):
    Users.objects(id=userId).get().update(**userDetails)
    user =  Users.objects(id=userId).get().json()
    return {"status":"ok" , "data":user}



def get_ads_by_category(categories_list, token=False):
    ads = []
    for ad in Ads.objects.filter(cartype__in=categories_list):
        ads.append(ad.json(token))

    return ads


def all_models():
    models = []
    for model in Models.objects:
        models.append(model.json())
    return models


def get_models_by_category_and_manufacturer(category, manufacturer):
    models = []
    for model in Models.objects(category=category, manufacturer=manufacturer):
        models.append(model.json())
    return models


def get_manufacturer_by_category(category):
    manufacturers = []

    for manufacturer in Models.objects(category=category).distinct(field="manufacturer"):
        manufacturers.append({"manufacturer": manufacturer})

    return manufacturers

