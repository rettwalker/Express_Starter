const expect = require('chai').expect,
    sinon = require('sinon'),
    config = require('../../../config'),
    logger = require('../../../logging/loggerModel'),
    { HttpRequest, AsynchronousRequest, SynchronousRequest } = require('../../../routes/requestHandler')


describe('RequestHandler', () => {
    let req, res, ProcessorStub, LoggerStub, RequestStub
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
        RequestStub = sinon.stub()
    })
    afterEach(() => {
        LoggerStub.restore()

    })

    it('should return function that will execute the manager function passed in', () => {
        expect(HttpRequest(ProcessorStub)).to.be.an('function')
        ProcessorStub.resolves()
        HttpRequest(ProcessorStub)()
            .then(res => {
                expect(ProcessorStub.called).to.be.true
            })
    })

    describe('Should return Asynchronous controller', () => {
        let StatusStub, JSONStub
        beforeEach(() => {
            StatusStub = sinon.stub()
            JSONStub = sinon.stub()
        })
        it('should execute request and handle it as an aysnch request', () => {
            expect(AsynchronousRequest(RequestStub)).to.be.an('function')
            RequestStub.resolves()

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return AsynchronousRequest(RequestStub)(req, res)
                .then(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(StatusStub.calledWith(202)).to.be.true
                    expect(JSONStub.calledWith({ message: 'Request Being Processed' })).to.be.true
                    expect(LoggerStub.calledWith('debug')).to.be.true
                })
        })

        it('should execute request and handle when something blows up it as an aysnch request', () => {
            expect(AsynchronousRequest(RequestStub)).to.be.an('function')
            RequestStub.rejects(new Error('Something Blew Up'))

            res = {
                status: StatusStub,
                json: JSONStub
            }

            return AsynchronousRequest(RequestStub)(req, res)
                .catch(res => {
                    expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                    expect(JSONStub.calledWith({ message: 'Request Being Processed' })).to.be.true
                    expect(StatusStub.calledWith(202)).to.be.true
                    expect(LoggerStub.calledWith('error')).to.be.true
                })
        })

        describe('Handle requests that are supposed to synchronous', () => {
            let StatusStub, JSONStub
            beforeEach(() => {
                StatusStub = sinon.stub()
                JSONStub = sinon.stub()
            })
            it('should return a function that handles a request synchronously', () => {
                expect(SynchronousRequest()).to.be.an('function')
                RequestStub.resolves({ message: 'a response' })

                res = {
                    status: StatusStub,
                    json: JSONStub
                }

                return SynchronousRequest(RequestStub)(req, res)
                    .then(res => {
                        expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                        expect(StatusStub.calledWith(200)).to.be.true
                        expect(JSONStub.calledWith({ message: 'Success', data: { message: 'a response' } })).to.be.true
                        expect(LoggerStub.calledWith('debug')).to.be.true
                    })
            })

            it('should return a function that handles a request synchronously', () => {
                expect(SynchronousRequest()).to.be.an('function')
                RequestStub.rejects(new Error('Big Error'))

                res = {
                    status: StatusStub,
                    json: JSONStub
                }

                return SynchronousRequest(RequestStub)(req, res)
                    .then(res => {
                        expect(RequestStub.calledWith({ aParameter: '1234', message: 'do something' })).to.be.true
                        expect(StatusStub.calledWith(500)).to.be.true
                        expect(JSONStub.calledWith({ message: 'Big Error' })).to.be.true
                        expect(LoggerStub.calledWith('error')).to.be.true
                    })
            })
        })
    })

})