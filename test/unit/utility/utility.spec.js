const chai = require('chai'),
    sinon = require('sinon'),
    { HandleAsyncFn, ...utility } = require('../../../utility'),
    expect = chai.expect;

describe('Utility', () => {
    let FN1stub, FN2stub, chainList
    beforeEach(() => {
        FN1stub = sinon.stub()
        FN2stub = sinon.stub()

        chainList = [Promise.resolve(), FN1stub, FN2stub]
    })
    it('Should run though all functions ', () => {
        FN1stub.resolves({})
        FN2stub.resolves({})

        return utility.ExecuteListOfPromises(chainList)
            .then(res => {
                expect(FN1stub.called).to.be.true
                expect(FN2stub.called).to.be.true
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

    describe('Will handle async functions, and use custom error and success handlers if provided', () => {
        it('will take in a function that is asnyc and then execute it using the default handlers', () => {
            FN1stub.resolves({ message: 'returned Object' })
            expect(HandleAsyncFn).to.be.a('function')
            expect(HandleAsyncFn()).to.be.a('function')
            expect(HandleAsyncFn(FN1stub)()).to.be.a('promise')
            return HandleAsyncFn(FN1stub)({ message: 'something' })
                .then(res => {
                    expect(FN1stub.calledWith({ message: 'something' })).to.be.true
                    expect(res).to.deep.equal({ message: 'returned Object' })
                })
        })

        it('will take in a function that is asnyc and then execute it using custom success handler', () => {
            FN1stub.resolves({ message: 'object' })
            FN2stub.resolves({ message: 'returned Object' })
            expect(HandleAsyncFn).to.be.a('function')
            expect(HandleAsyncFn()).to.be.a('function')
            expect(HandleAsyncFn(FN1stub, FN2stub)()).to.be.a('promise')
            return HandleAsyncFn(FN1stub, FN2stub)({ message: 'something' })
                .then(res => {
                    expect(FN1stub.calledWith({ message: 'something' })).to.be.true
                    expect(FN2stub.calledWith({ message: 'object' })).to.be.true
                    expect(res).to.deep.equal({ message: 'returned Object' })
                })
        })
        it('will take in a function that is asnyc and then execute it using custom error handler', () => {
            FN1stub.rejects({ message: 'object' })
            FN2stub.resolves({ message: 'returned Object' })
            expect(HandleAsyncFn).to.be.a('function')
            expect(HandleAsyncFn()).to.be.a('function')
            expect(HandleAsyncFn(FN1stub, undefined, FN2stub)()).to.be.a('promise')
            return HandleAsyncFn(FN1stub, undefined, FN2stub)({ message: 'something' })
                .then(res => {
                    expect(FN1stub.calledWith({ message: 'something' })).to.be.true
                    expect(FN2stub.calledWith({ message: 'object' })).to.be.true
                    expect(res).to.deep.equal({ message: 'returned Object' })
                })
        })
    })
})