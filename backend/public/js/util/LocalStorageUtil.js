import logger from './SimpleDebug.js';

var LocalStorageUtil = /*#__PURE__*/function () {
  function LocalStorageUtil(localStorage) {
    this.localStorage = localStorage;
  }

  var _proto = LocalStorageUtil.prototype;

  _proto.saveWithStorageKey = function saveWithStorageKey(key, saveData) {
    logger.log("Local Storage: Saving with key " + key, 100);
    logger.log(saveData, 100);
    var stringifiedSaveData = JSON.stringify(saveData);
    logger.log(stringifiedSaveData, 101);
    this.localStorage.setItem(key, stringifiedSaveData);
  };

  _proto.getWithStorageKey = function getWithStorageKey(key) {
    var savedResults = [];
    logger.log("Local Storage: Loading with key " + key, 100);
    var savedResultsJSON = this.localStorage.getItem(key);
    logger.log(savedResultsJSON, 101);

    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }

    return savedResults;
  }
  /* add a new item to the local storage if not already there */
  ;

  _proto.addNewItemToKeyStorage = function addNewItemToKeyStorage(key, item) {
    if (item !== null) {
      logger.log("Local Storage: Adding with key " + key, 100);
      logger.log(item, 101);
      var previousResults = this.getWithStorageKey(key);
      previousResults.push(item);
      this.saveWithStorageKey(key, previousResults);
    }
  };

  _proto.removeItemFromKeyStorage = function removeItemFromKeyStorage(key, item) {
    if (item !== null) {
      logger.log("Local Storage: Removing with key " + key, 100);
      logger.log(item, 101);
      var previousResults = this.getWithStorageKey(key);
      var foundIndex = previousResults.findIndex(function (element) {
        return element === item;
      });

      if (foundIndex >= 0) {
        logger.log('Local Storage: Found item - removing ', 100);
        previousResults.splice(foundIndex, 1);
        logger.log(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  };

  _proto.removeItemFromKeyStorageWithFunctionForEquality = function removeItemFromKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
    if (item !== null) {
      logger.log("Local Storage: Removing with key " + key + " and comparison function", 100);
      logger.log(item, 101);
      var previousResults = this.getWithStorageKey(key);
      var foundIndex = previousResults.findIndex(function (element) {
        return testForEqualityFunction(element, item);
      });

      if (foundIndex >= 0) {
        logger.log('Local Storage: Found item - removing ', 100);
        previousResults.splice(foundIndex, 1);
        logger.log(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  };

  return LocalStorageUtil;
}();

export { LocalStorageUtil as default };