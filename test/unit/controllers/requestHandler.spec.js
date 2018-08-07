const chai = require('chai'),
    sinon = require('sinon'),
    RequestHandler = require('../../../controllers/requestHandler'),
    logger = require('../../../logging/loggerModel'),
    config = require('../../../config'),
    metrics = require('../../../services/metrics'),
    expect = chai.expect

describe('API Handler', () => {
    let apiHandler, order, LoggerStub, req, res, MetricsStub, EmitMock, MockHandler
    beforeEach(() => {
        order = {
            orderNumber: 'W12345643',
            storeNumber: '9735',
            accessCode: '123456'
        }
        req = { body: order }
        res = {
            status: sinon.stub(),
            json: sinon.stub()
        }
        MockHandler = {
            dataHandler() { },
            errorHandler() { },
            retryHandler() { },
            successHandler() { }
        }

        apiHandler = RequestHandler(MockHandler)

        MetricsStub = sinon.stub(metrics, 'writeGeneral')
        LoggerStub = sinon.stub(logger, 'sendLogs')
        EmitMock = sinon.stub(apiHandler, 'emit')
    })
    afterEach(() => {
        MetricsStub.restore()
        LoggerStub.restore()
        EmitMock.restore()
    })
    describe('#handleMessage', () => {
        it('should handle messages coming in and save to DB', (done) => {
            EmitMock.callsFake((eventName, passedStartTime, passedRes) => {
                expect(eventName).to.deep.equal('data')
                expect(passedRes).to.deep.equal(res)
                done()
            })
            apiHandler.handleMessage(req, res)
        });
        it('should handle messages coming in and send notifier because no accessCode', (done) => {
            EmitMock.callsFake((eventName, passedStartTime, passedRes) => {
                expect(eventName).to.deep.equal('data')
                expect(passedRes).to.deep.equal(res)
                done()
            })
            req.body.accessCode = null;
            apiHandler.handleMessage(req, res)
        });
    });
});