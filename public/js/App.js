function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import logger from './util/SimpleDebug.js';
import Controller from "./Controller.js";

var App = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(App, _React$Component);

  function App() {
    var _this;

    _this = _React$Component.call(this) || this;
    logger.setOn();
    logger.setLevel(100);
    _this.controller = new Controller(_assertThisInitialized(_this), window.localStorage);
    return _this;
  }

  var _proto = App.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "App",
      className: "App"
    }, /*#__PURE__*/React.createElement("h1", null, "Hello World!"));
  };

  return App;
}(React.Component);

var element = /*#__PURE__*/React.createElement(App, {
  className: "container-fluid"
});
ReactDOM.render(element, document.getElementById("root"));