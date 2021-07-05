System.register(["./util/SimpleDebug.js", "./Controller.js"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var SimpleDebug_js_1, Controller_js_1, App, element;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (SimpleDebug_js_1_1) {
                SimpleDebug_js_1 = SimpleDebug_js_1_1;
            },
            function (Controller_js_1_1) {
                Controller_js_1 = Controller_js_1_1;
            }
        ],
        execute: function () {
            //  import * as React from "react";
            //  import * as ReactDOM from "react-dom";
            // @ts-ignore
            App = /** @class */ (function (_super) {
                __extends(App, _super);
                function App() {
                    var _this = 
                    // @ts-ignore
                    _super.call(this) || this;
                    SimpleDebug_js_1.default.setOn();
                    SimpleDebug_js_1.default.setLevel(100);
                    _this.controller = new Controller_js_1.default(_this, window.localStorage);
                    return _this;
                }
                App.prototype.render = function () {
                    return (React.createElement("div", { id: "App", className: "App" },
                        React.createElement("h1", null, "Hello World!")));
                };
                return App;
            }(React.Component));
            // @ts-ignore
            element = React.createElement(App, { className: "container-fluid" });
            // @ts-ignore
            ReactDOM.render(element, document.getElementById("root"));
        }
    };
});
