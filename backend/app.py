from flask import Flask, jsonify, request
from bson import ObjectId
from flask_cors import CORS
import pymongo
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
from openai import OpenAI
import numpy as np

import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="TypedStorage is deprecated.*")

load_dotenv()
OAI = OpenAI()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  

mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db = client[database_name]
accounts = db['accounts']
collection = db['transactions']


def get_embedding(text, model="text-embedding-3-small"):
   res = OAI.embeddings.create(input = [text], model=model)
   return res.data[0].embedding

def fraud_encode(doc, near =1000):
    pipeline = [ {  '$match': {'originator_id': doc["originator_id"] } }
               , {  '$group': { '_id': '$originator_id', 
                    'std': { '$stdDevSamp': '$transaction_amount'}, 
                    'mdn': {'$median': { 'input': '$transaction_amount', 'method': 'approximate' } }
                } } ]
    result = list(collection.aggregate(pipeline))
    filter = {'originator_id': doc["originator_id"],'transaction_date': {'$gte': doc["transaction_date"] - timedelta(hours=1), '$lte': doc["transaction_date"]}}
    trans_h_ago = list(collection.find(filter,{"transaction_amount":1,"_id":0}))
    h_ago = len(trans_h_ago)
    total_amount = sum(item['transaction_amount'] for item in trans_h_ago)
    acc = list(accounts.find({'_id': doc["originator_id"] }))
    first = collection.count_documents({'originator_id': doc["originator_id"], 'beneficiary_id': doc["beneficiary_id"] }) 
    
    text =  ''
    especially = ''
    if doc["reported_originator_address"].split(",")[-1].strip() != doc["reported_beneficiary_address"].split(",")[-1].strip():
        text+= f'An international transaction was initiated on {doc["transaction_date"]}. '
        especially = 'This is unusual, especially for international transations. '
    else:
        text+= f'An national transaction was initiated on {doc["transaction_date"]}. '
    
    if first==1:
        text+= f'This is the first transaction between the originator and beneficiary. '
    elif first>5:
        text+= f'The originator and beneficiary have made many transactions before. '

    if doc["transaction_amount"] <= result[0]["mdn"]:
        text+= f'The transaction was for ${doc["transaction_amount"]}, which is low for the originator. '
    elif doc["transaction_amount"] > result[0]["mdn"]+result[0]["std"]:
        text+= f'The transaction was for ${doc["transaction_amount"]}, which is unusually high for the originator. ' + especially
    else:
        text+= f'The transaction was for ${doc["transaction_amount"]}, which is high for the originator. ' + especially

    if doc["transaction_amount"] > acc[0]["transaction-limits"]["max-transaction-limit"]:
        text+= f'The transaction is also above the maximum transaction limit set by the user. '
    elif doc["transaction_amount"] > acc[0]["transaction-limits"]["max-transaction-limit"]-near:
        text+= f'The transaction is also below, yet close the maximum transaction limit set by the user. '
    
    if  h_ago == 0 :
        text+= f'This is the first transaction for the originator in the past hour, which is low activity.'
    elif h_ago > acc[0]["transaction-limits"]["max-num-transactions"]:
        text+= f'This is transaction number {h_ago} within the past hour. This unusually high activity for the originator. '
    else:
        text+= f'This is transaction number {h_ago} within the past hour. This is normal to busy activity for the originator.'

    if  h_ago>1 :
        if total_amount <= result[0]["mdn"]:
            text+= f'The total ammount for the {h_ago} transactions was of ${total_amount}, which is low for the originator. '
        elif total_amount > result[0]["mdn"] +result[0]["std"]:
            text+= f'The total ammount for the {h_ago} transactions was of ${total_amount}, which is unusually high for the originator. ' + especially
        else :
            text+= f'The total ammount for the {h_ago} transactions was of ${total_amount}, which is high for the originator. ' + especially
    
    if 'description' in doc:
        if doc['description'] != '':
            text += f'The originator added a description to the transaction : '+ doc['description']

    return text

