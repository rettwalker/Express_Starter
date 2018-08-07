const express = require('express'),
    router = express.Router()

//This is a health check endpoint to determine whether or not the PCF lockers app is up and running
router.get('/', function (req, res) {
    res.status(200).json({ message: 'I am alive!' })
})
module.exports = router;