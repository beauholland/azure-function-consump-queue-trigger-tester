require('dotenv').config();
const AzureStorageQueue = require('@azure/storage-queue');
const { QueueServiceClient } = require('@azure/storage-queue');

const queueServiceClient = QueueServiceClient.fromConnectionString(process.env.STORAGE_ACCOUNT_CONNECTION);
const queueName = 'test-queue-items';
const queueClient = queueServiceClient.getQueueClient(queueName);

// var keepCalling = true;
// var messageCount = 0;
// setTimeout(function () {
//   keepCalling = false;
// }, 5000);

// while (keepCalling) {
//   addMessageToQueue();
// }

var loopEveryMs = 5000;
var numMessagesToAddForEachLoop = 5;
var messageCount = 0;

// loop every 1 sec
function startLoop() {
  console.log('start loop');
  var i = setInterval(loopMessageCount, loopEveryMs);
}

// create 10 messages in each loop
function loopMessageCount() {
  var times = numMessagesToAddForEachLoop;
  for (var i = 0; i < times; i++) {
    addMessageToQueue();
  }
}

function addMessageToQueue() {
  messageCount++;

  const queueMessage = {
    body: {
      time: new Date().toISOString(),
      count: messageCount,
    },
  };

  const encodedMessage = Buffer.from(JSON.stringify(queueMessage)).toString('base64');
  queueClient.sendMessage(encodedMessage);
  console.log(`Sent message: ${JSON.stringify(queueMessage)}`);
}

// Start the loop every 1 sec to create 10 messages
startLoop();
