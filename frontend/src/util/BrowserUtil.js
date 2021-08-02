class BrowserUtil {
  constructor() {
  }

  scrollSmoothToId(elementId) {
    const element = document.getElementById(elementId);
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  scrollSmoothTo(element) {
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  }
}

const browserUtil = new BrowserUtil();

export default browserUtil;
