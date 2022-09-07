const { TableClient } = require('@azure/data-tables');

const tableClient = TableClient.fromConnectionString(process.env.APP_STORAGE_ACCOUNT_CONNECTION, 'test');

const versionString = '3.0.0';
let messageCount = 0;
module.exports = async function (context, req) {
  // set func start date
  const funcStart = new Date().toISOString();

  // calc messageCount messageTime
  messageCount++;
  const messageTime = new Date().toISOString();

  // sleep for 5 secs
  await sleep(5000);

  // set func end date
  const funcEnd = new Date().toISOString();

  // set table entity object
  const testEntity = {
    partitionKey: process.env.WEBSITE_SITE_NAME || 'localhost',
    rowKey: context.invocationId + '-' + versionString + '-' + process.env.TEST,
    serverName: process.env.CONTAINER_NAME || process.env.WEBSITE_INSTANCE_ID || 'localhost',
    // process.env.CONTAINER_NAME = 5AF3CA72-637958735555355238 = CloudRole Instance ID = The cloud role instance tells us which specific server the cloud role is running on. This is important when scaling out your application
    // process.env.WEBSITE_INSTANCE_ID = 575394f1801e9e59b4eb7be761074996b76209fdcc7f0cdc12f754792fc401cf
    // sometimes CONTAINER_NAME has a value sometimes WEBSITE_INSTANCE_ID has a value
    funcStart,
    funcEnd,
    messageTime,
    messageCount,
  };

  // create table entity in table storage
  await tableClient.createEntity(testEntity);

  //context.log(process.env);
  context.log.warn(`---> ${messageCount}`);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: 'success',
  };
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
