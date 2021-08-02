var SimpleDebug = /*#__PURE__*/function () {
  function SimpleDebug() {
    this.debugOn = true;
    this.debugDepth = 100;
  }

  var _proto = SimpleDebug.prototype;

  _proto.log = function log(message, debugDepth) {
    if (debugDepth === void 0) {
      debugDepth = 5;
    }

    if (!this.debugOn) return;
    if (debugDepth > this.debugDepth) return;
    console.log(message);
  };

  _proto.setLevel = function setLevel(newLevel) {
    this.debugDepth = newLevel;
  };

  _proto.setOn = function setOn() {
    this.debugOn = true;
  };

  _proto.setOff = function setOff() {
    this.debugOn = false;
  };

  return SimpleDebug;
}();

var logger = new SimpleDebug();
export default logger;