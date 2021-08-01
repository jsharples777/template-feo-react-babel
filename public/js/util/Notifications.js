var BulmaNotification = /*#__PURE__*/function () {
  function BulmaNotification(notificationManager) {
    this.show = this.show.bind(this);
    this.notificationManager = notificationManager; // Create DOM notification structure when instantiated

    this.containerId = this.notificationManager.getContainerId();
  } // Make the notification visible on the screen


  var _proto = BulmaNotification.prototype;

  _proto.show = function show(title, message, topOffset, context, duration) {
    var _this = this;

    if (topOffset === void 0) {
      topOffset = 0;
    }

    if (context === void 0) {
      context = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    // Creating the notification container div
    var containerNode = document.createElement('div');
    containerNode.className = 'notification note note-visible';
    containerNode.style.top = topOffset + "px"; // Adding the notification title node

    var titleNode = document.createElement('p');
    titleNode.className = 'note-title';
    titleNode.textContent = title; // Adding the notification message content node

    var messageNode = document.createElement('p');
    messageNode.className = 'note-content';
    messageNode.textContent = message; // Adding a little button on the notification

    var closeButtonNode = document.createElement('button');
    closeButtonNode.className = 'delete';
    closeButtonNode.addEventListener('click', function () {
      _this.notificationManager.remove(containerNode);
    }); // Appending the container with all the elements newly created

    containerNode.appendChild(closeButtonNode);
    containerNode.appendChild(titleNode);
    containerNode.appendChild(messageNode);
    containerNode.classList.add("is-" + context); // Inserting the notification to the page body

    document.getElementById(this.containerId).appendChild(containerNode); // Default duration delay

    if (duration <= 0) {
      duration = 2000;
    }

    setTimeout(function () {
      _this.notificationManager.remove(containerNode);
    }, duration);
    return containerNode;
  };

  return BulmaNotification;
}();

export { BulmaNotification as default };