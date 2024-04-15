import pymongo
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor

import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="TypedStorage is deprecated.*")

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db = client[database_name]
accounts = db['accounts']
sanctioned = db['sanctioned']
transactions = db['transactions']


def fraud_check(doc):
    filter = {'originator_id': doc["originator_id"],'transaction_date': {'$gte': doc["transaction_date"] - timedelta(hours=1), '$lte': doc["transaction_date"]}}
    trans_h_ago = list(transactions.find(filter,{"transaction_amount":1,"_id":0}))
    geoLogic = 'National'
    if doc["reported_originator_address"].split(",")[-1].strip() != doc["reported_beneficiary_address"].split(",")[-1].strip():
       geoLogic = 'International'
    h_ago = len(trans_h_ago)
    total_amount = sum(item['transaction_amount'] for item in trans_h_ago)
    #print(total_amount, h_ago)
    if ((geoLogic=="International" and (total_amount>1000 or h_ago>2)) or (geoLogic=="National" and (total_amount>4000 or h_ago>4)) ):
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "fraud": 1 } },upsert=True )
    else:
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "fraud": 0 } },upsert=True )

def aml_check(doc):
    acc = list(accounts.find({'_id': { '$in': [doc["originator_id"], doc["beneficiary_id"]] } }))
    if (acc[0]["contact_information"]["address"] == acc[1]["contact_information"]["address"] 
        or acc[0]["contact_information"]["phone_number"] == acc[1]["contact_information"]["phone_number"] or acc[0]["contact_information"]["email"] == acc[1]["contact_information"]["email"] 
        or (acc[0]["risk"] == "high" and acc[1]["risk"] != "low") or (acc[0]["risk"] != "low" and acc[1]["risk"] == "high") or (acc[0]["risk"] == "medium" and acc[1]["risk"] == "medium")):
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "aml": 1 } },upsert=True )
    else:
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "aml": 0 } },upsert=True )

def sanction_check(doc):
    pipeline = [ {
        "$search":
          {
            "index": "Sanctions",
            "text": {
              "query": [doc["originator_type"],doc["beneficiary_type"]],
              "path": "entity_name",
              "fuzzy": {
                "maxEdits": 2
              }
            }
          }
      },
      {
        "$project": {
          "_id": 1,
          "entity_name": 1,
          "score": {
            "$meta": "searchScore"
          }
        }
      },
      {
        "$match": {
          "score": { "$gt": 4 }
        }
      }
    ]
    result = list(sanctioned.aggregate(pipeline))
    if len(result) > 0:
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "sanctioned": 1 } },upsert=True )
    else:
      return pymongo.UpdateOne( {'_id': doc["_id"]}, {'$set': { "sanctioned": 0 } },upsert=True )

def process_document(doc):
    with ThreadPoolExecutor(max_workers=3) as executor:
        fraud_future = executor.submit(fraud_check, doc)
        aml_future = executor.submit(aml_check, doc)
        sanction_future = executor.submit(sanction_check, doc)

        fraud_res = fraud_future.result()
        aml_res = aml_future.result()
        sanction_res = sanction_future.result()

    return fraud_res, aml_res, sanction_res

def bulk_document(chunks):
    bulk_updates = []
    n=0
    with ThreadPoolExecutor(max_workers=30) as executor:
        for chunk in chunks:
            futures = [executor.submit(process_document, doc) for doc in chunk]
            for future in futures:
                fraud_res, aml_res, sanction_res = future.result()
                if fraud_res:
                    bulk_updates.append(fraud_res)
                if aml_res:
                    bulk_updates.append(aml_res)
                if sanction_res:
                    bulk_updates.append(sanction_res)
            #print(bulk_updates)
            res = transactions.bulk_write(bulk_updates, ordered=False)
            n+=res.modified_count
            print(f"{n} documents updated in " + str(datetime.today() - tic))
            bulk_updates = []

if __name__ == "__main__":
    tic = datetime.now()
    documents = list(transactions.find({}, {"fraud_vectors": 0, "AML_vectors": 0}) )
    CHUNK_SIZE = 300
    chunks = [documents[i:i + CHUNK_SIZE] for i in range(0, len(documents), CHUNK_SIZE)]
    
    bulk_document(chunks)
    print(f"Total time taken: {datetime.now() - tic}")

client.close()
