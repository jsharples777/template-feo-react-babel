/* base server for the application */
const express = require('express');
const request = require('request');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const {Server} = require("socket.io");
const http = require('http');
const dotenv = require('dotenv')

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer,{});
dotenv.config();

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(bodyparser.json())); /* handle JSON POST */
io.use(wrap(morgan("dev"))); /* log server calls with performance timinig */

/* log call requests with body */
io.use(wrap((request, response, next) => {
    console.log(`Received request for ${request.url} with/without body`);
    console.log(request.body);
    next();
}));

/* setup the public files to be available (e.g. content, css, client side js files) */
app.use('/',express.static("public"));
app.use('/dist', express.static("dist"));

/* handle request for current weather from Open Weather API */
app.get("/test", (req, res) => {
    console.log("url: " + req.url);
    res.send("Hello World");
});

/* handle forecast retrieval from Open Weather API */
app.post("/forecast", (req, res) => {
    console.log("url: " + req.url);
    console.log("body: " + req.body);
    let newURL = process.env.FORECAST_URL + "?lat=" + req.body.parameters.lat + "&lon=" + req.body.parameters.lon + "&appid=" + process.env.API_KEY + "&units=metric&exclude='minutely,hourly,alerts'";
    console.log("new URL is: " + newURL);
    request(newURL, function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body);
        res.status(response.statusCode);
        res.json(body);

    });
});

const port = process.env.PORT || 3000;

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

httpServer.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
