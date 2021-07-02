import logger from './util/SimpleDebug.js'
import Controller from "./Controller.js";

class App extends React.Component {


    constructor() {
        super();
        logger.setOn();
        logger.setLevel(100);
        this.controller = new Controller(this,window.localStorage);
    }

    render() {
        return (
            <div id="App" className="App">
                <h1>Hello World!</h1>
            </div>
        );
    }
}


const element = <App className={"container-fluid"}/>

ReactDOM.render(element, document.getElementById("root"));
