const expect = require('chai').expect,
    sinon = require('sinon'),
    config = require('../../../config'),
    { GenericSystemMetrics } = require('../../../controllers/metrics'),
    os = require('os')


describe('Fns surrounding gather metrics for services', () => {
    let CPUStubs
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
        CPUStubs = sinon.stub(os, 'cpus').returns(cpuUsuage)
        UptimeStub = sinon.stub(os, 'uptime').returns('uptime')
        TotalMemStub = sinon.stub(os, 'totalmem').returns('totalmem')
        PlatformStub = sinon.stub(os, 'platform').returns('platform')
        ReleaseStub = sinon.stub(os, 'release').returns('release')
        FreeMemStub = sinon.stub(os, 'freemem').returns('freemem')
    })

    afterEach(() => {
        CPUStubs.restore()
        UptimeStub.restore()
        TotalMemStub.restore()
        PlatformStub.restore()
        ReleaseStub.restore()
    })
    it('should return generic system metrics', () => {

        expect(GenericSystemMetrics()).to.deep.equal({
            platform: 'platform',
            release: 'release',
            cpus: cpuUsuage,
            up_time: 'uptime',
            total_memory: 'totalmem',
            free_memory: 'freemem',
            average_cpu: 2.380952380952381
        })
        expect(CPUStubs.called).to.be.true
        expect(UptimeStub.called).to.be.true
        expect(TotalMemStub.called).to.be.true
        expect(PlatformStub.called).to.be.true
        expect(ReleaseStub.called).to.be.true
        expect(FreeMemStub.called).to.be.true
    })
}) 