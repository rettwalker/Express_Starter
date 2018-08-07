const chai = require('chai'),
    sinon = require('sinon'),
    config = require('../../../config'),
    SynchronousController = require('../../../controllers/SynchronousController'),
    logger = require('../../../logging/loggerModel'),

var expect = chai.expect;

describe('SynchronousController', () => {
    let req, res, ProcessResponse, ProcessResponseError, LoggerStub
    beforeEach(() => {
        ProcessResponse = { results: 'are fun' }
        ProcessResponseError = {
            message: 'BIGERROR'
        }
        req = {
            method: '',
            params: {
                aParameter: '1234'
            },
            body: { message: 'do something' }
        }
        res = {
            status: sinon.stub(),
            json: sinon.stub(),
            req: req
        }
        LoggerStub = sinon.stub(logger, 'sendLogs')
        ProcessStub = sinon.stub()
    })
    afterEach(() => {
        LoggerStub.restore()

    })
});