function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io';
import jquery from 'jquery';
import logger from './util/SimpleDebug.js';
import Controller from './Controller.js';

var Root = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Root, _React$Component);

  function Root() {
    var _this;

    _this = _React$Component.call(this) || this;
    logger.setOn();
    logger.setLevel(100);
    _this.controller = new Controller(_assertThisInitialized(_this), window.localStorage);
    return _this;
  }

  var _proto = Root.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", {
      id: "Root",
      className: "Root"
    }, /*#__PURE__*/React.createElement("h1", null, "Hello World!"));
  };

  return Root;
}(React.Component);

var element = /*#__PURE__*/React.createElement(Root, {
  className: "container-fluid"
});
ReactDOM.render(element, document.getElementById('root')); // const socket = io();
//
// const form = document.getElementById('form');
// const input = document.getElementById('input');
//
// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   if (input.value) {
//     console.log(`Sending ${input.value}`);
//     socket.emit('chat message', input.value);
//     input.value = '';
//   }
// });
//
// socket.on('chat message', (msg) => {
//   const item = document.createElement('li');
//   console.log(`received message ${msg}`);
//   item.textContent = msg;
//   messages.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });