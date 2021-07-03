System.register(["./util/SimpleDebug.js"], function (exports_1, context_1) {
    "use strict";
    var SimpleDebug_js_1, Controller;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (SimpleDebug_js_1_1) {
                SimpleDebug_js_1 = SimpleDebug_js_1_1;
            }
        ],
        execute: function () {
            Controller = /** @class */ (function () {
                function Controller(applicationView, clientSideStorage) {
                    this.applicationView = applicationView;
                    this.clientSideStorage = clientSideStorage;
                    // setup query URLs
                    // setup local storage key and previous searches array
                    // setup event handlers and local storage access call
                    this.handleExampleEvent = this.handleExampleEvent.bind(this);
                    // setup Async callbacks for the fetch requests
                    this.callbackForFetchFromAPI = this.callbackForFetchFromAPI.bind(this);
                }
                Controller.prototype.handleExampleEvent = function (event) {
                    SimpleDebug_js_1.default.log("Handling example event", 2);
                };
                /* example interface used from the callback for FetchUtil */
                Controller.prototype.callbackForFetchFromAPI = function (jsonData, httpStatus) {
                };
                return Controller;
            }());
            exports_1("default", Controller);
        }
    };
});
