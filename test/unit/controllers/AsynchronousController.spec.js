const chai = require('chai'),
    sinon = require('sinon'),
    config = require('../../../config'),
    AsynchronousController = require('../../../controllers/AsynchronousController'),
    logger = require('../../../logging/loggerModel'),
    EventEmitter = require('events')

var expect = chai.expect;

describe('AsynchronousController', () => {
    let req, orderBody, res, LoggerStub, EmitMock
    beforeEach(() => {
        ProcessResponse = { results: 'are fun' }
        ProcessResponseError = {
            message: 'BIGERROR'
        }
        controllerName = 'TEST'
        req = {
            method: '',
            params: {
                a: 'b'
            },
            body: { message: 'need you to do this' }
        }
        res = {
            status: sinon.stub(),
            json: sinon.stub(),
            req: req
        }
        LoggerStub = sinon.stub(logger, 'sendLogs');

        ManagerStub = sinon.stub()
        AsynchronousController(controllerName, ManagerStub)
    })
    afterEach(() => {
        LoggerStub.restore()
    })
    it('should have name and needed handlers', () => {
        expect(processor).to.have.property('dataHandler')
        expect(processor).to.have.property('errorHandler')
        expect(processor).to.have.property('successHandler')
    })
});