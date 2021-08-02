var debug = require('debug')('datasource:json');

var fs = require('fs');

var JSONFileStorageUtil = /*#__PURE__*/function () {
  function JSONFileStorageUtil() {
    this.storageDirectory = process.env.JSONDB_PATH;
    this.storageFileName = process.env.JSONDB_FILENAME;
    this.filename = this.storageDirectory + "/" + this.storageFileName;
    this.savedData = [];
  }

  var _proto = JSONFileStorageUtil.prototype;

  _proto.initialise = function initialise() {
    var _this = this;

    debug("Check to see if file " + this.filename + " exists");
    fs.access(this.filename, fs.constants.F_OK, function (err) {
      if (!err) {
        debug(_this.filename + " already exists");
        _this.savedData = _this.getDataFromFile();
      } else {
        debug(_this.filename + " does not exist - creating with empty array");
        var dbFile = fs.createWriteStream(_this.filename, {
          flags: 'w'
        });
        dbFile.write(JSON.stringify([]));
        dbFile.close();
      }
    });
  };

  _proto.getDataFromFile = function getDataFromFile() {
    var buffer = fs.readFileSync(this.filename);
    return JSON.parse("" + buffer);
  };

  _proto.overwriteFile = function overwriteFile(newData) {
    fs.writeFileSync(this.filename, JSON.stringify(newData));
  };

  _proto.saveWithId = function saveWithId(key, saveData) {
    debug("Saving with id " + key);
    debug(saveData); // remove the item from the current array and replace it

    var previousResults = this.getDataFromFile();
    var foundIndex = previousResults.findIndex(function (element) {
      return element.id === key;
    });

    if (foundIndex >= 0) {
      debug('Found item - removing ');
      previousResults.splice(foundIndex, 1);
      debug(previousResults);
    }

    previousResults.push(saveData);
    this.overwriteFile(previousResults);
    this.savedData = previousResults;
  };

  _proto.getWithId = function getWithId(key) {
    var result = {
      id: key
    };
    debug("Loading with id " + key);
    var foundIndex = this.savedData.findIndex(function (element) {
      return element.id === key;
    });

    if (foundIndex >= 0) {
      debug('Found item');
      result = this.savedData[foundIndex];
    }

    return result;
  }
  /* add a new item to the local storage if not already there */
  ;

  _proto.addWithId = function addWithId(key, item) {
    if (item !== null) {
      debug("Adding with key " + key);
      debug(item);
      var previousResults = this.getDataFromFile();
      previousResults.push(item);
      this.overwriteFile(previousResults);
      this.savedData = previousResults;
    }
  };

  _proto.removeWithId = function removeWithId(key) {
    debug("Removing with key " + key);
    var previousResults = this.getDataFromFile();
    var foundIndex = previousResults.findIndex(function (element) {
      return element.id === key;
    });

    if (foundIndex >= 0) {
      debug('Found item - removing ');
      previousResults.splice(foundIndex, 1);
      debug(previousResults);
      this.overwriteFile(previousResults);
      this.savedData = previousResults;
    }
  };

  _proto.getItems = function getItems() {
    return this.savedData;
  };

  return JSONFileStorageUtil;
}();

module.exports = {
  JSONFileStorageUtil: JSONFileStorageUtil
};