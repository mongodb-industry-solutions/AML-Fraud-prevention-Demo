# MongoDB Vector Search and Open AI Embeddings Demo for Combating AML and Fraud Demo

Fraud and anti-money laundering (AML) are major concerns for both businesses and consumers, affecting areas like financial services and e-commerce. Traditional methods of tackling these issues, such as rule-based systems and predictive artificial intelligence (AI), have been useful over the years but can be outsmarted by clever fraudsters who are constantly leveraging new techniques. 

[Watch the video!](https://www.mongodb.com/blog/post/credit-scoring-applications-with-generative-ai)

This GitHub repository presents a demo in which you will be able to log on as a bank's client. As such you will see his/her ledger as well as make new transactions. These transactions will pass through a custom 
verification process that will determined if the transaction is suspected of AML, Fraud or if any involved party has been sanctioned. This process include exiting MongoDB functionalities such as full text search and vector search.

## Installation of the Demo

The installation is divited into 5 parts:
- [provisioning an M0 Atlas instance](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/) and [creating your own App Services application](https://www.mongodb.com/docs/atlas/app-services/apps/create/#:~:text=An%20App%20Services%20App%20is,and%20have%20Project%20Owner%20permissions.).
- [Installation of the dataset](./dataScripts)
- [Installation of the serveless function](./app_services)
- [Installation of the backend](./backend/)
- [Installation of the frontend](./frontend/)

# Summary

Certainly, the Healthcare Virtual Hospital Demo serves as a comprehensive showcase of MongoDB's diverse functionalities and their seamless adaptability within the healthcare domain. This demonstration illustrates how MongoDB can effectively meet the specific needs of healthcare applications.

In the previous sections, we explored how to:
- Create your own dataset
- Set up your own micro sercive with MongoDB's app services
- Set up you collection for both full text and vector search.

Are you prepared to harness these capabilities for your projects ? 
Should you encounter any roadblocks or have questions, our vibrant [developer forums](https://www.mongodb.com/community/forums/) are here to support you every step of the way. Or if you prefer conctact us directly at industry.solutions@mongodb.com