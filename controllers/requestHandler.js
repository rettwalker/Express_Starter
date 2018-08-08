const EventEmitter = require('events'),
    logger = require('../logging/loggerModel')

const RequestHandler = (passedFn) => {
    return (req, res) => {
        function handleSuccess(data) {
            res.status(200)
            res.json({ data: data })
        }

        function handleError(err) {
            res.status(500)
            return res.json({ ...err })
        }

        return passedFn(req, res)
            .then(handleSuccess, handleError)
    }
}

module.exports = RequestHandler;