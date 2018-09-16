const express = require('express'),
    router = express.Router(),
    { GenericSystemMetrics } = require('../../controllers/metrics'),
    { SynchronousHTTPRequest } = require('../requestHandler')
router.get('', SynchronousHTTPRequest(() => Promise.resolve({ message: 'Where our API is at' })))

module.exports = router