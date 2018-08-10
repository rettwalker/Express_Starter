const logger = require('../logging/loggerModel'),
    ServiceError = require('../utility/ServiceError')

const Utility = {
    ExecuteListOfPromises: arrayOfPromises => {
        //See ES6 spread operator 
        let [first, ...remain] = arrayOfPromises
        //We are using reduce to execute a promise array sequentially without having to list out all the .thens
        return remain.reduce(ExecutePromise, first)

        function ExecutePromise(acc, curr) {
            return (acc.then(curr))
        }
    },
    GetMissingProperty(requiredProperties, objectToCheck) {
        let convertIfBool = value => (typeof value === "boolean") ? "" + value : value
        return requiredProperties.filter(property => !convertIfBool(objectToCheck[property])).join(',')
    },
    ConvertStringToBoolean(value) {
        return value.toUpperCase() === 'TRUE' ? true : false
    },
    GetAverageCPU(cpus) {
        let total = cpus.reduce((acc, { times }) => acc + Object.values(times).reduce((acc, curr) => acc + curr, 0), 0)
        return ((cpus.reduce((acc, { times }) => acc + (Math.round(100 * (times.user + times.sys))), 0) / cpus.length) / total)
    },
    ServiceError: ServiceError


    // let missingProperties = requiredProperties.filter(property => !req.body[property]).join(',')
}
module.exports = Utility