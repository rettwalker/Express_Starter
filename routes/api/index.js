const express = require('express'),
    router = express.Router(),
    { SynchronousHTTPRequest } = require('../requestHandler')
router.get('', SynchronousHTTPRequest(() => Promise.resolve({ message: 'Where our API is at' })))

module.exports = router