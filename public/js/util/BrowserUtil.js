var BrowserUtil = /*#__PURE__*/function () {
  function BrowserUtil() {}

  var _proto = BrowserUtil.prototype;

  _proto.scrollSmoothToId = function scrollSmoothToId(elementId) {
    var element = document.getElementById(elementId);
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  };

  _proto.scrollSmoothTo = function scrollSmoothTo(element) {
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  };

  _proto.removeAllChildren = function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  };

  return BrowserUtil;
}();

var browserUtil = new BrowserUtil();
export default browserUtil;