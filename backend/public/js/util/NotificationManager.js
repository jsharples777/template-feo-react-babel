import BulmaNotification from './Notifications.js';

var NotificationManager = /*#__PURE__*/function () {
  function NotificationManager() {
    this.notifications = [];
    this.currentCount = 0;
    this.offsetPerNotification = 120;
    this.containerId = 'notifications';
  }

  var _proto = NotificationManager.prototype;

  _proto.getContainerId = function getContainerId() {
    return this.containerId;
  };

  _proto.show = function show(title, message, context, duration) {
    if (context === void 0) {
      context = 'info';
    }

    if (duration === void 0) {
      duration = 5000;
    }

    var notification = new BulmaNotification(this);
    var notificationNode = notification.show(title, message, this.currentCount * this.offsetPerNotification, context, duration);
    this.currentCount++;
    this.notifications.push(notificationNode);
  };

  _proto.remove = function remove(notificationNode) {
    var _this = this;

    var foundIndex = this.notifications.findIndex(function (element) {
      return element === notificationNode;
    });

    if (foundIndex >= 0) {
      this.notifications.splice(foundIndex, 1); // re-arrange the remaining notifications

      this.notifications.map(function (notificationNode, index) {
        notificationNode.style.top = _this.offsetPerNotification * index + "px";
      });
    }

    var parentEl = notificationNode.parentElement;
    if (parentEl !== null) parentEl.removeChild(notificationNode);
    this.currentCount--;
    if (this.currentCount < 0) this.currentCount = 0;
  };

  return NotificationManager;
}();

var notifier = new NotificationManager();
export default notifier;