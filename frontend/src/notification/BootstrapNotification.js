import Notification from './Notification';

export default class BootstrapNotification extends Notification {
  constructor(notificationManager) {
     super(notificationManager);
  }

  // Make the notification visible on the screen
  show(title, message, topOffset = 0, context = 'info', duration = 3000) {
    let containerId = this.notificationManager.getContainerId();
    // convert the context to a background colour
    let bgColorClass = '';
    switch (context) {
      case 'info': {
        bgColorClass = 'bg-info';
        break;
      }
      case 'warning': {
        bgColorClass = 'bg-warning';
        break;
      }
      case 'message': {
        bgColorClass = 'bg-primary';
        break;
      }
      case 'priority': {
        bgColorClass = 'bg-danger';
        break;
      }
      default: {
        bgColorClass = "bg-info";
      }

    }
    // Creating the notification container div
    const containerNode = document.createElement('div');
    containerNode.className = 'notification toast';
    containerNode.style.top = `${topOffset}px`;
    containerNode.setAttribute("role","alert");
    containerNode.setAttribute("data-autohide","false");

    // Adding the notification title node
    const titleNode = document.createElement('div');
    titleNode.className = `toast-header text-white ${bgColorClass}`;

    const titleTextNode = document.createElement('strong');
    titleTextNode.className = "mr-auto";
    titleTextNode.textContent = title;

    // Adding a little button on the notification
    const closeButtonNode = document.createElement('button');
    closeButtonNode.className = 'ml-2 mb-1 close';
    closeButtonNode.textContent = 'x';
    closeButtonNode.addEventListener('click', () => {
      this.notificationManager.remove(containerNode);
    });


    // Adding the notification message content node
    const messageNode = document.createElement('div');
    messageNode.className = 'toast-body';
    messageNode.textContent = message;


    // Appending the container with all the elements newly created
    titleNode.appendChild(titleTextNode);
    titleNode.appendChild(closeButtonNode);
    containerNode.appendChild(titleNode);
    containerNode.appendChild(messageNode);
    containerNode.classList.add(`is-${context}`);

    // Inserting the notification to the page body
    document.getElementById(containerId).appendChild(containerNode);

    // activate it
    $(".notification").toast('show');

    // Default duration delay
    if (duration <= 0) {
      duration = 2000;
    }
    setTimeout(() => {
      this.notificationManager.remove(containerNode);
    }, duration);
    return containerNode;
  }
}
