import apiUtil from './util/ApiUtil.js';

export default class Controller {
  constructor(applicationView, clientSideStorage) {
    this.applicationView = applicationView;
    this.clientSideStorage = clientSideStorage;
    this.apiUtil = apiUtil;

    // setup query URLs
    this.queryURL = '';

    // setup local storage key and previous searches array
    this.localStorageKey1 = '';
    this.localStorageItems1 = [];


    // setup event handlers and local storage access call
    this.handleExampleEvent = this.handleExampleEvent.bind(this);
    this.getLocalStorageItems1 = this.getLocalStorageItems1.bind(this);

    // setup Async callbacks for the fetch requests
    this.callbackForFetchFromAPI = this.callbackForFetchFromAPI.bind(this);
  }

  handleExampleEvent(event) {

  }

  getLocalStorageItems1() {
    return [];
  }

  /* example interface used from the callback for FetchUtil */
  callbackForFetchFromAPI(jsonData, httpStatus) {

  }
}
