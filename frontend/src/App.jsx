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

var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        console.log(input.value);
        socket.emit('chat message', input.value);
        input.value = '';
    }
});