/* base server for the application */
const express = require('express');
require('dotenv').config();


const app = express();


/* setup the public files to be available (e.g. content, css, client side js files) */
app.use(express.static("public"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
