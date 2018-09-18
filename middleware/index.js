const logger = require('../logger'),
    utility = require('../util'),
    ResponseTime = require('response-time'),
    { responses, callCount } = require('../util/metrics')

const Middleware = {
    syntaxCheck(err, req, res, next) {
        if (err instanceof SyntaxError) {
            logger.error('Syntax Error Found', { req: req });
            res.status(500);
            res.json('BAD JSON');
        } else {
            next();
        }
    },
    requestProcessBodyCheck(req, res, next) {
        let missingProperties = utility.GetMissingProperty([], req.body)
        if (missingProperties) {
            //logger.sendLogs('error', { 'className': 'Middleware', 'method': 'requestProcessBodyCheck', 'errorMessage': { message: `INVALID REQUEST.  MISSING: ${missingProperties}` } })
            res.status(400)
            return res.json({
                message: `INVALID REQUEST.  MISSING: ${missingProperties}`
            });
        }
        next();
    }
}

const requestLogger = (req, res, next) => {
    logger.info({ req: req }, 'initiate request')
    return next()
}

const responseCounters = ResponseTime(function (req, res, time) {
    if (req.url != '/metrics') {
        responses.labels(req.method, req.url, res.statusCode).observe(time);
    }
})

/**
 * This function increments the counters that are executed on the request side of an invocation
 * Currently it increments the counters for numOfPaths and pathsTaken
 */
const requestCounters = function (req, res, next) {
    if (req.path != '/metrics') {
        callCount.inc({ path: req.path, method: req.method });
    }
    next();
}

module.exports = { responseCounters, requestLogger, requestCounters, ...Middleware };