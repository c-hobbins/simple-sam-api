// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
//const dynamodb = require('aws-sdk/clients/dynamodb');

const DDB_ENV = process.env.AWSENV || 'AWS';

//const docClient = new dynamodb.DocumentClient({"endpoint": "http://ddb-local:8000"}); //works

// Get the DynamoDB table name from environment variables
const tableName = process.env.DEVICE_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.processDbStream = async (event) => {
    console.log("In the processDbStream event handler...");
     console.log('Received event:', JSON.stringify(event, null, 2));
     event.Records.forEach((record) => {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);

};
