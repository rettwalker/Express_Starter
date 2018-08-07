// these are the default values
var logConstants = require('./loggingConstants');

var appName = "REPLACEME";

function SplunkLoggerHttp(serviceUrl, reqBody) {
    this.appName = appName;
    this.timeExecuted = Date.now();
    this.error = false;
    this.url = serviceUrl;
    this.requestBody = reqBody;
}

function SplunkLoggerError(className, method, errorMessage, url) {
    this.appName = appName;
    this.timeExecuted = Date.now();
    this.className = className;
    this.method = method;
    this.error = true;
    this.errorMessage = errorMessage;
    this.url = url;
}

function SplunkLoggerDebug(className, method, debugMessage) {
    this.appName = appName;
    this.timeExecuted = Date.now();
    this.className = className;
    this.method = method;
    this.error = false;
    this.debugMessage = debugMessage;
}

var sendLogs = function (type, logObj) {
    if (type == 'debug') {
        var newDebugObj = new SplunkLoggerDebug(logObj.className, logObj.method, logObj.debugMessage);

        if (logConstants.LOG_DEBUG) {
            console.log(JSON.stringify(newDebugObj))
        }

    } else if (type == 'error') {
        var newErrorObj = new SplunkLoggerValidationError(logObj.className, logObj.method, logObj.errorMessage, logObj.url);

        try {
            if (logConstants.LOG_ERROR) {
                console.error(JSON.stringify(newErrorObj))
            }
        } catch (e) {
            console.error("failed to send log to PCF: " + e);
        }

    } else if (type == 'http') {
        var newHttpObj = new SplunkLoggerHttp(logObj.url, logObj.requestBody);
        if (logConstants.LOG_HTTP) {
            console.log(JSON.stringify(newHttpObj))
        }
    }
}

module.exports = {
    sendLogs
}