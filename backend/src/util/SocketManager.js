const socketDebug = require('debug')('socket');
const {Server} = require("socket.io");

class SocketManager {
    constructor () {}

    connectToServer(httpServer) {
        socketDebug('Connecting up to the HTTP server');
        this.io = new Server(httpServer);
    }

    listen() {
        socketDebug('starting to listen for connections');
        this.io.on('connection', (socket) => {
            socketDebug('Sockets: a user connected');
            socket.on('disconnect', () => {
                socketDebug('Sockets: user disconnected');
            });
            socket.on('message', (msg) => {
                socketDebug("Sockets: Received message " + msg);
                this.io.emit('message', msg);
                socketDebug("Sockets: Sending message " + msg);
            });
        });
    }

    sendMessage(message) {
        socketDebug("Sending data " + message);
        this.io.emit('data', JSON.stringify(message));
    }
}

let socketManager = new SocketManager();

module.exports = socketManager;