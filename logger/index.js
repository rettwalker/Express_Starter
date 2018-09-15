// these are the default values
let bunyan = require('bunyan')
let log = bunyan.createLogger({
    name: 'REPLACEME',
    serializers: {
        req: ({ method, url, headers }) => { return { method, url, headers } }
    }
})

module.exports = log