import logger from './SimpleDebug.js';

class ApiUtil {
  __fetchJSON(url, parameters, callback, queueId = 0, requestId = 0) {
    fetch(url, parameters)
      .then((response) => {
        logger.log(`Response code was ${response.status}`);
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }
        // else {
        //     callback(null, response.status,queueId, requestId);
        //     throw new Error("no results");
        // }
      })
      .then((data) => {
        logger.log(data);
        callback(data, 200, queueId, requestId);
      })
      .catch((error) => {
        logger.log(error);
        callback(null, 500, queueId, requestId);
      });
  }

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
  apiFetchJSONWithPost(url, parameters, callback, queueId = 0, requestId = 0) {
    logger.log(`Executing fetch with URL ${url} with body ${parameters}`, 100);
    try {
      JSON.stringify({ parameters });
    } catch (error) {
      logger.log('Unable to convert parameters to JSON', 100);
      logger.log(parameters, 100);
      callback(null, 404, queueId, requestId);
    }
    const postParameters = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parameters }),
    };

    this.__fetchJSON(url, postParameters, callback, queueId, requestId);
  }

  apiFetchJSONWithGet(url, parameters, callback, queueId = 0, requestId = 0) {
    logger.log(`Executing GET fetch with URL ${url} with id ${parameters.id}`, 100);
    const getParameters = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    if (parameters.id) url += `/${parameters.id}`;

    this.__fetchJSON(url, getParameters, callback, queueId, requestId);
  }

  apiFetchJSONWithDelete(url, parameters, callback, queueId = 0, requestId = 0) {
    logger.log(`Executing DELETE fetch with URL ${url} with id ${parameters.id}`, 100);
    const delParameters = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    if (parameters.id) url += `/${parameters.id}`;

    this.__fetchJSON(url, delParameters, callback, queueId, requestId);
  }
}

const apiUtil = new ApiUtil();

export default apiUtil;
