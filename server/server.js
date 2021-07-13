/* base server for the application */
var dotenv = require('dotenv').config();
var http = require('http');
var express = require('express');
var request = require('request');
//const morgan = require('morgan');
var bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static("public"));
app.use('/dist', express.static("dist"));

//var wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

var httpServer = http.Server(app);
var port = process.env.PORT || 3000;

var io = require("socket.io")(httpServer);

//io.use(wrap(morgan("dev"))); /* log server calls with performance timinig */

/* log call requests with body */
// io.use(wrap((request, response, next) => {
//     console.log(`Received request for ${request.url} with/without body`);
//     console.log(request.body);
//     next();
// }));

/* setup the public files to be available (e.g. content, css, client side js files) */






httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
    /* handle request for current weather from Open Weather API */
    app.get("/test", (req, res) => {
        console.log("url: " + req.url);
        res.send("Hello World");
    });

    /* handle request for current weather from Open Weather API */
    app.post("/current", (req, res) => {
        console.log("url: " + req.url);
        console.log("body: " + req.body);
        console.log("parameters: " + req.body.parameters);
        let newURL = process.env.CURRENT_WEATHER_URL + "?q=" + req.body.parameters.q + "&appid=" + process.env.API_KEY + "&units=metric";
        console.log("new URL is: " + newURL);
        request(newURL, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body);
            res.status(response.statusCode);
            res.json(body);
        });
    });


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
