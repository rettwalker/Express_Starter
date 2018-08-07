var config;
if (process.env.config) {
    config = JSON.parse(process.env.config);
} else {
    var configJson = require('./config.json');
    config = configJson.local;
}

module.exports = config;