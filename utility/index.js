const logger = require('../logger')
const ExecuteListOfPromises = arrayOfPromises => {
    //See ES6 spread operator 
    let [first, ...remain] = arrayOfPromises
    //We are using reduce to execute a promise array sequentially without having to list out all the .thens
    return remain.reduce(ExecutePromise, first)

    function ExecutePromise(acc, curr) {
        return (acc.then(curr))
    }
}
const GetMissingProperty = (requiredProperties, objectToCheck) => {
    let convertIfBool = value => (typeof value === "boolean") ? "" + value : value
    return requiredProperties.filter(property => !convertIfBool(objectToCheck[property])).join(',')
}

const ConvertStringToBoolean = (value) => {
    return value.toUpperCase() === 'TRUE' ? true : false
}

const GetAverageCPU = (cpus) => {
    return ((cpus.reduce((acc, { times }) => acc + (Math.round(100 * (times.user + times.sys))), 0) / cpus.reduce((acc, { times }) => acc + Object.values(times).reduce((acc, curr) => acc + curr, 0), 0) / cpus.length))
}

const HandleAsyncFn = (asyncFn, successHandler = (res) => res, errorHandler) => {
    return function () {
        return asyncFn(...arguments).then(successHandler).catch(errorHandler)
    }
}
// let missingProperties = requiredProperties.filter(property => !req.body[property]).join(',')


module.exports = { ExecuteListOfPromises, GetMissingProperty, ConvertStringToBoolean, GetAverageCPU, HandleAsyncFn }