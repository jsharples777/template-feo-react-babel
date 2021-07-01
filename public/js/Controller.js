import logger from './util/SimpleDebug.js';

var Controller = function Controller(applicationView, clientSideStorage) {
  this.applicationView = applicationView;
  this.clientSideStorage = clientSideStorage; // setup query URLs
  // setup local storage key and previous searches array
  // setup event handlers and local storage access call
  // setup Async callbacks for the fetch requests
};

export { Controller as default };