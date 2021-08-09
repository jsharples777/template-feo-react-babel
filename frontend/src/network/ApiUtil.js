import debug from 'debug';

const apiLogger = debug('api');

class ApiUtil {
  __fetchJSON(url, parameters, callback, queueId = 0, requestId = 0) {
    fetch(url, parameters)
      .then((response) => {
        apiLogger(`Response code was ${response.status}`);
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        }
        // else {
        //     callback(null, response.status,queueId, requestId);
        //     throw new Error("no results");
        // }
      })
      .then((data) => {
        apiLogger(data);
        callback(data, 200, queueId, requestId);
      })
      .catch((error) => {
        apiLogger(error);
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
    apiLogger(`Executing fetch with URL ${url} with body ${parameters}`);
    try {
      JSON.stringify({ parameters });
    } catch (error) {
      apiLogger('Unable to convert parameters to JSON');
      apiLogger(parameters, 100);
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
    apiLogger(`Executing GET fetch with URL ${url} with id ${parameters.id}`);
    const getParameters = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    if (parameters.id) url += `/${parameters.id}`;

    this.__fetchJSON(url, getParameters, callback, queueId, requestId);
  }

  apiFetchJSONWithDelete(url, parameters, callback, queueId = 0, requestId = 0) {
    apiLogger(`Executing DELETE fetch with URL ${url} with id ${parameters.id}`);
    const delParameters = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    if (parameters.id) url += `/${parameters.id}`;

    this.__fetchJSON(url, delParameters, callback, queueId, requestId);
  }

  apiFetchJSONWithPut(url, parameters, callback, queueId = 0, requestId = 0) {
    apiLogger(`Executing PUT fetch with URL ${url} with id ${parameters.id}`);
    const putParameters = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...parameters }),
    };
    if (parameters.id) url += `/${parameters.id}`;

    this.__fetchJSON(url, putParameters, callback, queueId, requestId);
  }
}

const apiUtil = new ApiUtil();

export default apiUtil;
