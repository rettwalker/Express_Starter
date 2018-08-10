let config = require('./config'),
    logger = require('./logging/loggerModel'),
    bodyParser = require('body-parser'),
    express = require('express'),
    compression = require('compression'),
    path = require('path'),
    mw = require('./middleware'),
    routes = require('./routes'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

//error handling for bad json
app.use(mw.syntaxCheck, mw.setResponseHeaders);


app.use('/', routes);

// SERVER
var server = require('http').createServer(app);

var port = process.env.PORT || 3000;

server.listen(port, () => { console.log('Application Started') });

app.set('showStackError', true);

module.exports = app;