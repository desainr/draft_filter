const { client, pg } = require('./db');

const execute = async (query) => {
  return client.query(query);
}

module.exports = execute;
