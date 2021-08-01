const { JSONFileStorageUtil } = require('./JSONFileStorageUtil');
const uuid = require('../util/UUID');
const debug = require('debug')('datasource');

class DataSource {
  constructor() {
    debug('Setting up datasource(s)');
    this.jsonDS = new JSONFileStorageUtil();
    this.jsonDS.initialise();
  }

  addNewItem(dataObj) {
    debug('Adding new item');
    debug(dataObj);
    dataObj.id = uuid.getUniqueId();
    this.jsonDS.addWithId(dataObj.id, dataObj);
    return dataObj;
  }

  updateItem(dataObj) {
    debug('Updating item');
    debug(dataObj);
    if (dataObj.id) {
      this.jsonDS.saveWithId(dataObj.id, dataObj);
    } else {
      dataObj = this.addNewItem(dataObj);
    }
    return dataObj;
  }

  deleteItem(id) {
    debug(`Updating item ${id}`);
    if (id) {
      this.jsonDS.removeWithId(id);
    }
  }

  getItemById(id) {
    debug(`Getting item ${id}`);
    let result = {};
    if (id) {
      result = this.jsonDS.getWithId(id);
    }
    debug(result);
    return result;
  }

  getItems() {
    debug('Getting items');
    const items = this.jsonDS.getItems();
    debug(items);
    return items;
  }
}

const ds = new DataSource();

module.exports = ds;
