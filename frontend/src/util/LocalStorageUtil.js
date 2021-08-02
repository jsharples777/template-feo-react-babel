import logger from './SimpleDebug.js';

export default class LocalStorageUtil {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }


  saveWithStorageKey(key, saveData) {
    logger.log(`Local Storage: Saving with key ${key}`, 100);
    logger.log(saveData, 100);
    const stringifiedSaveData = JSON.stringify(saveData);
    logger.log(stringifiedSaveData, 101);
    this.localStorage.setItem(key, stringifiedSaveData);
  }

  getWithStorageKey(key) {
    let savedResults = [];
    logger.log(`Local Storage: Loading with key ${key}`, 100);
    const savedResultsJSON = this.localStorage.getItem(key);
    logger.log(savedResultsJSON, 101);
    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }
    return savedResults;
  }

  /* add a new item to the local storage if not already there */
  addNewItemToKeyStorage(key, item) {
    if (item !== null) {
      logger.log(`Local Storage: Adding with key ${key}`, 100);
      logger.log(item, 101);
      const previousResults = this.getWithStorageKey(key);
      previousResults.push(item);
      this.saveWithStorageKey(key, previousResults);
    }
  }

  removeItemFromKeyStorage(key, item) {
    if (item !== null) {
      logger.log(`Local Storage: Removing with key ${key}`, 100);
      logger.log(item, 101);
      const previousResults = this.getWithStorageKey(key);
      const foundIndex = previousResults.findIndex(element => element === item);
      if (foundIndex >= 0) {
        logger.log('Local Storage: Found item - removing ', 100);
        previousResults.splice(foundIndex, 1);
        logger.log(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  }

  removeItemFromKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
    if (item !== null) {
      logger.log(`Local Storage: Removing with key ${key} and comparison function`, 100);
      logger.log(item, 101);
      const previousResults = this.getWithStorageKey(key);
      const foundIndex = previousResults.findIndex(element => testForEqualityFunction(element, item));
      if (foundIndex >= 0) {
        logger.log('Local Storage: Found item - removing ', 100);
        previousResults.splice(foundIndex, 1);
        logger.log(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  }
}
