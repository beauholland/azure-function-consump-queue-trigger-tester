const { TableClient } = require('@azure/data-tables');

const tableClient = TableClient.fromConnectionString(process.env.APP_STORAGE_ACCOUNT_CONNECTION, 'test');

module.exports = async function (context, myQueueItem) {
  // set func start date
  const funcStart = new Date().toISOString();

  // destruct data from the message
  const { time: messageTime, count: messageCount } = myQueueItem.body;

  // sleep for 5 secs
  await sleep(5000);

  // set func end date
  const funcEnd = new Date().toISOString();

  // set table entity object
  const testEntity = {
    partitionKey: process.env.WEBSITE_SITE_NAME || 'localhost',
    rowKey: context.invocationId,
    serverName: process.env.CONTAINER_NAME || 'localhost', // 5AF3CA72-637958735555355238 = CloudRole Instance ID = The cloud role instance tells us which specific server the cloud role is running on. This is important when scaling out your application
    funcStart,
    funcEnd,
    messageTime,
    messageCount,
  };

  // create table entity in table storage
  await tableClient.createEntity(testEntity);

  context.log(process.env);
  context.log.warn(`---> ${messageCount}`);
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
