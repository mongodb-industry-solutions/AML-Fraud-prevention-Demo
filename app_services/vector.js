exports = async function(payload) {
    let requestBody;
    try {

      requestBody = JSON.parse(payload.body.text());
      console.log(requestBody.pipeline);
      
      const mongodb = context.services.get("mongodb-atlas");
      const db = mongodb.db("AML_Fraud_detection"); 
      const collection = db.collection(requestBody.col); 
      
      const result = await collection.aggregate(requestBody.pipeline);
  
      return { document: result };
  
    } catch (error) {
      console.error('Error retrieving document:', error);
      return { error: 'Internal Server Error', req: requestBody };
    }
  };
  