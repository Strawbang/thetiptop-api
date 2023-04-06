'use strict'

const { Client } = require('@elastic/elasticsearch')

// const client = new Client({ node: 'http://es01:9200', maxRetries: 5, requestTimeout: 60000, sniffOnStart: true })
const client = new Client({ node: 'http://es01:9200' });

const run = async (name, message, status) => {
  console.log(name, message, status)
  const date = new Date().toISOString().slice(0, 10);
  await client.index({
    index: `api_${process.env.ENV}-${date}`,
    // refresh: true,
    body: {
      name: name,
      message: message,
      status: status
    }
  })
  await client.indices.refresh({ index: `api_${process.env.ENV}-${date}` }).then(console.log('Refresh OK')).catch((error) => { console.log(error) })


  // const { body } = await client.search({
  //   index:  `api_${process.env.ENV}-${date}`,
  //   // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
  //   body: {
  //     query: {
  //       match: {
  //         name: name
  //       }
  //     }
  //   }
  // }).then(console.log('Search OK')).catch((error) => { console.log(error) })
}

module.exports = {
  run,
}