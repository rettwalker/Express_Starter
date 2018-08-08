const EventEmitter = require('events'),
    logger = require('../logging/loggerModel')


const RequestHandler = (passedFn, { successHandler, errorHandler } = {}) => {
    return (req, res) => {
        const defaultSuccessHandler = (data) => {
            res.status(200)
            res.json({ data: data })
        }

        const defaultErrorHandler = (err) => {
            res.status(500)
            return res.json({ ...err })
        }

        let success = successHandler || defaultSuccessHandler
        let error = errorHandler || defaultErrorHandler
        return passedFn(req, res)
            .then(success, error)
    }
}

module.exports = RequestHandler