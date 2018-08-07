const metrics = require('../services/metrics'),
    logger = require('../logging/loggerModel'),
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
    ServiceError: ServiceError


    // let missingProperties = requiredProperties.filter(property => !req.body[property]).join(',')
}
module.exports = Utility