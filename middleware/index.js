const logger = require('../logging/loggerModel'),
    utility = require('../utility')
const Middleware = {
    syntaxCheck(err, req, res, next) {
        if (err instanceof SyntaxError) {
            logger.sendLogs('error', { 'className': 'app', 'method': 'use', 'errorMessage': { message: 'BAD JSON' }, 'url': 'app' });
            res.status(500);
            res.json('BAD JSON');
        } else {
            next();
        }
    },
    setResponseHeaders(req, res, next) {
        logger.sendLogs('http', { 'url': req.path, 'requestBody': req.body });
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin");
        next();
    },
    requestProcessBodyCheck(req, res, next) {
        let missingProperties = utility.GetMissingProperty([], req.body)
        if (missingProperties) {
            logger.sendLogs('error', { 'className': 'Middleware', 'method': 'requestProcessBodyCheck', 'errorMessage': { message: `INVALID REQUEST.  MISSING: ${missingProperties}` } })
            res.status(400)
            return res.json({
                message: `INVALID REQUEST.  MISSING: ${missingProperties}`
            });
        }
        next();
    }
}

module.exports = Middleware;