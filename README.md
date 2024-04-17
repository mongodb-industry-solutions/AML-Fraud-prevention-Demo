# MongoDB Vector Search and OpenAI Embeddings for Combating AML and Fraud Demo

Fraud and anti-money laundering (AML) are major concerns for both businesses and consumers, affecting areas like financial services and e-commerce. Traditional methods of tackling these issues, such as rule-based systems and predictive artificial intelligence (AI), have been useful over the years but can be outsmarted by clever fraudsters who are constantly leveraging new techniques.

[Watch the video!](https://drive.google.com/file/d/1s6GfU0pe5gaZIauqF6O7KRBURv_3KKNr/view?usp=drive_link)

This GitHub repository presents a demo in which you will be able to log on as a bank's client. As such, you will see the user's ledger as well as make new transactions. These transactions will pass through a custom verification process that will determine if the transaction is suspected of AML, Fraud, or if any involved party has been sanctioned. This process includes existing MongoDB functionalities such as full-text search and vector search.

![image](/Architecture.png)

> [!Note]
> As the title of the demo indicates, we will be using an OpenAI model and therefore will need an OpenAI API KEY. This is not included in the GitHub. You can also decide to change to an open-source model but will require some light code changes.

## Installation

The installation is divided into 5 parts:
- [Provisioning an M0 Atlas instance](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) and [creating your own App Services application](https://www.mongodb.com/docs/atlas/app-services/apps/create/).
- [Installation of the dataset](./dataScripts)
- [Installation of the serverless function](./app_services)
- [Installation of the backend](./backend/)
- [Installation of the frontend](./frontend/)

## Summary

This demonstration serves as an interesting example for clearing transactions using innovative technologies such as OpenAI embeddings and MongoDB search capabilities.

In the previous sections, we explored how to:
- Create your own dataset
- Set up your own microservice with MongoDB's app services
- Set up your collection for both full-text and vector search.

Are you prepared to harness these capabilities for your projects? Should you encounter any roadblocks or have questions, our vibrant [developer forums](https://www.mongodb.com/community/forums/) are here to support you every step of the way. Or if you prefer to contact us directly at [industry.solutions@mongodb.com](mailto:industry.solutions@mongodb.com).


## Disclaimer

This product is not a MongoDB official product. Use at your own risk!