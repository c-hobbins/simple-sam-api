// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.DEVICE_TABLE;
const DDB_ENV = process.env.AWSENV || 'AWS';

// Create a DocumentClient that represents the query to add an item
//const dynamodb = require('aws-sdk/clients/dynamodb');
const { DynamoDBClient, ScanCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

//const docClient = new dynamodb.DocumentClient({"endpoint": "http://ddb-local:8000"}); //works-old way
/*
if (DDB_ENV === 'LOCAL'){
    const docClient = new DynamoDBClient({endpoint: "http://ddb-local:8000"}); //works
}else{
    const docClient = new DynamoDBClient(); 
}
*/
const docClient = new DynamoDBClient();

exports.getAllItems = async (event) => {
    /*
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    */
    // All console.info/log statements are written to CloudWatch
    console.info('testing 123');
    console.info('tableName:', tableName);
    console.info('received event:', JSON.stringify(event));

    // get all items from the table (only first 1MB data, you can use `LastEvaluatedKey` to get the rest of data)
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html

    
    let params = {
        TableName : tableName
    };

    let response = {};

    try{
        const result = await docClient.send(new ScanCommand(params));
//        console.log(JSON.stringify(result));
        let arrayOfItems = [];
        result.Items.forEach(item=>{
            arrayOfItems.push(unmarshall(item));
        })
        response.statusCode = 200;
        //response.count = result.Count;
        response.body = JSON.stringify(arrayOfItems);
    }
    catch(e){
        console.info(e);
        console.error(`Failed trying to query DDB. Error ${e}`);
        response.statusCode = 500;
        response.body = JSON.stringify({"msg": "FAILED"});
    }
    
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode}`);

    return response;
}

exports.getItemById = async (event) => {
    if (event.httpMethod !== 'GET') {
      throw new Error(`Sorry, getMethod only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received event:', JSON.stringify(event));
   
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
    const id = event.pathParameters.id;
   
    // Get the item from the table
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
    var params = {
      TableName : tableName,
      Key: marshall({ 
          ID: id,
          SK: 'reading'
     })
    };
    
    let response = {};

    try{
        //const result = await docClient.scan(params).promise();
        const result = await docClient.send(new GetItemCommand(params));
        const items = unmarshall(result.Item);
        response.statusCode = 200;
        response.body = JSON.stringify(items);
    }
    catch(e){
        console.info(e);
        console.error(`Failed trying to query DDB. Error ${e}`);
        response.statusCode = 500;
        response.body = JSON.stringify({"msg": "FAILED"});
    }
   
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  }
