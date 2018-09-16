const chai = require('chai'),
    sinon = require('sinon'),
    mw = require('../../../middleware'),
    logger = require('../../../logger'),
    utility = require('../../../util'),
    expect = chai.expect

describe('MiddleWare', () => {
    let err, req, res, next, LogStub
    beforeEach(() => {
        next = sinon.stub()
        res = {
            status: sinon.stub(),
            json: sinon.stub()
        }
        err = null
        LogStub = sinon.stub(logger, 'info')
        GetMissingPropertySpy = sinon.spy(utility, 'GetMissingProperty')
        req = {}
    })
    afterEach(() => {
        LogStub.restore()
        GetMissingPropertySpy.restore()
    })
    describe('SyntaxCheck', () => {

        it('SUCCESS should make sure request is JSON', () => {
            mw.syntaxCheck(err, req, res, next)
            expect(next.called).to.be.true
        })

        it('FAILURE bad request', () => {
            err = SyntaxError('Bad')
            mw.syntaxCheck(err, req, res, next)
            expect(res.status.calledWith(500)).to.be.true
            expect(res.json.calledWith("BAD JSON")).to.be.true
            //expect(LogStub.called).to.be.true
        })

        it('Success there is error but not of type SyntaxError', () => {
            err = Error('Bad')
            mw.syntaxCheck(err, req, res, next)
            //expect(next.called).to.be.true
        })
    })
})
