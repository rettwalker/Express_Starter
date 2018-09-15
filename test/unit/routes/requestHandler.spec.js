const expect = require('chai').expect,
    sinon = require('sinon'),
    config = require('../../../config'),
    logger = require('../../../logger'),
    { AsynchronousHTTPRequest, SynchronousHTTPRequest } = require('../../../routes/requestHandler')


describe('RequestHandler', () => {
    let req, res, LoggerStub, LoggerErrorStub, RequestStub
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
        LoggerStub = sinon.stub(logger, 'info')
        LoggerErrorStub = sinon.stub(logger, 'error')
        RequestStub = sinon.stub()
    })
    afterEach(() => {
        LoggerStub.restore()
        LoggerErrorStub.restore()
    })

    describe('Should return Asynchronous controller', () => {
        let StatusStub, JSONStub
        beforeEach(() => {
            StatusStub = sinon.stub()
            JSONStub = sinon.stub()
        })
        it('should execute request and handle it as an aysnch request', () => {
            expect(AsynchronousHTTPRequest(RequestStub)).to.be.an('function')
            RequestStub.resolves()

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return AsynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(202)).to.be.true
                    expect(JSONStub.calledWith({ message: 'Request Being Processed' })).to.be.true
                    expect(LoggerStub.called).to.be.true
                })
        })

        it('should execute request and handle when something blows up it as an aysnch request', () => {
            expect(AsynchronousHTTPRequest(RequestStub)).to.be.an('function')
            RequestStub.rejects(new Error('Something Blew Up'))

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return AsynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(JSONStub.calledWith({ message: 'Request Being Processed' })).to.be.true
                    expect(StatusStub.calledWith(202)).to.be.true
                    expect(LoggerErrorStub.called).to.be.true
                })
        })
    })

    describe('Handle requests that are supposed to synchronous', () => {
        let StatusStub, JSONStub
        beforeEach(() => {
            StatusStub = sinon.stub()
            JSONStub = sinon.stub()
        })
        it('should return a function that handles a request synchronously', () => {
            expect(SynchronousHTTPRequest()).to.be.an('function')
            RequestStub.resolves({ message: 'a response' })

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return SynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(200)).to.be.true
                    expect(JSONStub.calledWith({ message: 'a response' })).to.be.true
                })
        })

        it('should return a function that handles a request synchronously', () => {
            expect(SynchronousHTTPRequest()).to.be.an('function')
            RequestStub.resolves({ message: 'a response', status: 201 })

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return SynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(201)).to.be.true
                    expect(JSONStub.calledWith({ status: 201, message: 'a response' })).to.be.true
                })
        })


        it('should return a function that handles a request synchronously', () => {
            expect(SynchronousHTTPRequest()).to.be.an('function')
            RequestStub.rejects({ message: 'Big Error' })

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return SynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(500)).to.be.true
                    expect(JSONStub.calledWith({ message: 'Big Error' })).to.be.true
                })
        })

        it('should return a function that handles a request synchronously with a custom status', () => {
            expect(SynchronousHTTPRequest()).to.be.an('function')
            RequestStub.rejects({ status: 502, message: 'BIG ERROR' })

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return SynchronousHTTPRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(502)).to.be.true
                    expect(JSONStub.calledWith({ status: 502, message: 'BIG ERROR' })).to.be.true
                })
        })
    })

})