require('dotenv').config();
const { TableClient, TableServiceClient, AzureSASCredential } = require('@azure/data-tables');

const account = process.env.STORAGE_ACCOUNT_NAME;
const sas = process.env.STORAGE_ACCOUNT_TABLE_SAS;

const serviceClientWithSAS = new TableServiceClient(`https://${account}.table.core.windows.net`, new AzureSASCredential(sas));

async function main() {
  const deleteOrCreate = process.argv.slice(2)[0];

  if (deleteOrCreate === 'delete') {
    await deleteTable();
    console.log('Takes some time - wait for the table to be deleted before creating it again');
  }
  if (deleteOrCreate === 'create') {
    await createTable();
  }
  //await createTableEntityItem();
  console.log('Completed');
}

async function deleteTable() {
  await serviceClientWithSAS.deleteTable('test', {
    onResponse: async (response) => {
      console.log(response.status);
    },
  });
}

async function createTable() {
  await serviceClientWithSAS.createTable('test', {
    onResponse: async (response) => {
      console.log(response.status);
    },
  });
}

// async function createTableEntityItem() {
//   let tableClient = TableClient.fromConnectionString(process.env.STORAGE_ACCOUNT_CONNECTION, 'test');

//   let testEntity = {
//     partitionKey: process.env.WEBSITE_SITE_NAME || 'localhost',
//     rowKey: '1',
//     executionDateTime: new Date().toISOString(),
//     messageDateTime: new Date().toISOString(),
//     messageCount: new Date().toISOString(),
//   };
//   await tableClient.createEntity(testEntity);
// }

// Entry point for the function
main();
