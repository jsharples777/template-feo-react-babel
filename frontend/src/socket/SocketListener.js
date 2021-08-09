/*abstract (interface)*/ export default class SocketListener{
    handleDataChangedByAnotherUser(message) {
        throw new Error("Implement in subclass");
    }

    handleMessage(message) {
        throw new Error("Implement in subclass");
    }

    getCurrentUser() {
        throw new Error("Implement in subclass");
    }
}

