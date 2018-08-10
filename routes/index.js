const express = require('express'),
    router = express.Router(),
    { HttpRequest, AsynchronousRequest, SynchronousRequest } = require('./requestHandler'),
    metrics = require('./metrics')
//This is a health check endpoint to determine whether or not the PCF lockers app is up and running
router.get('/', SynchronousRequest(HttpRequest(() => Promise.resolve({ message: 'I am Alive' }))))


router.use('/metrics', metrics)

module.exports = router;