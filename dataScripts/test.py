import pymongo
from dotenv import load_dotenv
import os



load_dotenv()


mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db = client[database_name]
accounts = db['accounts']

pipeline= [
  {
    "$match":
      { "risk": "low" },
  },
  {
    "$sample":
      { "size": 2 },
  },
]

result = list(accounts.aggregate(pipeline))

for i in result:
    res = accounts.update_one({"_id": i["_id"]}, {"$set": {"risk": "high"}})


client.close();