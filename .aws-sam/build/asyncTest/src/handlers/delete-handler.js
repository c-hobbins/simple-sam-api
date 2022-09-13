// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.DEVICE_TABLE;
const DDB_ENV = process.env.AWSENV || 'AWS';

// Create a DocumentClient that represents the query to add an item
//const dynamodb = require('aws-sdk/clients/dynamodb');
const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
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

exports.deleteItem = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`Function handler 'deleteItem' only handles the DELETE method, you tried: ${event.httpMethod}`);
    }
    
    // All console.info/log statements are written to CloudWatch
    console.info('tableName:', tableName);
    console.info('received event:', JSON.stringify(event));
    
    // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
    const id = event.pathParameters.id;

    let params = {
        TableName : tableName,
        ReturnValues: "ALL_OLD",
        Key: marshall({ ID: id, SK: 'reading' }),
        ReturnConsumedCapacity: "TOTAL"
    };

    let response = {};

    try{
        const result = await docClient.send(new DeleteItemCommand(params));
        //const deletedItem = result.Attributes.;
        response.statusCode = 200;
        response.body = JSON.stringify(result);
    }
    catch(e){
        console.info(e);
        console.error(`Failed trying to deleted item. Error ${e}`);
        response.statusCode = 500;
        response.body = JSON.stringify({"msg": "FAILED"});
    }
    
    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

    return response;
}
