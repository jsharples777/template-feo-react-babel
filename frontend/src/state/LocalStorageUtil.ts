import debug from 'debug';

type equalityFunction = (item1:any, item2:any) => boolean;

const lsLogger = debug('local-storage');

export default class LocalStorageUtil {
  protected localStorage:any;

  constructor(localStorage:any) {
    this.localStorage = localStorage;
  }


  saveWithStorageKey(key:string, saveData:any):void {
    lsLogger(`Local Storage: Saving with key ${key}`);
    lsLogger(saveData);
    const stringifiedSaveData:string = JSON.stringify(saveData);
    lsLogger(stringifiedSaveData);
    this.localStorage.setItem(key, stringifiedSaveData);
  }

  getWithStorageKey(key:string):any[] {
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
  addNewItemToKeyStorage(key:string, item:any):void {
    if (item !== null) {
      lsLogger(`Local Storage: Adding with key ${key}`);
      lsLogger(item);
      const previousResults:any[] = this.getWithStorageKey(key);
      previousResults.push(item);
      this.saveWithStorageKey(key, previousResults);
    }
  }

  removeItemFromKeyStorage(key:string, item:any):void {
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

  removeItemFromKeyStorageWithFunctionForEquality(key:string, item:any, testForEqualityFunction:equalityFunction) {
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
