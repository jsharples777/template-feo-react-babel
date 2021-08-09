import debug from 'debug';

const sDebug = debug('socket');

class SocketManager{
    constructor() {
        this.callbackForMessage = this.callbackForMessage.bind(this);
        this.callbackForData = this.callbackForData.bind(this);
    }

    callbackForMessage(message) {
        sDebug(`Received message : ${message}`);
        this.listener.handleMessage(message);
    }

    /*
    *
    *  expecting a JSON data object with the following attributes
    *  1.  type: "create"|"update"|"delete"
    *  2.  objectType: string name of the object type changed
    *  3.  data: the new representation of the object
    *  4.  user: application specific id for the user who made the change
    *        - the application view is required to implement getCurrentUser() to compare the user who made the change
    *
     */
    callbackForData(message) {
        sDebug(`Received data`);
        try {
            const dataObj = JSON.parse(message);
            sDebug(dataObj);
            if (dataObj.user === this.listener.getCurrentUser()) {
                sDebug("change made by this user, ignoring");
            }
            else {
                sDebug("change made by another user, passing off to the application");
                this.listener.handleDataChangedByAnotherUser(dataObj);
            }

        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    setListener(listener) {
        sDebug('Setting listener');
        this.listener = listener;
        sDebug('Creating socket connection');
        this.socket = io();
        sDebug('Waiting for messages');
        this.socket.on('message',this.callbackForMessage);
        this.socket.on('data',this.callbackForData)
    }

    sendMessage(message) {
        this.socket.emit('message',message);
    }
}

let socketManager = new SocketManager();
export default socketManager;