def AML_encode(doc):
    text =  ''
    acc = list(accounts.find({'_id': doc["originator_id"] }))
    acc.append(list(accounts.find({'_id': doc["beneficiary_id"] }))[0])

    text+= f'The originator of the trasanction is a {acc[0]["entity_type"]} called {acc[0]["name"]}. '
    text+= f'The originator is concidered {acc[0]["risk"]} risk. '
    
    if acc[0]["contact_information"]["address"] == doc["reported_originator_address"]:
        text+= f"The originator's address on the transaction is consistent with on one in his account. "
    else:
        text+= f"There are some discrepancies between the originator's address on the transaction and one in his account. "
    
    text+= f'The beneficiary of the trasanction is a {acc[1]["entity_type"]} called {acc[1]["name"]}. '

    text+= f'The beneficiary is concidered {acc[1]["risk"]} risk. '

    if acc[1]["contact_information"]["address"] == doc["reported_beneficiary_address"]:
        text+= f"The beneficiary's address on the transaction is consistent with on one in his account. "
    else:
        text+= f"There are some discrepancies between the beneficiary's address on the transaction and one in his account. "
    
    if acc[0]["contact_information"]["phone_number"] == acc[1]["contact_information"]["phone_number"]:
        text+= f'The originator and beneficiary have the same phone number. '
    
    if acc[0]["contact_information"]["email"] == acc[1]["contact_information"]["email"]:
        text+= f'The originator and beneficiary have the same email address. '
    
    if acc[0]["contact_information"]["address"] == acc[1]["contact_information"]["address"]:
        text+= f'The originator and beneficiary have the same address. '

    if doc["reported_beneficiary_address"] == doc["reported_originator_address"]:
        text+= f'The originator and beneficiary have the same address on the transaction.'

    if 'description' in doc:
        if doc['description'] != '':
            text += f'The originator added a description to the transaction : '+ doc['description']
     
    return text

def vector_search_pipeline(test, limit, query_vector):
    if test == "aml":
        index, path = "AML", "AML_vectors"
        projection = {"$project": {"test": "$aml"}}
    else:
        index, path = "fraud", "fraud_vectors"
        projection = {"$project": {"test": "$fraud"}}
    pipeline = [
            { "$vectorSearch": {
                    "index": index,
                    "path": path,
                    "limit": limit,
                    "numCandidates": 10000,
                    "queryVector": query_vector
            } },
            projection,
            { "$group": {
                "_id": None,
                "total": {
                    "$sum": "$test"
                }
            } }
        ]
    return pipeline

@app.route("/", methods=["GET"])
def root():
    return {"status": "Server is running!"}

@app.route("/embedings", methods=["GET"])
def embedings():
    _id = ObjectId(request.args.get("_id"))
    doc = collection.find_one({"_id": _id})
    if not doc:
        return jsonify({"error": "Document not found!"}), 404  # Return error if doc is empty
    set_doc = {}
    if isinstance(doc["transaction_date"], str):
        set_doc["transaction_date"] = datetime.strptime(doc["transaction_date"], '%Y-%m-%dT%H:%M:%S.%f%z')
        res = collection.update_one( {'_id': doc["_id"]}, {'$set': set_doc } )
        set_doc = {}
        doc = collection.find_one({"_id": _id})
    if "fraud_vectors" not in doc or doc["fraud_vectors"] == []:
        set_doc["fraud_text"] = fraud_encode(doc)
        set_doc["fraud_vectors"] = get_embedding(set_doc["fraud_text"])
    if "AML_vectors" not in doc or doc["AML_vectors"] == []:
        set_doc["AML_text"] = AML_encode(doc)
        set_doc["AML_vectors"] = get_embedding(set_doc["AML_text"])
    collection.update_one( {'_id': doc["_id"]}, {'$set': set_doc } )
    return jsonify({"message": "Embeddings updated!"})

@app.route("/verification", methods=["GET"])
def verification():
    _id = ObjectId(request.args.get("_id"))
    doc = collection.find_one({"_id": _id})
    if not doc:
        return jsonify({"error": "Document not found!"}), 404  # Return error if doc is empty
    limit = 4000

    aml = list( collection.aggregate(vector_search_pipeline("aml", limit, doc["AML_vectors"])) )
    print("\n\n\naml", aml[0])

    Fraud = list(collection.aggregate(vector_search_pipeline("fraud", limit, doc["fraud_vectors"])))
    print("Fraud", Fraud[0],"\n\n\n")
    set_doc = {}

    if aml[0]["total"] >= np.floor(limit/2):    
        set_doc["aml"] = 1
    else:
        set_doc["aml"] = 0
    if Fraud[0]["total"] >= np.floor(limit/2):    
        set_doc["fraud"] = 1
    else :
        set_doc["fraud"] = 0

    collection.update_one( {'_id': doc["_id"]}, {'$set': set_doc } )
    return jsonify(set_doc)

if __name__ == "__main__": 
    app.run(host="0.0.0.0", port=8080, debug=False)
    