var fs = require('fs');

var Logger = /*#__PURE__*/function () {
  function Logger() {}

  Logger.getLogFile = function getLogFile() {
    if (Logger.logFile === null) {
      Logger.logFile = fs.createWriteStream(__dirname + '/../log/server.log', {
        flags: 'w'
      });
    }

    return Logger.logFile;
  };

  Logger.log = function log(message, debugDepth) {
    if (debugDepth === void 0) {
      debugDepth = 5;
    }

    if (message === null || message === undefined) return;
    if (!this.debugOn) return;
    if (debugDepth > this.debugDepth) return;

    if (this.debugOn) {
      console.log(message);
      Logger.getLogFile().write(new Date().toString() + ":" + message + '\n');
    }
  };

  Logger.setLevel = function setLevel(newLevel) {
    Logger.debugDepth = newLevel;
  };

  Logger.setOn = function setOn() {
    Logger.debugOn = true;
  };

  Logger.setOff = function setOff() {
    Logger.debugOn = false;
  };

  return Logger;
}();

Logger.debugOn = true;
Logger.debugDepth = 1000;
Logger.logFile = null;
module.exports = {
  Logger: Logger
};