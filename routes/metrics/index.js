const express = require('express'),
    router = express.Router(),
    { GenericSystemMetrics } = require('../../controllers/metrics'),
    { HttpRequest, AsynchronousRequest, SynchronousRequest } = require('../requestHandler')
router.get('/', SynchronousRequest(HttpRequest(GenericSystemMetrics)))

module.exports = router