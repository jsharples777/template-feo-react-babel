import fetchUtil from "./FetchUtil.js";
import uuid from "./UUID.js";
import logger from "./SimpleDebug.js";

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

    addRequest(jsonPostRequest,isPriority = false) {
        /*
        jsonPostRequest should be an object with attributes
        a) url - the POST url
        b) params - the POST parameters
        c) callback - the function to receive the callback of results/status
         */
        // add a new requestId to the request for future tracking
        let requestId = uuid.getUniqueId();
        jsonPostRequest.requestId = requestId;
        logger.log(`Download Manger: Adding Queue Request ${requestId}`,100);
        logger.log(jsonPostRequest,200);

        if (isPriority) {
            jsonPostRequest.queueId = 1;
            this.priorityQueue.push(jsonPostRequest);
            if (this.priorityChangeListener) this.priorityChangeListener.handleEventAddToQueue();
        }
        else {
            jsonPostRequest.queueId = 0;
            this.backgroundQueue.push(jsonPostRequest);
            if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventAddToQueue();
        }
        this.processQueues();
    }

    async processPriorityQueue() {
        let queueItem = this.priorityQueue.shift();
        this.inProgress.push(queueItem);
        this.initiateFetchForQueueItem(queueItem);
    }

    async processBackgroundQueue() {
        let queueItem = this.backgroundQueue.shift();
        this.inProgress.push(queueItem);
        this.initiateFetchForQueueItem(queueItem);
    }

    async processQueues() {
        let totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
        while(totalQueuedItems > 0) {
            logger.log(`Download Manager: processing queue, items remaining ${totalQueuedItems}`,100);
            // priority queue takes priority
            if (this.priorityQueue.length > 0) {
                await this.processPriorityQueue();
            }
            else if (this.backgroundQueue.length > 0) {
                await this.processBackgroundQueue();
            }
            totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
        }
    }

    callbackForQueueRequest(jsonData,httpStatus,queueId, requestId) {
        // let the listeners know about the completion
        if (queueId === 1) { // priority
            if (this.priorityChangeListener) this.priorityChangeListener.handleEventRemoveFromQueue()
        }
        else {
            if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventRemoveFromQueue();
        }
        // find the item in the in progress
        let foundIndex = this.inProgress.findIndex((element) => element.requestId === requestId);
        if (foundIndex >= 0) {
            // remove from in progress
            let queueItem = this.inProgress[foundIndex];
            this.inProgress.splice(foundIndex, 1);
            logger.log(queueItem);
            logger.log(`Download Manager: finished for queue item ${queueItem.requestId}`,100);
            // let the callback function know
            queueItem.callback(jsonData,httpStatus);
        }
    }

    initiateFetchForQueueItem(queueItem) {
        let {url,params,callback,queueId,requestId} = queueItem;
        if ((url !== null) && (params != null) && (callback != null)) {
            fetchUtil.fetchJSON(url,params,this.callbackForQueueRequest,queueId,requestId);
        }
    }
}

let downloader = new DownloadManager();

export default downloader;