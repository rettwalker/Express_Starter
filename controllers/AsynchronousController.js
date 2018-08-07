const logger = require('../logging/loggerModel'),
    config = require('../config')

const AsynchronousController = (ControllerName, Manager) => ({
    dataHandler(startTime, res) {
        let body = Object.assign({}, res.req.body, res.req.params)
        logger.sendLogs('http', { 'url': 'API handle message', 'requestBody': body })
        res.status(202)
        res.json({ message: 'Request Being Processed', data: body })
        return Manager(body)
            .then(valid => {
                this.emit('success', body, startTime)
            })
            .catch(err => {
                this.emit('error', startTime, err)
            })
    },
    successHandler(body, startTime) {
        logger.sendLogs('debug', { 'className': 'AsynchronousController', 'method': 'successHandler', 'debugMessage': body })
    },
    errorHandler(startTime, err) {
        logger.sendLogs('error', { 'className': 'AsynchronousController', 'method': 'errorHandler', 'errorMessage': err })
    }
})

module.exports = AsynchronousController