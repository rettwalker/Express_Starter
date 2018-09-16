let config = require('./config'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    express = require('express'),
    compression = require('compression'),
    { syntaxCheck } = require('./middleware'),
    routes = require('./routes'),
    app = express(),
    prometheus = require('./util/metrics')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(compression())

//error handling for bad json
app.use(syntaxCheck)

// app.use(function (req, res, next) {
//     logger.info({ req: req }, 'initiate request')
//     function afterResponse() {
//         res.removeListener('close', afterResponse)
//         res.removeListener('finish', afterResponse)
//         // action after response
//         let endTime = new Date()
//         logger.info({ req: res, statusCode: res.statusCode, latency: endTime.getTime() - res.startTime.getTime() }, 'finish request')
//     }
//     res.on('finish', afterResponse)
//     res.on('close', afterResponse)
//     res.url = req.path
//     res.startTime = new Date()
//     next()
// })

/**
 * The below arguments start the counter functions
 */
app.use(prometheus.requestCounters);

/**
 * Enable metrics endpoint
 */
app.use(prometheus.requestCounters);
prometheus.injectMetricsRoute(app);

/**
 * Enable collection of default metrics
 */
prometheus.startCollection();

app.use('/', routes)

let server = require('http')
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        logger.info('Application Started UP')
    })

app.set('showStackError', true)

module.exports = app