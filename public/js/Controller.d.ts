export default class Controller {
    private applicationView;
    private clientSideStorage;
    constructor(applicationView: any, clientSideStorage: any);
    handleExampleEvent(event: Event): void;
    callbackForFetchFromAPI(jsonData: any, httpStatus: number): void;
}
