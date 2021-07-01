/* base server for the application */
const express = require('express');
const request = require('request');
const morgan = require('morgan');
const bodyparser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyparser.json()); /* handle JSON POST */
app.use(morgan("dev")); /* log server calls with performance timinig */

/* log call requests with body */
app.use((request, response, next) => {
    console.log(`Received request for ${request.url} with/without body`);
    console.log(request.body);
    next();
});

/* setup the public files to be available (e.g. content, css, client side js files) */
app.use(express.static("public"));

/* handle request for current weather from Open Weather API */
app.post("/current", (req, res) => {
    console.log("url: " + req.url);
    console.log("body: " + req.body);
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

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
