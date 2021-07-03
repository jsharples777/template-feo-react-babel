System.register([], function (exports_1, context_1) {
    "use strict";
    var SimpleDebug;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            SimpleDebug = /** @class */ (function () {
                function SimpleDebug() {
                }
                SimpleDebug.log = function (message, debugDepth) {
                    if (debugDepth === void 0) { debugDepth = 5; }
                    if (!SimpleDebug.debugOn)
                        return;
                    if (debugDepth > SimpleDebug.debugDepth)
                        return;
                    console.log(message);
                };
                SimpleDebug.setLevel = function (newLevel) {
                    SimpleDebug.debugDepth = newLevel;
                };
                SimpleDebug.setOn = function () {
                    SimpleDebug.debugOn = true;
                };
                SimpleDebug.setOff = function () {
                    SimpleDebug.debugOn = false;
                };
                SimpleDebug.debugOn = true;
                SimpleDebug.debugDepth = 100;
                return SimpleDebug;
            }());
            exports_1("default", SimpleDebug);
        }
    };
});
