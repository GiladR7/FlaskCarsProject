import pymongo

client = pymongo.MongoClient("mongodb+srv://gilad:123456Gad@cluster0.gqrun.mongodb.net/Cars?retryWrites=true&w=majority")

print(client.list_database_names())
my_db = client["cars"]
col = my_db["users"]
col.insert_one({"name":"gilad"})

client.close()