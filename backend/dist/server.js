// Configuration and Logging handlers
var dotenv = require('dotenv').config();

var morgan = require('morgan');

var debug = require('debug')('server');

var socketDebug = require('debug')('sockets'); // HTTP handlers


var createError = require('http-errors');

var http = require('http');

var path = require('path');

var favicon = require('serve-favicon'); // Express framework and additional middleware


var express = require('express');

var expressHandlebars = require('express-handlebars');

var bodyParser = require('body-parser');

var session = require('express-session');

var cookieParser = require('cookie-parser'); // Authentication middleware


var mongoose = require('mongoose');

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;

isDevelopment = process.env.MODE === 'Development';
debug("Is development mode " + isDevelopment); // Create and configure the express app

var app = express(); // Express view/template engine setup

debug("setting up templating engine");
app.set('views', path.join(__dirname + "/../", 'views'));
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'default',
  partialsDir: path.join(app.get('views'), 'partials'),
  layoutDir: path.join(app.get('views'), 'layouts')
}));
debug("setting up templating engine - handlebars");
app.set('view engine', 'handlebars');
app.set('view cache', !isDevelopment); // view caching in production

debug("Installing middlewares"); // if (isDevelopment) {
//   /* eslint "global_require":"off" */
//   /* eslint "import/no-extraneous-dependencies":"off" */
//   debug("Installing HMR middleware");
//   const webpack = require('webpack');
//   const devMiddleware = require('webpack-dev-middleware');
//   const hotMiddleware = require('webpack-hot-middleware');
//
//   const config = require('../../frontend/webpack.config.server.js');
//   config.entry.app.push('webpack-hot-middleware/client');
//   config.plugins = config.plugin || [];
//   config.plugins.push(new webpack.HotModuleReplacementPlugin());
//
//   const compiler = webpack(config);
//   app.use(devMiddleware(compiler));
//   app.use(hotMiddleware(compiler));
// }
// Express middlewares

app.use('/', express.static('./public')); // root directory of static content

app.use(cookieParser()); // add cookie support

app.use(bodyParser.json()); // add POST JSON support

app.use(bodyParser.urlencoded({
  extended: true
})); // and POST URL Encoded form support

app.use(session({
  secret: 'frankie',
  resave: true,
  saveUninitialized: true
})); // Add session support

app.use(passport.initialize()); // initialise the authentication

app.use(passport.session({})); // setup authentication to use cookie/sessions

/* Are we in Development or in Production? */

debug('Setting up server side logging with Morgan');

if (isDevelopment) {
  app.use(morgan('dev'));
  /* log server calls with performance timing with development details */

  /* log call requests with body */

  app.use(function (request, response, next) {
    console.log("Received request for " + request.url + " with/without body");
    if (request.body) console.log(request.body);
    next();
  });
} else {
  app.use(morgan('combined'));
  /* log server calls per standard combined Apache combined format */
} // ensure the user is logged in with a path


debug('Installing routes');

var routes = require('./routes/index.js'); // add the middleware path routing


app.use('/', routes); // add the routes to the express middleware
// Setup authentication
//debug('Setting up Account model and authentication with Passport');
// var Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());
// database connection
//debug('Establishing database connection with Mongoose');
//mongoose.connect(process.env.DB_URL);
// route for the env.js file being served to the client

debug("Setting the environment variables for the browser to access");
var port = process.env.PORT || 3000;
var LOCAL_HOST_API_DEVELOPMENT = "http://localhost:" + port + "/api";
var LOCAL_HOST_API_PRODUCTION = "https://localhost:" + port + "/api";
var localhostAPIURL = LOCAL_HOST_API_DEVELOPMENT;
if (!isDevelopment) localhostAPIURL = LOCAL_HOST_API_PRODUCTION;
var API_SERVER_URL = process.env.API_SERVER_URL || localhostAPIURL;
var env = {
  API_SERVER_URL: API_SERVER_URL
};
app.get('/js/env.js', function (req, res) {
  res.send("window.ENV = " + JSON.stringify(env));
}); // catch 404 and forward to error handler

debug('Setting up 404 handler');
app.use(function (req, res, next) {
  debug('404 forwarder');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

if (isDevelopment) {
  debug('Setting up DEV 500 handler');
  app.use(function (err, req, res, next) {
    debug(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  debug('Production 500 handler');
  app.use(function (err, req, res, next) {
    debug(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

var httpServer = http.Server(app);

var io = require('socket.io')(httpServer); // setup socket.io


httpServer.listen(port, function () {
  debug("Server started on port " + port);
  io.on('connection', function (socket) {
    socketDebug('Sockets: a user connected');
    socket.on('disconnect', function () {
      socketDebug('Sockets: user disconnected');
    });
    socket.on('chat message', function (msg) {
      socketDebug("Sockets: Received message " + msg);
      io.emit('chat message', msg);
      socketDebug("Sockets: Sending message " + msg);
    });
  });
});