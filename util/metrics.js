const { register, Counter, Summary, collectDefaultMetrics } = require('prom-client'),
    logger = require('../logger');

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
module.exports.callCount = callCount = new Counter({
    name: 'volume',
    help: 'volume for all endpoints',
    labelNames: ['path', 'method']
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
module.exports.responses = responses = new Summary({
    name: 'responses',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
module.exports.startCollection = function () {
    logger.info(`Starting the collection of metrics, the metrics are available on /metrics`);
    collectDefaultMetrics();
};

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
module.exports.requestCounters = function (req, res, next) {
    if (req.path != '/metrics') {
        callCount.inc({ path: req.path, method: req.method });
    }
    next();
}

/**
 * In order to have Prometheus get the data from this app a specific URL is registered
 */
module.exports.injectMetricsRoute = function (app) {
    app.get('/metrics', (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(register.metrics());
        callCount.reset()
    });
};