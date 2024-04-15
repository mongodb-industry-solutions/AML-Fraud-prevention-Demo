from gevent import monkey
_ = monkey.patch_all()
import pymongo
import os
from datetime import datetime, timedelta
import random

## GLOBAL INPUTS

from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db=client[database_name]
accounts = db['accounts']
collection = db['transactions']

## INPUTS
bulk_size = 30
insert = True
verbose = False

print("\n")

def date_generator():
    dt=datetime.today() - timedelta(days=random.randint(0, 30)) - timedelta(seconds=random.randint(0,12*3600))
    return(datetime(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second))

def generate_entry():
    acc = list(accounts.find({}))
    result = []
    acc_len = len(acc)
    for i in range(acc_len):
        for j in range(1,bulk_size+1):
              recipient_index = (i + j) % acc_len  
              transaction_doc = {
                "transaction_date": date_generator(),
                "originator_id": acc[i]["_id"],
                "originator_type": acc[i]["name"],
                "reported_originator_address": acc[i]["contact_information"]["address"],
                "beneficiary_id": acc[recipient_index]["_id"],
                "beneficiary_type": acc[recipient_index]["name"],
                "reported_beneficiary_address" : acc[recipient_index]["contact_information"]["address"],
                "transaction_amount": random.choice([round(random.uniform(50, 250), 2),round(random.uniform(50, 12000), 2) ]),
                "fraud_vectors": [],
                "fraud_text": "",
                "AML_vectors": [],
                "AML_text": "" }
              result.append(transaction_doc)
    return result

entry = generate_entry()

if verbose:
	print(entry)
	print("\n\n\n\n")
     
if insert:
	
	tic = datetime.today();	
	x=collection.insert_many(entry, ordered=False)
	print("Documents inserted "+" in "+str(datetime.today()-tic) )
	
	print("\n\n\n\n")
      
client.close();