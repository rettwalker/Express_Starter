const chai = require('chai'),
    sinon = require('sinon'),
    mw = require('../../../middleware'),
    logger = require('../../../logging/loggerModel'),
    utility = require('../../../utility'),
    expect = chai.expect;

describe('MiddleWare', () => {
    let err, req, res, next, LogStub;
    beforeEach(() => {
        next = sinon.stub();
        res = {
            status: sinon.stub(),
            json: sinon.stub()
        };
        err = null;
        LogStub = sinon.stub(logger, 'sendLogs');
        GetMissingPropertySpy = sinon.spy(utility, 'GetMissingProperty')
        req = {};
    });
    afterEach(() => {
        LogStub.restore();
        GetMissingPropertySpy.restore()
    });
    describe('SyntaxCheck', () => {

        it('SUCCESS should make sure request is JSON', () => {
            mw.syntaxCheck(err, req, res, next);
            expect(next.called).to.be.true;
        });

        it('FAILURE bad request', () => {
            err = SyntaxError('Bad')
            mw.syntaxCheck(err, req, res, next);
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith("BAD JSON")).to.be.true;
            expect(LogStub.called).to.be.true;
        });

        it('Success there is error but not of type SyntaxError', () => {
            err = Error('Bad')
            mw.syntaxCheck(err, req, res, next);
            expect(next.called).to.be.true;
        });
    });
    describe('CORS', () => {
        it('should assign the headers', () => {
            req.path = 'haha';
            req.body = 'hehe';
            res.header = sinon.stub();
            mw.setResponseHeaders(req, res, next);
            expect(res.header.firstCall.calledWith("Access-Control-Allow-Origin", "*"));
            expect(res.header.secondCall.calledWith("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, THD-Restrictive-Header, Authorization"));
            expect(res.header.lastCall.calledWith("Strict-Transport-Security", "max-age=31536000, includeSubDomains"));
            expect(next.called).to.be.true;
        })
    })
})
