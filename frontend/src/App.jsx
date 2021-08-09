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

debug.log = console.info.bind(console);
const element = <Root className="container-fluid" />;

ReactDOM.render(element, document.getElementById('root'));


