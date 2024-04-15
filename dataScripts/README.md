This is are some python scripts to generate a random generated documents for your demo's collections 

## Getting Started

First, make sure that you all of the requirements installed in your python instance:

```bash
pip install -r requirements.txt
# or
pip3 install -r requirements.txt
```

Next, please make sure to add a .env file in the foler <location_of_your_repo>/AML-Fraud-prevention-Demo/dataScripts .
It should include the following :

```md
MONGODB_URI=<Your_connexion_string>
MONGODB_DB=AML_Fraud_detection
OPENAI_API_KEY=<Your_OpenAI_api_key>
```

> [!Warning]
> Please follow [these instructions](https://www.mongodb.com/docs/manual/reference/connection-string/) if you can't find your connexion string

Lastly, run the scrips in this order:

- accounts.py
- sanctioned.py
- embedding.py
- sanctioned.py

At the end you should have the AML_Fraud_detection database with three collections:
- accounts (with 600 documents)
- sanctioned (with 150 documents)
- transactions (with 18000 documents)

You should also create two search indexes: