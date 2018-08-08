const expect = require('chai').expect,
    sinon = require('sinon'),
    config = require('../../../config'),
    logger = require('../../../logging/loggerModel'),
    RequestHandler = require('../../../controllers/requestHandler')


describe('RequestHandler', () => {
    let req, res, ProcessorStub, LoggerStub
    beforeEach(() => {
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
        ProcessorStub = sinon.stub()
    })
    afterEach(() => {
        LoggerStub.restore()

    })

    it('should return RequestHandler function that will execute the manager', () => {
        expect(RequestHandler(ProcessorStub)).to.be.an('function')
    })

    it('should set status to 200 and return the response of the passed in func as the JSON body', (done) => {
        ProcessorStub.resolves(true)
        res = {
            ...res,
            status(status) {
                expect(status).to.equal(200)
            },
            json(data) {
                expect(ProcessorStub.calledWith(req, res)).to.be.true
                expect(data.data).to.be.true
                done()
            }
        }

        RequestHandler(ProcessorStub)(req, res)
    })

    it('should set status to 500 and return error message and body of the passed in func as the JSON body', (done) => {
        ProcessorStub.rejects({ message: 'something broke' })
        res = {
            ...res,
            status(status) {
                expect(status).to.equal(500)
            },
            json(data) {
                expect(ProcessorStub.calledWith(req, res)).to.be.true
                expect(data).to.deep.equal({ message: 'something broke' })
                done()
            }
        }

        RequestHandler(ProcessorStub)(req, res)
    })

    it('should use custom success function and return the response of the passed in func as the JSON body', () => {
        ProcessorStub.resolves()
        CustomHandler = {
            successHandler: sinon.stub(),
            errorHandler: sinon.stub()
        }

        return RequestHandler(ProcessorStub, CustomHandler)(req, res)
            .then(res => {
                expect(CustomHandler.successHandler.called).to.be.true
            })
    })

    it('should use custom error function and return the response of the passed in func as the JSON body', () => {
        ProcessorStub.rejects()
        CustomHandler = {
            successHandler: sinon.stub(),
            errorHandler: sinon.stub()
        }

        return RequestHandler(ProcessorStub, CustomHandler)(req, res)
            .then(res => {
                expect(CustomHandler.errorHandler.called).to.be.true
            })
    })
})