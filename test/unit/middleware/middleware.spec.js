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
    describe('PREPROCESS request validation', () => {
        beforeEach(() => {
            order = {
                "orderNumber": "W225656570",
                "shipmentNumber": "101663234",
                "orderType": "300",
                "preferredLocation": "SD-001",
                "userId": "stm001",
                "storeNumber": "9735",
                "orderLines": [{}]
            }
        })

        it('check request body and allow order to continue', () => {
            req.body = order;
            mw.requestProcessBodyCheck(req, res, next);
            expect(GetMissingPropertySpy.calledWith(['orderNumber', 'shipmentNumber', 'orderType', 'preferredLocation', 'userId', 'storeNumber', 'orderLines'])).to.be.true
            expect(next.called).to.be.true;
        });

        it('Should fail; orderLines missing', (done) => {
            delete order.orderLines;
            req.body = order;
            res = {
                status: (status) => {
                    expect(status).to.equal(400)
                },
                json: (data) => {
                    expect(next.called).to.be.false;
                    expect(GetMissingPropertySpy.calledWith(['orderNumber', 'shipmentNumber', 'orderType', 'preferredLocation', 'userId', 'storeNumber', 'orderLines'])).to.be.true
                    expect(data.message).to.equal('INVALID REQUEST.  MISSING: orderLines');
                    done()
                }
            }
            mw.requestProcessBodyCheck(req, res, next);
        })

    })
    describe('DIRECTEDLOCATION request validation', () => {
        beforeEach(() => {
            order = {
                "orderNumber": "W225656570",
                "shipmentNumber": "101663234",
                "preferredLocation": "SD-001",
                "userId": "stm001",
                "storeNumber": "9735",
                "partiallyPicked": false
            }
        })
        it('check request body for DIRECTEDLOCATION and allow order to continue', () => {
            req.body = order;
            mw.requestDirectedLocationBodyCheck(req, res, next);
            expect(next.called).to.be.true;
        })
        it('check request body for DIRECTEDLOCATION and FAIL for missing orderNumber and userId', (done) => {
            delete order.orderNumber
            delete order.userId
            req.body = order
            res = {
                status: (status) => {
                    expect(status).to.equal(400)
                },
                json: (data) => {
                    expect(next.called).to.be.false;
                    expect(GetMissingPropertySpy.calledWith(['orderNumber', 'shipmentNumber', 'preferredLocation', 'userId', 'storeNumber', 'partiallyPicked'])).to.be.true
                    expect(data.message).to.equal('INVALID REQUEST.  MISSING: orderNumber,userId');
                    done()
                }
            }
            mw.requestDirectedLocationBodyCheck(req, res, next);
        })
    });
    describe('COMPLETEORDER request validation', () => {
        beforeEach(() => {
            order = {
                "orderNumber": "W225656570",
                "shipmentNumber": "101663234",
                "storeNumber": "9735",
                "userId": "stm001",
                "orderLines": [{
                    "skuNumber": "1000473973",
                    "qty": 1,
                    "stagedLocation": "SD-001"
                }]
            }

        })
        it('check request body for COMPLETEORDER and allow order to continue', () => {
            req.body = order
            mw.requestCompleteOrderBodyCheck(req, res, next)
            expect(next.called).to.be.true
        })
        it('check request body for COMPLETEORDER and FAIL for missing orderNumber and skuNumber', (done) => {
            delete order.orderNumber
            // delete order.orderLines
            delete order.orderLines[0].skuNumber
            req.body = order
            res = {
                status: (status) => {
                    expect(status).to.equal(400)
                },
                json: (data) => {
                    expect(next.called).to.be.false;
                    expect(GetMissingPropertySpy.calledWith(['orderNumber', 'shipmentNumber', 'storeNumber', 'userId', 'orderLines'])).to.be.true
                    expect(GetMissingPropertySpy.calledWith(['skuNumber', 'stagedLocation', 'qty'])).to.be.true
                    expect(data.message).to.equal('INVALID REQUEST.  MISSING: orderNumber,skuNumber');
                    done()
                }
            }
            mw.requestCompleteOrderBodyCheck(req, res, next)
        })

        it('check request body for COMPLETEORDER and allow order to continue', () => {
            order.orderLines.push({
                "skuNumber": "1000473973",
                "qty": 1,
                "stagedLocation": "SD-001"
            })
            req.body = order
            mw.requestCompleteOrderBodyCheck(req, res, next)
            expect(next.called).to.be.true
        })

        it('check request body for COMPLETEORDER and FAIL for missing stagedLocation and skuNumber', (done) => {
            delete order.orderLines[0].skuNumber
            order.orderLines.push({
                "skuNumber": "1000473973",
                "qty": 1,
            })
            req.body = order
            res = {
                status: (status) => {
                    expect(status).to.equal(400)
                },
                json: (data) => {
                    expect(next.called).to.be.false;
                    expect(GetMissingPropertySpy.calledWith(['orderNumber', 'shipmentNumber', 'storeNumber', 'userId', 'orderLines'])).to.be.true
                    expect(GetMissingPropertySpy.calledWith(['skuNumber', 'stagedLocation', 'qty'])).to.be.true
                    expect(data.message).to.equal('INVALID REQUEST.  MISSING: skuNumber,stagedLocation');
                    done()
                }
            }
            mw.requestCompleteOrderBodyCheck(req, res, next)
        })

    })
});
