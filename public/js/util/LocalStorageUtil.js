import logger from "./SimpleDebug.js";

export default class LocalStorageUtil {

    constructor(localStorage) {
        this.localStorage = localStorage;
    }


    saveWithStorageKey(key, saveData) {
        if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Saving with key " + key);
        if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log(saveData);
        let stringifiedSaveData = JSON.stringify(saveData);
        if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(stringifiedSaveData);
        this.localStorage.setItem(key, stringifiedSaveData);
    }

    getWithStorageKey(key) {
        let savedResults = [];
        if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Loading with key " + key);
        let savedResultsJSON = this.localStorage.getItem(key);
        if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(savedResultsJSON);
        if (savedResultsJSON !== null) {
            savedResults = JSON.parse(savedResultsJSON);
        }
        return savedResults;
    }

    /* add a new item to the local storage if not already there */
    addNewItemToKeyStorage(key, item) {
        if (item !== null) {
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Adding with key " + key);
            if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(item);
            let previousResults = this.getWithStorageKey(key);
            previousResults.push(item);
            this.saveWithStorageKey(key, previousResults);
        }
    }

    removeItemFromKeyStorage(key, item) {
        if (item !== null) {
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Removing with key " + key);
            if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(item);
            let previousResults = this.getWithStorageKey(key);
            let foundIndex = previousResults.findIndex((element) => element === item);
            if (foundIndex >= 0) {
                if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Found item - removing ");
                previousResults.splice(foundIndex, 1);
                if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(previousResults);
                this.saveWithStorageKey(key, previousResults);
            }
        }
    }

    removeAllItemsFromKeyStorage(key) {
        if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Removing ALL with key " + key);
        this.localStorage.removeItem(key);
        return [];
    }

    removeItemFromKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
        if (item !== null) {
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Removing with key " + key + " and comparison function");
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log(item);
            try {
                let previousResults = this.getWithStorageKey(key);
                let foundIndex = previousResults.findIndex((element) => {
                    return testForEqualityFunction(element, item)
                });
                if (foundIndex >= 0) {
                    if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Found item - removing ");
                    previousResults.splice(foundIndex, 1);
                    if (logger.isOn() && (520 <= logger.level()) && (520 >= logger.minlevel())) console.log(previousResults);
                    this.saveWithStorageKey(key, previousResults);
                }
            } catch (e) {
                if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Error with removing item - clearing local storage key " + key);
                this.localStorage.removeItem(key);
            }
        }

    }

    isItemInKeyStorageWithFunctionForEquality(key, item, testForEqualityFunction) {
        let result = false;
        if (item !== null) {
            if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Is item in local key storage " + key);
            if (logger.isOn() && (510 <= logger.level()) && (510 >= logger.minlevel())) console.log(item);
            let previousResults = this.getWithStorageKey(key);
            try {
                let foundIndex = previousResults.findIndex((element) => {
                    return testForEqualityFunction(element, item)
                });
                if (foundIndex >= 0) {
                    result = true;
                }
            } catch (e) {
                if (logger.isOn() && (500 <= logger.level()) && (500 >= logger.minlevel())) console.log("Error with checking for item  - clearing local storage key " + key);
                this.localStorage.removeItem(key);
            }
        }
        return result;
    }
}
