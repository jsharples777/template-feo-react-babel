function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import apiUtil from './ApiUtil.js';
import uuid from './UUID.js';
import logger from './SimpleDebug.js';

var DownloadManager = /*#__PURE__*/function () {
  function DownloadManager() {
    this.backgroundQueue = [];
    this.priorityQueue = [];
    this.inProgress = [];
    this.callbackForQueueRequest = this.callbackForQueueRequest.bind(this);
  }

  var _proto = DownloadManager.prototype;

  _proto.setBackgroundChangeListener = function setBackgroundChangeListener(uiChangeListener) {
    this.backgroundChangeListener = uiChangeListener;
  };

  _proto.setPriorityChangeListener = function setPriorityChangeListener(uiChangeListener) {
    this.priorityChangeListener = uiChangeListener;
  };

  _proto.getPriorityQueueCount = function getPriorityQueueCount() {
    return this.priorityQueue.length;
  };

  _proto.getBackgroundQueueCount = function getBackgroundQueueCount() {
    return this.backgroundQueue.length;
  };

  _proto.addApiRequest = function addApiRequest(jsonRequest, isPriority) {
    if (isPriority === void 0) {
      isPriority = false;
    }

    /*
        jsonPostRequest should be an object with attributes
        a) url - the url
        b) params - the parameters, including type GET/POST/DELETE
        c) callback - the function to receive the callback of results/status
         */
    // add a new requestId to the request for future tracking
    var requestId = uuid.getUniqueId();
    jsonRequest.requestId = requestId;
    logger.log("Download Manger: Adding Queue Request " + requestId, 100);
    logger.log(jsonRequest, 200);

    if (isPriority) {
      jsonRequest.queueId = 1;
      this.priorityQueue.push(jsonRequest);
      if (this.priorityChangeListener) this.priorityChangeListener.handleEventAddToQueue();
    } else {
      jsonRequest.queueId = 0;
      this.backgroundQueue.push(jsonRequest);
      if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventAddToQueue();
    }

    this.processQueues();
  };

  _proto.processPriorityQueue = /*#__PURE__*/function () {
    var _processPriorityQueue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var queueItem;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              queueItem = this.priorityQueue.shift();
              this.inProgress.push(queueItem);
              this.initiateFetchForQueueItem(queueItem);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function processPriorityQueue() {
      return _processPriorityQueue.apply(this, arguments);
    }

    return processPriorityQueue;
  }();

  _proto.processBackgroundQueue = /*#__PURE__*/function () {
    var _processBackgroundQueue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var queueItem;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              queueItem = this.backgroundQueue.shift();
              this.inProgress.push(queueItem);
              this.initiateFetchForQueueItem(queueItem);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function processBackgroundQueue() {
      return _processBackgroundQueue.apply(this, arguments);
    }

    return processBackgroundQueue;
  }();

  _proto.processQueues = /*#__PURE__*/function () {
    var _processQueues = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var totalQueuedItems;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;

            case 1:
              if (!(totalQueuedItems > 0)) {
                _context3.next = 14;
                break;
              }

              logger.log("Download Manager: processing queue, items remaining " + totalQueuedItems, 100); // priority queue takes priority

              if (!(this.priorityQueue.length > 0)) {
                _context3.next = 8;
                break;
              }

              _context3.next = 6;
              return this.processPriorityQueue();

            case 6:
              _context3.next = 11;
              break;

            case 8:
              if (!(this.backgroundQueue.length > 0)) {
                _context3.next = 11;
                break;
              }

              _context3.next = 11;
              return this.processBackgroundQueue();

            case 11:
              totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
              _context3.next = 1;
              break;

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function processQueues() {
      return _processQueues.apply(this, arguments);
    }

    return processQueues;
  }();

  _proto.callbackForQueueRequest = function callbackForQueueRequest(jsonData, httpStatus, queueId, requestId) {
    // let the listeners know about the completion
    if (queueId === 1) {
      // priority
      if (this.priorityChangeListener) this.priorityChangeListener.handleEventRemoveFromQueue();
    } else if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventRemoveFromQueue();

    logger.log("Download Manager: received callback for queue " + queueId + " request " + requestId + " with status " + httpStatus, 100); // find the item in the in progress

    var foundIndex = this.inProgress.findIndex(function (element) {
      return element.requestId === requestId;
    });

    if (foundIndex >= 0) {
      // remove from in progress
      var queueItem = this.inProgress[foundIndex];
      this.inProgress.splice(foundIndex, 1);
      logger.log(queueItem);
      logger.log("Download Manager: finished for queue item " + queueItem.requestId, 100); // let the callback function know

      queueItem.callback(jsonData, httpStatus);
    }
  };

  _proto.initiateFetchForQueueItem = function initiateFetchForQueueItem(item) {
    logger.log("Download Manager: initiating fetch for queue item " + item.requestId, 100);
    logger.log(item);

    if (item.url !== null && item.params != null && item.callback != null) {
      switch (item.params.type) {
        case 'POST':
          {
            apiUtil.apiFetchJSONWithPost(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
            break;
          }

        case 'GET':
          {
            apiUtil.apiFetchJSONWithGet(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
            break;
          }

        case 'DELETE':
          {
            apiUtil.apiFetchJSONWithDelete(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
            break;
          }
      }
    }
  };

  return DownloadManager;
}();

var downloader = new DownloadManager();
export default downloader;