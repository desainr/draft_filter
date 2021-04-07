const pg = require('pg-promise')({});

const client = pg(process.env['POSTGRES_CONNECTION_STRING']);

module.exports = {
  client,
  pg,
};
