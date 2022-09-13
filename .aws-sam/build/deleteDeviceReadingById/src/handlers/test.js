exports.asyncTest = async (event, context) => {
    console.info("In the async event handler...");
    console.info('Received event:' + JSON.stringify(event));
    console.info('Received context:' + JSON.stringify(context)); 
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('TIMER DONE !!!');
   // callback(null, `Successfully processed ${event.Records.length} records.`);
    return "ASYNC_OK";
};


exports.syncTest = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = true;
    console.info("In the synch event handler...");
    console.info('Received event:' + JSON.stringify(event));
    console.info('Received context:' + JSON.stringify(context));
    setTimeout( function(){
        console.log('TIMER DONE !!!');
    }, 5000);
    callback(null, `SYNC_OK`);
};