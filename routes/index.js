const express = require('express'),
    router = express.Router(),
    { SynchronousHTTPRequest } = require('./requestHandler'),
    metrics = require('./metrics')
//This is a health check endpoint to determine whether or not the PCF lockers app is up and running
router.get('/', SynchronousHTTPRequest(() => Promise.resolve({ message: 'I am Alive' })))


router.use('/metrics', metrics)

module.exports = router;