require('dotenv').config();
const { executeQuery, buildFilter } = require('./lib');

module.exports = async function (context, req) {
    context.log('Executing query request...');

    let result = [];
    let status = 200;

    if (req.method === 'GET') {
        let query = '';

        try {
            query = buildFilter(req.query);
        } catch (ex) {
            context.log({msg: 'Error occurred while parsing query parameters', ex, query: req.query});
            status = 400;
        }

        if (query) {
            try {
                result = await executeQuery(query);
            } catch (ex) {
                context.log({msg: 'An error occured while processing SQL query', ex, query});
                status = 500;
            }
        }

    }

    context.res = {
        status,
        // status: 200, /* Defaults to 200 */
        body: result
    };
}
