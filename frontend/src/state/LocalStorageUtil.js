import debug from 'debug';

const lsLogger = new debug('local-storage');

export default class LocalStorageUtil {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }


  saveWithStorageKey(key, saveData) {
    lsLogger(`Local Storage: Saving with key ${key}`);
    lsLogger(saveData);
    const stringifiedSaveData = JSON.stringify(saveData);
    lsLogger(stringifiedSaveData);
    this.localStorage.setItem(key, stringifiedSaveData);
  }

  getWithStorageKey(key) {
    let savedResults = [];
    lsLogger(`Local Storage: Loading with key ${key}`);
    const savedResultsJSON = this.localStorage.getItem(key);
    lsLogger(savedResultsJSON);
    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }
    return savedResults;
  }

  /* add a new item to the local storage if not already there */
  addNewItemToKeyStorage(key, item) {
    if (item !== null) {
      lsLogger(`Local Storage: Adding with key ${key}`);
      lsLogger(item);
      const previousResults = this.getWithStorageKey(key);
      previousResults.push(item);
      this.saveWithStorageKey(key, previousResults);
    }
  }

  removeItemFromKeyStorage(key, item) {
    if (item !== null) {
      lsLogger(`Local Storage: Removing with key ${key}`);
      lsLogger(item);
      const previousResults = this.getWithStorageKey(key);
      const foundIndex = previousResults.findIndex(element => element === item);
      if (foundIndex >= 0) {
        lsLogger('Local Storage: Found item - removing ');
        previousResults.splice(foundIndex, 1);
        lsLogger(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  }

  removeItemFromKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
    if (item !== null) {
      lsLogger(`Local Storage: Removing with key ${key} and comparison function`);
      lsLogger(item, 101);
      const previousResults = this.getWithStorageKey(key);
      const foundIndex = previousResults.findIndex(element => testForEqualityFunction(element, item));
      if (foundIndex >= 0) {
        lsLogger('Local Storage: Found item - removing ');
        previousResults.splice(foundIndex, 1);
        lsLogger(previousResults, 101);
        this.saveWithStorageKey(key, previousResults);
      }
    }
  }
}
