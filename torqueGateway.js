var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , config = require('./config')
  , controllers = require('./controllers')
  , log = require('winston')
  , middleware = require('./middleware')
  , utils = require('./utils');

log.add(log.transports.File, { filename: 'server.log' });

app.use(express.logger(config.request_log_format));
app.use(express.compress());

app.enable('trust proxy');
app.disable('x-powered-by');

server.listen(config.internal_port);
app.get('/', controllers.telemetry.handleData);

app.get(config.ops_path + '/health', controllers.ops.health);
