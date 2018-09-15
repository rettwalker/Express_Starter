const logger = require('../logger'),
    utility = require('../utility')
const Middleware = {
    syntaxCheck(err, req, res, next) {
        if (err instanceof SyntaxError) {
            logger.warn('Syntax Error Found', { req: req });
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

module.exports = Middleware;