export default class Notification {
  constructor(notificationManager) {
    this.show = this.show.bind(this);

    this.notificationManager = notificationManager;

    // Create DOM notification structure when instantiated
    this.containerId = this.notificationManager.getContainerId();
  }

  // Make the notification visible on the screen
  show(title, message, topOffset = 0, context = 'info', duration = 3000) {
    throw new Error("implement in sub-class");
  }
}
