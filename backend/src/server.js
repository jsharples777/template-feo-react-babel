// Configuration and Logging handlers
const dotenv = require('dotenv').config();
const morgan = require('morgan');

// HTTP handlers
const createError = require('http-errors');
const http = require('http');
const path = require('path');
const favicon = require('serve-favicon');

// Express framework and additional middleware
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Authentication middleware
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


isDevelopment = (process.env.MODE === "Development");

// Create and configure the express app
const app = express();

// Express view/template engine setup
app.set('views', path.join(__dirname+"/../", 'views'));
app.engine('handlebars',expressHandlebars( {
    defaultLayout: 'default',
    partialsDir: path.join(app.get('views'), 'partials' ),
    layoutDir: path.join(app.get('views'), 'layouts')
}));

app.set('view engine', 'handlebars');
app.set('view cache', !isDevelopment); // view caching in production

// Express middlewares
app.use("/", express.static("public")); // root directory of static content
app.use('/dist', express.static("dist")); // root directory of distributed CSS, JS libraries
app.use(cookieParser()); // add cookie support
app.use(bodyParser.json()); // add POST JSON support
app.use(bodyParser.urlencoded({ extended: true })); // and POST URL Encoded form support
app.use(session({secret: 'frankie', resave:true, saveUninitialized:true})); // Add session support
app.use(passport.initialize()); // initialise the authentication
app.use(passport.session({})); // setup authentication to use cookie/sessions


/* Are we in Development or in Production? */
if (isDevelopment) {
    app.use(morgan("dev")); /* log server calls with performance timing with development details */

    /* log call requests with body */
    app.use((request, response, next) => {
        console.log(`Received request for ${request.url} with/without body`);
        if(request.body) console.log(request.body);
        next();
    });
} else {
    app.use(morgan("combined")); /* log server calls per standard combined Apache combined format */
}

// ensure the user is logged in with a path


const routes = require('./routes'); // add the middleware path routing
app.use("/",routes); // add the routes to the express middleware

const patients = require('./routes/patients');  // add the patient middleware path routing
app.use("/",patients);  // add the roues to the express middleware

// Setup authentication
// var Account = require('./models/account');
// passport.use(new LocalStrategy(Account.authenticate()));
// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());

// database connection
mongoose.connect(process.env.DB_URL);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
if (isDevelopment) {
    app.use(function(err, req,res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else {
    app.use(function(err,req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        })
    });

}

const httpServer = http.Server(app);
const port = process.env.PORT || 3000;

const io = require("socket.io")(httpServer); // setup socket.io

httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('chat message', (msg) => {
            console.log("Received message " + msg);
            io.emit('chat message', msg);
            console.log("Sending message " + msg);
        });
    });
});
