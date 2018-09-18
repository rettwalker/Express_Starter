let config = require('./config'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    express = require('express'),
    compression = require('compression'),
    { syntaxCheck, requestLogger, requestCounters, responseCounters } = require('./middleware'),
    routes = require('./routes'),
    app = express(),
    metrics = require('./util/metrics')

app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json())

app.use(compression(), syntaxCheck, requestLogger, requestCounters, responseCounters)

metrics.startCollection();

app.use('/', routes)

let server = require('http')
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        logger.info('Application Started UP')
    })

app.set('showStackError', true)

module.exports = app