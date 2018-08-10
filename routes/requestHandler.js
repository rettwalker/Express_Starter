const logger = require('../logging/loggerModel')


const HttpRequest = (controllerFn) => {
    return function () {
        return Promise.resolve(controllerFn(...arguments))
    }
}

const AsynchronousRequest = (requestFn) => {
    return function (req, res) {
        let successHandler = response => {
            logger.sendLogs('debug', { className: '', method: '', debugMessage: response })
        }

        let errorHandler = err => {
            logger.sendLogs('error', { className: '', method: '', errorMessage: err })
        }
        res.status(202)
        res.json({ message: 'Request Being Processed' })
        return requestFn({ ...req.params, ...req.body })
            .then(successHandler, errorHandler)
    }
}

const SynchronousRequest = (requestFn) => {

    return function (req, res) {
        let successHandler = response => {
            logger.sendLogs('debug', { className: '', method: '', debugMessage: response })
            res.status(200)
            res.json({ message: 'Success', data: response })

        }

        let errorHandler = err => {
            logger.sendLogs('error', { className: '', method: '', errorMessage: err })
            res.status(500)
            res.json({ message: err.message })
        }
        return requestFn({ ...req.params, ...req.body })
            .then(successHandler, errorHandler)
    }
}


module.exports = { HttpRequest, AsynchronousRequest, SynchronousRequest }


