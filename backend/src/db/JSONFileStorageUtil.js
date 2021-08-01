const debug = require('debug')('datasource:json');
const fs = require('fs');

class JSONFileStorageUtil {
  constructor() {
    this.storageDirectory = process.env.JSONDB_PATH;
    this.storageFileName = process.env.JSONDB_FILENAME;
    this.filename = `${this.storageDirectory}/${this.storageFileName}`;
    this.savedData = [];
  }

  initialise() {
    debug(`Check to see if file ${this.filename} exists`);
    fs.access(this.filename, fs.constants.F_OK, (err) => {
      if (!err) {
        debug(`${this.filename} already exists`);
        this.savedData = this.getDataFromFile();
      } else {
        debug(`${this.filename} does not exist - creating with empty array`);
        const dbFile = fs.createWriteStream(this.filename, { flags: 'w' });
        dbFile.write(JSON.stringify([]));
        dbFile.close();
      }
    });
  }

  getDataFromFile() {
    const buffer = fs.readFileSync(this.filename);
    return JSON.parse(`${buffer}`);
  }

  overwriteFile(newData) {
    fs.writeFileSync(this.filename, JSON.stringify(newData));
  }

  saveWithId(key, saveData) {
    debug(`Saving with id ${key}`);
    debug(saveData);
    // remove the item from the current array and replace it
    const previousResults = this.getDataFromFile();
    const foundIndex = previousResults.findIndex(element => element.id === key);
    if (foundIndex >= 0) {
      debug('Found item - removing ');
      previousResults.splice(foundIndex, 1);
      debug(previousResults);
    }
    previousResults.push(saveData);
    this.overwriteFile(previousResults);
    this.savedData = previousResults;
  }

  getWithId(key) {
    let result = {
      id: key,
    };
    debug(`Loading with id ${key}`);
    const foundIndex = this.savedData.findIndex(element => element.id === key);
    if (foundIndex >= 0) {
      debug('Found item');
      result = this.savedData[foundIndex];
    }
    return result;
  }

  /* add a new item to the local storage if not already there */
  addWithId(key, item) {
    if (item !== null) {
      debug(`Adding with key ${key}`);
      debug(item);
      const previousResults = this.getDataFromFile();
      previousResults.push(item);
      this.overwriteFile(previousResults);
      this.savedData = previousResults;
    }
  }

  removeWithId(key) {
    debug(`Removing with key ${key}`);
    const previousResults = this.getDataFromFile();
    const foundIndex = previousResults.findIndex(element => element.id === key);
    if (foundIndex >= 0) {
      debug('Found item - removing ');
      previousResults.splice(foundIndex, 1);
      debug(previousResults);
      this.overwriteFile(previousResults);
      this.savedData = previousResults;
    }
  }

  getItems() {
    return this.savedData;
  }
}

module.exports = { JSONFileStorageUtil };
