This is are some simple APIs built on python

## Getting Started

First, make sure that you all of the requirements installed in your python instance:

```bash
pip install -r requirements.txt
# or
pip3 install -r requirements.txt
```

> [!Warning]
> Please keep in mind that these are different from the ones in the <location_of_your_repo>/AML-Fraud-prevention-Demo/dataScripts/requirements.txt file.

Next, please make sure to add a .env file in the foler <location_of_your_repo>/AML-Fraud-prevention-Demo/backend .
It should include the following :

```md
MONGODB_URI=<Your_connexion_string>
MONGODB_DB=AML_Fraud_detection
OPENAI_API_KEY=<Your_OpenAI_api_key>
```

Lastly, run the development server:

```bash
python app.py
# or
python3 app.py
# or if you are running it on a server
pm2 start app.py --interpreter=python3
```

You should have two APIs:
- http://localhost:8080/embedings?_id=<id_of_the_document_you_want_to_add_embeddings_to>
- http://localhost:8080/verification?_id=<id_of_the_document_you_want_to_verify>


> [!Warning]
> If you want to deploy this on a server then you will need to install pm2, on top of the requirements. you will also need to call the APIs with the server's API which will need to be updated on the <location_of_your_repo>/AML-Fraud-prevention-Demo/frontend/.env file.