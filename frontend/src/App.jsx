import {React} from 'react';
import {logger} from './util/SimpleDebug.js'

class App extends React.Component {


    constructor() {
        super();
        logger.setOn();
        logger.setLevel(100);
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
