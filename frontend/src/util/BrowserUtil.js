class BrowserUtil {
    constructor() {
    }

    scrollSmoothToId(elementId) {
        let element = document.getElementById(elementId);
        element.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }

    scrollSmoothTo(element) {
        element.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }

    removeAllChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.lastChild);
        }
    }
}

let browserUtil = new BrowserUtil();

export default browserUtil;