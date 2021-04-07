const { client, pg } = require('./db');

const execute = async (query) => {
  return client.query('SELECT * FROM players JOIN draft_picks dp on players.id = dp.player_id LIMIT 10');
}

module.exports = execute;
