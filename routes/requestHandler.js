const logger = require('../logger')

/*
    PARAMS: function that is handling the request must be promised based at the current moment
*/
const AsynchronousHTTPRequest = (controllerFn) => {
    return function (req, res) {
        let successHandler = response => {
            logger.info('Async Request Complete', { req, req }, response)
        }

        let errorHandler = err => {
            logger.error('Async Request Errored', { req, req }, err)
            return
        }
        res.status(202)
        res.json({ message: 'Request Being Processed' })
        return controllerFn({ ...req.params, ...req.body })
            .then(successHandler, errorHandler)
    }
}

/*
    PARAMS: function that is handling the request must be promised based at the current moment
*/
const SynchronousHTTPRequest = (controllerFn) => {

    return function (req, res) {
        let successHandler = response => {
            res.status(response.status || 200)
            res.json(response)
        }

        let errorHandler = err => {
            res.status(err.status || 500)
            res.json(err)
        }
        return controllerFn({ ...req.params, ...req.body })
            .then(successHandler, errorHandler)
    }
}


module.exports = { AsynchronousHTTPRequest, SynchronousHTTPRequest }


