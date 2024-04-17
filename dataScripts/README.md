Here's the spell-checked version of your text:

These are some Python scripts to generate randomly generated documents for your demo collections.

## Getting Started

First, make sure that you have all of the requirements installed in your Python instance:

```bash
pip install -r requirements.txt
# or
pip3 install -r requirements.txt
```

Next, please make sure to add a .env file in the folder <location_of_your_repo>/AML-Fraud-prevention-Demo/dataScripts. It should include the following:

```md
MONGODB_URI=<Your_connection_string>
MONGODB_DB=AML_Fraud_detection
OPENAI_API_KEY=<Your_OpenAI_api_key>
```

> [!Note]
> Please follow [these instructions](https://www.mongodb.com/docs/manual/reference/connection-string/) if you can't find your connection string.

Lastly, run the scripts in this order:
- accounts.py
- sanctioned.py
- transactions.py
- embedding.py
- status.py

The first three scripts should be fast and generate the AML_Fraud_detection database with three collections in your cluster:
- accounts (with 600 documents)
- sanctioned (with 150 documents)
- transactions (with 18000 documents)

The remaining scripts, namely embeddings and status, are there to initialize the data. Indeed, we need to assign a pattern to each transaction and whether it succeeded or not. Because these scripts have to go through all of the data, they will take considerably longer depending on your computer (around 50 minutes).
- embedding.py: This will generate the text pattern and its embeddings that will allow us to do a similarity search later on.
- status.py: This will follow a predefined logic to either flag or not transactions.

Lastly, you should create two search indexes on the "transactions" collection.

One called "AML":

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "AML_vectors",
      "numDimensions": 1536,
      "similarity": "dotProduct"
    }
  ]
}
```

and the other is called "fraud":

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "fraud_vectors",
      "numDimensions": 1536,
      "similarity": "dotProduct"
    }
  ]
}
```

It usually takes a couple of minutes. If you need more information on how to create search indexes, please refer to [this tutorial](https://www.mongodb.com/docs/atlas/atlas-search/create-index/).

Once you have done everything, we can move on to the next part:
- [Installation of the serverless function](../app_services)