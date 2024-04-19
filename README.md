# MongoDB Vector Search and OpenAI Embeddings for Combating AML and Fraud Demo

Fraud and anti-money laundering (AML) are major concerns for both businesses and consumers, affecting areas like financial services and e-commerce. Traditional methods of tackling these issues, such as rule-based systems and predictive artificial intelligence (AI), have been useful over the years but can be outsmarted by clever fraudsters who are constantly leveraging new techniques.  Enter generative AI, the next step in the evolution of machine learning and AI for fraud detection. This technology brings real-time analysis and adaptive learning to the table, greatly improving how we spot and react to fraud.

[Watch the video!](https://drive.google.com/file/d/1t8g5PmB296VNeafMwhAYVzHQE-AZRCnL/view)

This GitHub repository presents a demo in which we walk in the shoes of a customer who accesses a bank's website to perform transactions. We will focus on the clearing stage of the transaction, where the bank goes through a series of verifications to combat fraud and uphold sanctions and anti money laundering (AML) laws.  

The demo will therefore present a Know Your Customer (KYC) API, to be able to flag Sanctioned accounts and an innovative process to flag both AML and fraud cases. These processes include AI embeddings as well as MongoDB functionalities such as full-text and vector search, Atlas App Services and others. for a high level technical overview feel free to reference the architecture below.

![image](/Architecture.png)

> [!Note]
> As the title of the demo indicates, we will be using an OpenAI model and therefore you will need an OpenAI API KEY. This is not included in the GitHub. You can also decide to change to an open-source model but this will require some light code changes.

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

You can also dive into the following resources: 
- [Fraud Prevention with MongoDB](https://www.mongodb.com/industries/financial-services/fraud-prevention)
- [Resources to Build AI-powered Apps](https://www.mongodb.com/library/use-cases/artificial-intelligence)


## Disclaimer

This product is not a MongoDB official product. Use at your own risk!