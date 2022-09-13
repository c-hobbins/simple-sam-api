// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const { DynamoDBClient, PutItemCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const DDB_ENV = process.env.AWSENV || 'AWS';

/*
if (DDB_ENV === 'LOCAL'){
    const docClient = new DynamoDBClient({endpoint: "http://ddb-local:8000"}); //works
}else{
    const docClient = new DynamoDBClient(); 
}
*/
const docClient = new DynamoDBClient();

// Get the DynamoDB table name from environment variables
const tableName = 'Devices';//process.env.DEVICE_TABLE;


/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.insertDeviceReading = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received event:', JSON.stringify(event));
    console.info('tableName from ENV.json: ', tableName);
    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    let response = {};
    //Old way...use the marshall utility to map json to dynamodb types
/*
    var item = {};
    item.ID = { S: `${body.ID}`};
    item.SK = { S: "reading"};
    item.LOC_REG = { S: `${body.LOC_REG}`};
    item.LOC_BLDG = { S: `${body.LOC_BLDG}`};
    item.LOC_FLR = { S: `${body.LOC_FLR}`};
    item.LOC_SCTR = { S: `${body.LOC_SCTR}`};
    item.LOC_SK = { S: `${body.LOC_REG}#${body.LOC_BLDG}#${body.LOC_FLR}#${body.LOC_SCTR}`};
    item.TEMP = { N: body.TEMP};
    item.HUM = { N: body.HUM};
    item.GAS = { N: body.GAS};
    item.DECB = { N: body.DECB};
    item.CO2 = { N: body.CO2};
    item.DUST = { N: body.DUST};
    item.PRESSURE = { N: body.PRESSURE};
    item.TVOC = { N: body.TVOC};
*/
    var item = {};
    
    item.ID = body.ID;
    item.SK = 'reading';
    item.LOC_REG = body.LOC_REG;
    item.LOC_BLDG = body.LOC_BLDG;
    item.LOC_FLR = body.LOC_FLR;
    item.LOC_SCTR = body.LOC_SCTR;
    item.LOC_SK = `${body.LOC_REG}#${body.LOC_BLDG}#${body.LOC_FLR}#${body.LOC_SCTR}`;
    item.TEMP = body.TEMP;
    item.HUM = body.HUM;
    item.GAS = body.GAS;
    item.DECB = body.DECB;
    item.CO2 = body.CO2;
    item.DUST = body.DUST;
    item.PRESSURE = body.PRESSURE;
    item.TVOC = body.TVOC;
    
    //console.log(item);

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
 /*
    const inputParams = {
        TableName : tableName,
        Item: item 
    };
*/
    const inputParams = {
        TableName : tableName,
        Item: marshall(item)
    };

    try{
        const result = await docClient.send(new PutItemCommand(inputParams));
        //const result = await docClient.send(new ListTablesCommand({}));
        console.log('result:');
        console.log(result);
        console.log('*******');
        console.info(`Received result from DDB.DocumentClient => ${JSON.stringify(result)}`);
        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    }catch(e){
        console.error("FAILED!" + e);
    }
    
    

    // All log statements are written to CloudWatch
    //console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}