import BootstrapNotification from "./BootstrapNotification";

class NotificationFactory {
    constructor() {
    }

    createNotification(manager) {
        return new BootstrapNotification(manager);
    }
}

const notificationFactory = new NotificationFactory();

export default notificationFactory;