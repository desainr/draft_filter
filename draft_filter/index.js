require('dotenv').config();
const { executeQuery, buildFilter } = require('./lib');

module.exports = async function (context, req) {
    context.log('Executing query request...');

    let result = [];
    if (req.method === 'GET') {
        const filter = buildFilter(req.query);

        result = await executeQuery(filter);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result
    };
}
