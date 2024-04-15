from gevent import monkey
_ = monkey.patch_all()
import pymongo
import os
from datetime import datetime, timedelta
import random
from mimesis import Person
from mimesis.locales import Locale
from mimesis.enums import Gender
from mimesis import Address, Generic
from mimesis.schema import Field, Fieldset, Schema

## GLOBAL INPUTS

from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db=client[database_name]
accounts = db['accounts']
collection = db['sanctioned']

## INPUTS
bulk_size = 150
date_format="%d-%m-%Y"
insert = True
verbose = False
loc=Locale.EN
loc_str='en'

print("\n")

fieldset = Fieldset(locale=loc)
field = Field(loc_str)
person =Person(loc_str)
address=Address(loc_str)
generic = Generic(loc_str)

def date_generator(minimum_age=0,maximum_age=100):
    dt=datetime.today() - timedelta(days=random.randint(365*minimum_age, 365 * maximum_age)) - timedelta(seconds=random.randint(0,12*3600))
    return(datetime(dt.year, dt.month, dt.day))

def generate_entry():
    pipeline = [{ '$sample': {'size': bulk_size}}
        , { '$project': {
                '_id': 0, 
                'entity_name': '$name', 
                'entity_type': '$entity_type',
                'address': '$contact_information.address', 
            }
        }
    ]
    result = list(accounts.aggregate(pipeline))

    for document in result:
        document["_id"] = random.randint(10000, 99999)
        document["listed_date"] = date_generator(minimum_age=0,maximum_age=15)
        document["program"] = random.choice(["561-Related","BELARUS","DARFUR","DPRK3","ELECTION-EO13848","FTO","HK-EO13936","HRIT-SY","IFSR",
                                             "IRAN-EO13871","IRAN-HR","IRAQ3","IRGC","LEBANON","MALI-EO13882","NS-PLC","RUSSIA-EO14024","SDGT",
                                             "SOMALIA","SUDAN-EO14098","SYRIA","UHRPA","VENEZUELA","WEST-BANK-EO14115","YEMEN"])
        document["List_type"] = random.choice(['UN', 'OFAC'])
        document["identifications"] = fieldset("text.word", i=random.randint(1, 4), key=lambda name: field("uuid"))
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