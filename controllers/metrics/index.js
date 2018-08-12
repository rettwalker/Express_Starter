const os = require('os'),
    { GetAverageCPU } = require('../../utility')

const GenericSystemMetrics = () => {
    let cpus = os.cpus()
    return {
        platform: os.platform(),
        release: os.release(),
        cpus: cpus,
        up_time: os.uptime(),
        total_memory: os.totalmem(),
        free_memory: os.freemem(),
        average_cpu: GetAverageCPU(cpus)

    }
}

module.exports = { GenericSystemMetrics }