const express = require('express'),
    router = express.Router(),
    { GenericSystemMetrics } = require('../../controllers/metrics'),
    { SynchronousHTTPRequest } = require('../requestHandler')
router.get('/', SynchronousHTTPRequest(() => Promise.resolve(GenericSystemMetrics())))

module.exports = router