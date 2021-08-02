import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io';
import jquery from 'jquery';

import debug from 'debug';


// import logger from './util/SimpleDebug.js';
const logger = debug('App');
import Controller from './Controller.js';

localStorage.debug = 'App Controller'


class Root extends React.Component {
  constructor() {
    super();
    this.controller = new Controller(this, window.localStorage);
  }

  render() {
    logger("Rendering App");
    return (
      <div id="Root" className="Root">
        <h1>Hello World!</h1>
      </div>
    );
  }
}


const element = <Root className="container-fluid" />;

ReactDOM.render(element, document.getElementById('root'));

// const socket = io();
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
