/* base server for the application */
const dotenv = require('dotenv').config();
const http = require('http');
const express = require('express');
const request = require('request');
const morgan = require('morgan');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/',express.static("public"));
app.use('/dist', express.static("dist"));

//var wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

const httpServer = http.Server(app);
const port = process.env.PORT || 3000;

const io = require("socket.io")(httpServer);

isDevelopment = (process.env.RUNTIME === "Development");

/* Are we in Development or in Production? */
if (isDevelopment) {
    app.use(morgan("dev")); /* log server calls with performance timing with development details */

    /* log call requests with body */
    app.use((request, response, next) => {
        console.log(`Received request for ${request.url} with/without body`);
        console.log(request.body);
        next();
    });
} else {
    app.use(morgan("combined")); /* log server calls per standard combined Apache combined format */

}

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
        let newURL = process.env.CURRENT_WEATHER_URL + "?q=" + req.body.q + "&appid=" + process.env.API_KEY + "&units=metric";
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
