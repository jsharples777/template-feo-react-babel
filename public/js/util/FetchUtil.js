import { logger } from './SimpleDebug.js';

var FetchUtil = /*#__PURE__*/function () {
  function FetchUtil() {}

  var _proto = FetchUtil.prototype;

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
  _proto.fetchQLJSON = function fetchQLJSON(url, parameters, callback) {
    logger.log("Executing fetch with URL " + url + " with body " + parameters, 100);

    try {
      JSON.stringify({
        parameters: parameters
      });
    } catch (error) {
      logger.log("Unable to convert parameters to JSON", 100);
      logger.log(parameters, 100);
      callback(null, 404);
    }

    var postParameters = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parameters: parameters
      })
    };
    fetch(url, postParameters).then(function (response) {
      logger.log("Response code was " + response.status);

      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        callback(null, response.status);
        throw new Error("no results");
      }
    }).then(function (data) {
      callback(JSON.parse(data));
    }).catch(function (error) {});
  };

  return FetchUtil;
}();

var fetchUtil = new FetchUtil();
export default fetchUtil;