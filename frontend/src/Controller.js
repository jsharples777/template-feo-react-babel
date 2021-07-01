import logger from './util/SimpleDebug.js';


export default class Controller {

    constructor(applicationView, clientSideStorage) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;
        // setup query URLs

        // setup local storage key and previous searches array



        // setup event handlers and local storage access call


        // setup Async callbacks for the fetch requests

    }


    /* utility function for calling JSON POST requests */
    __fetchQLJSON(url, parameters, callback) {
        logger.log(`Executing fetch with URL ${url} with body ${parameters}`, 100);
        try {
            JSON.stringify({parameters});

        } catch (error) {
            logger.log("Unable to convert parameters to JSON", 100);
            logger.log(parameters, 100);
            callback(null, 404);
        }
        const postParameters = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({parameters})
        };


        fetch(url, postParameters)
            .then((response) => {
                logger.log("Response code was " + response.status);
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

            });

    }


}
