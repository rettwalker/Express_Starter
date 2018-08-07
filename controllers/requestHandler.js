const EventEmitter = require('events'),
    logger = require('../logging/loggerModel')

const RequestHandler = (Controller) => {
    let handler = Object.assign({}, EventEmitter.prototype, Controller)
    handler.handleMessage = (req, res) => {
        handler.emit('data', new Date(), res)
    }
    handler.on('data', handler.dataHandler)
    handler.on('success', handler.successHandler)
    handler.on('error', handler.errorHandler)
    //controller.on('retry', controller.retryHandler)
    return handler
}

module.exports = RequestHandler;