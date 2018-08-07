function ServiceError(message, errorObject, fileName, lineNumber) {
    var instance = new Error(message, fileName, lineNumber);
    instance.errorObject = errorObject
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error.captureStackTrace) {
        Error.captureStackTrace(instance, ServiceError);
    }
    return instance;
}

ServiceError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ServiceError, Error);
} else {
    ServiceError.__proto__ = Error;
}

module.exports = ServiceError