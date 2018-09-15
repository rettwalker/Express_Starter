let config = require('./config'),
    logger = require('./logger'),
    bodyParser = require('body-parser'),
    express = require('express'),
    compression = require('compression'),
    path = require('path'),
    { syntaxCheck, requestLogging } = require('./middleware'),
    routes = require('./routes'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());

//error handling for bad json
app.use(syntaxCheck);

// SERVER
let server = require('http')
    .createServer(app)
    .listen(process.env.PORT || 3000, () => {
        logger.info('Application Started UP')
    });

server.on('request', (req, res) => {
    logger.info({ req: req });
})

app.use('/', routes);

app.set('showStackError', true);

module.exports = app;