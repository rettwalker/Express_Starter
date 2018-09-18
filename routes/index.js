const express = require('express'),
    router = express.Router(),
    { SynchronousHTTPRequest } = require('./requestHandler'),
    { register, callCount } = require('../util/metrics'),

    api = require('./api')
//This is a health check endpoint to determine whether or not the PCF lockers app is up and running
router.get('/', SynchronousHTTPRequest(() => Promise.resolve({ message: 'I am Alive' })))

router.get('/metrics', (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(register.metrics());
    callCount.reset()
})

router.use('/api', api)

module.exports = router;