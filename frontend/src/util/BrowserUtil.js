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
    if (element && element.firstChild) {
      while (element.firstChild) {
        element.removeChild(element.lastChild);
      }
    }
  }

  addRemoveClasses(element,classesText,isAdding = true) {
    let classes = classesText.split(' ');
    classes.forEach((classValue) => {
        if (classValue.trim().length > 0) {
          if (isAdding) {
            element.classList.add(classValue);
          } else {
            element.classList.remove(classValue);
          }
        }
    });
  }
}

const browserUtil = new BrowserUtil();

export default browserUtil;
