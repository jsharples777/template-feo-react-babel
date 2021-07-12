import logger from './SimpleDebug.js';

class FetchUtil {
    /*
      Utility function for calling JSON POST requests
      Parameters:
      1.  URL to send the POST request too;
      2.  parameters object whose attribute (name/values) are the request parameters; and
      3.  A function to receive the results when the fetch has completed
          The callback function should have the following form
          callback (jsonDataReturned, httpStatusCode)
          a)  A successful fetch will return the JSON data in the first parameter and a status code of the server
          b)  Parameters that cannot be converted to JSON format will give a null data and code 404
          c)  A server error will give that code and no data
    */
    fetchQLJSON(url, parameters, callback) {
        if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log(`Executing fetch with URL ${url} with body ${parameters}`);
        try {
            JSON.stringify({parameters});

        } catch (error) {
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Unable to convert parameters to JSON");
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log(parameters);
            callback(null, 404);
        }
        const postParameters = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({parameters})
        };


        fetch(url, postParameters)
            .then((response) => {
                if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Response code was " + response.status);
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    callback(null, response.status);
                    throw new Error("no results");
                }
            })
            .then(data => {
                callback(JSON.parse(data));
            })
            .catch(error => {
                logger.log(error,10);

            });
    }
}

let fetchUtil = new FetchUtil();

export default fetchUtil;