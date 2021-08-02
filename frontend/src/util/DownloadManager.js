import apiUtil from './ApiUtil.js';
import uuid from './UUID.js';
import logger from './SimpleDebug.js';

class DownloadManager {
  constructor() {
    this.backgroundQueue = [];
    this.priorityQueue = [];
    this.inProgress = [];
    this.callbackForQueueRequest = this.callbackForQueueRequest.bind(this);
  }


  setBackgroundChangeListener(uiChangeListener) {
    this.backgroundChangeListener = uiChangeListener;
  }

  setPriorityChangeListener(uiChangeListener) {
    this.priorityChangeListener = uiChangeListener;
  }

  getPriorityQueueCount() {
    return this.priorityQueue.length;
  }

  getBackgroundQueueCount() {
    return this.backgroundQueue.length;
  }

  addApiRequest(jsonRequest, isPriority = false) {
    /*
        jsonPostRequest should be an object with attributes
        a) url - the url
        b) params - the parameters, including type GET/POST/DELETE
        c) callback - the function to receive the callback of results/status
         */
    // add a new requestId to the request for future tracking
    const requestId = uuid.getUniqueId();
    jsonRequest.requestId = requestId;
    logger.log(`Download Manger: Adding Queue Request ${requestId}`, 100);
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
  }

  async processPriorityQueue() {
    const queueItem = this.priorityQueue.shift();
    this.inProgress.push(queueItem);
    this.initiateFetchForQueueItem(queueItem);
  }

  async processBackgroundQueue() {
    const queueItem = this.backgroundQueue.shift();
    this.inProgress.push(queueItem);
    this.initiateFetchForQueueItem(queueItem);
  }

  async processQueues() {
    let totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
    while (totalQueuedItems > 0) {
      logger.log(`Download Manager: processing queue, items remaining ${totalQueuedItems}`, 100);
      // priority queue takes priority
      if (this.priorityQueue.length > 0) {
        await this.processPriorityQueue();
      } else if (this.backgroundQueue.length > 0) {
        await this.processBackgroundQueue();
      }
      totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
    }
  }

  callbackForQueueRequest(jsonData, httpStatus, queueId, requestId) {
    // let the listeners know about the completion
    if (queueId === 1) { // priority
      if (this.priorityChangeListener) this.priorityChangeListener.handleEventRemoveFromQueue();
    } else if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventRemoveFromQueue();
    logger.log(`Download Manager: received callback for queue ${queueId} request ${requestId} with status ${httpStatus}`, 100);
    // find the item in the in progress
    const foundIndex = this.inProgress.findIndex(element => element.requestId === requestId);
    if (foundIndex >= 0) {
      // remove from in progress
      const queueItem = this.inProgress[foundIndex];
      this.inProgress.splice(foundIndex, 1);
      logger.log(queueItem);
      logger.log(`Download Manager: finished for queue item ${queueItem.requestId}`, 100);
      // let the callback function know
      queueItem.callback(jsonData, httpStatus);
    }
  }

  initiateFetchForQueueItem(item) {
    logger.log(`Download Manager: initiating fetch for queue item ${item.requestId}`, 100);
    logger.log(item);
    if ((item.url !== null) && (item.params != null) && (item.callback != null)) {
      switch (item.params.type) {
        case 'POST': {
          apiUtil.apiFetchJSONWithPost(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
          break;
        }
        case 'GET': {
          apiUtil.apiFetchJSONWithGet(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
          break;
        }
        case 'DELETE': {
          apiUtil.apiFetchJSONWithDelete(item.url, item.params, this.callbackForQueueRequest, item.queueId, item.requestId);
          break;
        }
      }
    }
  }
}

const downloader = new DownloadManager();

export default downloader;
