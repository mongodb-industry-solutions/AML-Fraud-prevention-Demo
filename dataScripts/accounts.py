import pymongo
import os
from datetime import datetime
import random
from mimesis import Person
from mimesis.locales import Locale
from mimesis import Address, Finance
from mimesis.schema import Field, Fieldset, Schema

## GLOBAL INPUTS

from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
client = pymongo.MongoClient(mongo_uri)
database_name = os.getenv("MONGODB_DB")
db=client[database_name]
collection = db['accounts']

## INPUTS
bulk_size = 1
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
finance=Finance(loc_str)


######################## CREATING THE ACCOUNT ########################

def name_generator():
    
    entity=[random.choice(['individual','company'])]
    if entity[0]=='individual':
        entity.append(person.full_name())
    else:
        entity.append(finance.company())
    
    result={
        "_id": random.randint(10000, 99999),
        "name": entity[1],
        "entity_type": entity[0],
        "contact_information":{
            "address": random.choice([f"{address.address()}, {address.city()}, {address.postal_code()}, {random.choice(['USA', 'South Africa', 'UK', 'Canada'])}",
                                      f"{address.address()}, {address.city()}, {address.postal_code()}, {random.choice(['USA', 'South Africa', 'UK', 'Canada'])}", 
                                      random.choice(['73 Enterprise Spur, New Bern, 94407, South Africa','377 Alberta Estate, Sikeston, 60938, USA','90 Pagoda Turnpike, Nacogdoches, 22561, South Africa', '1259 Pino Pine, Stockton, 03353, Canada'
                                                     ,'1338 Waterville Center, Seminole, 77245, UK','10 Lyon Bend, Calexico, 96656, USA','759 Perego Manor, Elizabeth City, 77991, UK','1398 Sawyer Park, New Smyrna Beach, 02949, Canada'
                                                     ,'189 Sunnyside Green, Rogers, 95778, USA','1318 Easement Rapids, Terrell, 95107, UK']) ]),
            "phone_number": random.choice([person.phone_number(),person.phone_number(),person.phone_number(),random.choice(['+1-971-544-3805','+16415563084','+17045777905', '+14580888224','+1-832-916-0494','+1-724-587-4254']) ]),
            "email": random.choice([person.email(),person.email(),person.email(),random.choice(['schemes1855@protonmail.com', 'centuries1991@example.com', 'contributors1969@example.com', 'interfaces2022@example.org', 'self1912@example.org', 'glen2094@protonmail.com']) ]),
        },
        "risk": random.choice(['low', 'medium', 'high']),
    }
    return result

def generate_entry():
    _ENTRY = Schema(schema=lambda: name_generator(), iterations=bulk_size)
    return _ENTRY

# Generate multiple entries
entry = generate_entry()

if verbose:
	print(entry.create())
	print("\n\n\n\n")

if insert:
	
	# Note that you don't pass in self despite the signature above
	tic = datetime.today();	
	x=collection.insert_many(entry, ordered=False)
	print("Documents inserted "+" in "+str(datetime.today()-tic) )
	
	print("\n\n\n\n")
client.close();