const chai = require('chai'),
    sinon = require('sinon'),
    utility = require('../../../utility'),
    expect = chai.expect;

describe('Utility', () => {
    beforeEach(() => {
        OVQStub = sinon.stub()
        HazmatStub = sinon.stub()
        StatusStub = sinon.stub()
        StoreStub = sinon.stub()
        ShipmentStub = sinon.stub()
        EmailStub = sinon.stub()
        chainList = [Promise.resolve(), OVQStub, EmailStub, HazmatStub, StatusStub, ShipmentStub, StoreStub]
    })
    it('Should run though all functions ', () => {
        OVQStub.resolves({})
        EmailStub.resolves({})
        HazmatStub.resolves({})
        StatusStub.resolves({})
        ShipmentStub.resolves({})
        StoreStub.resolves({})
        return utility.ExecuteListOfPromises(chainList)
            .then(res => {
                expect(OVQStub.called).to.be.true
                expect(EmailStub.called).to.be.true
                expect(HazmatStub.called).to.be.true
                expect(StatusStub.called).to.be.true
                expect(ShipmentStub.called).to.be.true
                expect(StoreStub.called).to.be.true
            })
    })
    describe('Get Missing Property', () => {
        beforeEach(() => {
            obj = {
                "a": true,
                "b": 'here'
            }
        });
        it('check for missing properties on empty object and return missing a and b', () => {
            let missingParams = utility.GetMissingProperty(['a', 'b'], {});
            expect(missingParams).to.equal('a,b')
        });
        it('check for missing properties on object and return missing c', () => {
            let missingParams = utility.GetMissingProperty(['a', 'b', 'c'], obj);
            expect(missingParams).to.equal('c')
        });

        it('check for missing properties on object with obj.c = false and return missing d', () => {
            obj.c = false
            let missingParams = utility.GetMissingProperty(['a', 'b', 'c', 'd'], obj);
            expect(missingParams).to.equal('d')
        });

        it('check for missing properties on object with an empty array and return missing d', () => {
            obj.c = []
            let missingParams = utility.GetMissingProperty(['a', 'b', 'c', 'd'], obj);
            expect(missingParams).to.equal('d')
        });
    });

    describe('ConvertStringToBoolean', () => {
        it('should convert a string boolean to an actual boolean', () => {
            expect(utility.ConvertStringToBoolean('true')).to.be.true
        })

        it('should convert a string boolean to an actual boolean', () => {
            expect(utility.ConvertStringToBoolean('false')).to.be.false
        })
    })

    describe('Determine the average CPU from user and sys', () => {
        let cpuUsuage
        beforeEach(() => {
            cpuUsuage = [
                {
                    "model": "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz",
                    "speed": 2500,
                    "times": {
                        "user": 4,
                        "nice": 0,
                        "sys": 2,
                        "idle": 100,
                        "irq": 0
                    }
                },
                {
                    "model": "Intel(R) Core(TM) i7-4870HQ CPU @ 2.50GHz",
                    "speed": 2500,
                    "times": {
                        "user": 2,
                        "nice": 0,
                        "sys": 2,
                        "idle": 100,
                        "irq": 0
                    }
                }
            ]
        })
        it('should calculate average cpu usuage', () => {
            expect(utility.GetAverageCPU(cpuUsuage)).to.equal(2.380952380952381)
        })
    })
})