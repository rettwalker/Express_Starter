const { Counter, Summary, collectDefaultMetrics, register } = require('prom-client'),
    logger = require('../logger');

/**
 * A Prometheus counter that counts the invocations with different paths
 * e.g. /foo and /bar will be counted as 2 different paths
 */
const callCount = new Counter({
    name: 'volume',
    help: 'volume for all endpoints',
    labelNames: ['path', 'method']
});

/**
 * A Prometheus summary to record the HTTP method, path, response code and response time
 */
const responses = new Summary({
    name: 'endpoint',
    help: 'Response time in millis',
    labelNames: ['method', 'path', 'status']
});

/**
 * This funtion will start the collection of metrics and should be called from within in the main js file
 */
const startCollection = function () {
    collectDefaultMetrics();
}

module.exports = { register, startCollection, responses, callCount }