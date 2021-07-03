import SimpleDebug from './util/SimpleDebug.js'
import Controller from "./Controller.js";
//  import * as React from "react";
//  import * as ReactDOM from "react-dom";

// @ts-ignore
class App extends React.Component {
    private controller:any;

    constructor() {

        // @ts-ignore
        super();
        SimpleDebug.setOn();
        SimpleDebug.setLevel(100);
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


// @ts-ignore
const element = <App className={"container-fluid"}/>

// @ts-ignore
ReactDOM.render(element, document.getElementById("root"));
