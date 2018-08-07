const logger = require('../logging/loggerModel'),
    config = require('../config')

const SynchronousController = (Manager) => {

}

module.exports = SynchronousController


/*
({
    dataHandler(startTime, res) {
        let body = Object.assign({}, res.req.body, res.req.params)
        Manager(body)
            .then(managerRes => {
                this.emit('success', startTime, managerRes, res)
            })
            .catch(err => {
                this.emit('error', startTime, err, res)
            })
    },
    successHandler(startTime, body, res) {
        res.status(200)
        res.json({ data: body })
    },
    errorHandler(startTime, body, res) {
        res.status(500)
        res.json({ data: body })
    }
})
*/