import SimpleDebug from './util/SimpleDebug.js';
import FetchUtil from "./util/FetchUtil.js";


export default class Controller {
    private applicationView:any;
    private clientSideStorage:any;


    constructor(applicationView:any, clientSideStorage:any) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;


        // setup query URLs


        // setup local storage key and previous searches array



        // setup event handlers and local storage access call
        this.handleExampleEvent = this.handleExampleEvent.bind(this);

        // setup Async callbacks for the fetch requests
        this.callbackForFetchFromAPI = this.callbackForFetchFromAPI.bind(this);

    }

    handleExampleEvent(event:Event):void {
        SimpleDebug.log("Handling example event",2);

    }

    /* example interface used from the callback for FetchUtil */
    callbackForFetchFromAPI(jsonData:any, httpStatus:number):void {

    }

}
