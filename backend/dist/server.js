// Configuration and Logging handlers
var dotenv = require('dotenv').config();

var morgan = require('morgan'); // HTTP handlers


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

isDevelopment = process.env.MODE === "Development"; // Create and configure the express app

var app = express(); // Express view/template engine setup

app.set('views', path.join(__dirname + "/../", 'views'));
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'default',
  partialsDir: path.join(app.get('views'), 'partials'),
  layoutDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('view cache', !isDevelopment); // view caching in production
// Express middlewares

app.use("/", express.static("public")); // root directory of static content

app.use('/dist', express.static("dist")); // root directory of distributed CSS, JS libraries

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

if (isDevelopment) {
  app.use(morgan("dev"));
  /* log server calls with performance timing with development details */

  /* log call requests with body */

  app.use(function (request, response, next) {
    console.log("Received request for " + request.url + " with/without body");
    if (request.body) console.log(request.body);
    next();
  });
} else {
  app.use(morgan("combined"));
  /* log server calls per standard combined Apache combined format */
} // ensure the user is logged in with a path


var routes = require('./routes'); // add the middleware path routing


app.use("/", routes); // add the routes to the express middleware

var patients = require('./routes/patients'); // add the patient middleware path routing


app.use("/", patients); // add the roues to the express middleware
// Setup authentication
// var Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());
// database connection

mongoose.connect(process.env.DB_URL); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

if (isDevelopment) {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

var httpServer = http.Server(app);
var port = process.env.PORT || 3000;

var io = require("socket.io")(httpServer); // setup socket.io


httpServer.listen(port, function () {
  console.log("Server started on port " + port);
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('chat message', function (msg) {
      console.log("Received message " + msg);
      io.emit('chat message', msg);
      console.log("Sending message " + msg);
    });
  });
});