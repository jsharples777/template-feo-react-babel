System.register(["./SimpleDebug.js"], function (exports_1, context_1) {
    "use strict";
    var SimpleDebug_js_1, FetchUtil;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (SimpleDebug_js_1_1) {
                SimpleDebug_js_1 = SimpleDebug_js_1_1;
            }
        ],
        execute: function () {
            FetchUtil = /** @class */ (function () {
                function FetchUtil() {
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
                FetchUtil.fetchQLJSON = function (url, parameters, callback) {
                    SimpleDebug_js_1.default.log("Executing fetch with URL " + url + " with body " + parameters, 100);
                    try {
                        JSON.stringify({ parameters: parameters });
                    }
                    catch (error) {
                        SimpleDebug_js_1.default.log("Unable to convert parameters to JSON", 100);
                        SimpleDebug_js_1.default.log(parameters, 100);
                        callback(null, 404);
                    }
                    var postParameters = {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ parameters: parameters })
                    };
                    fetch(url, postParameters)
                        .then(function (response) {
                        SimpleDebug_js_1.default.log("Response code was " + response.status);
                        if (response.status >= 200 && response.status <= 299) {
                            return response.json();
                        }
                        else {
                            callback(null, response.status);
                            throw new Error("no results");
                        }
                    })
                        .then(function (data) {
                        callback(JSON.parse(data), 200);
                    })
                        .catch(function (error) {
                        callback(null, 404);
                    });
                };
                return FetchUtil;
            }());
            exports_1("default", FetchUtil);
        }
    };
});
