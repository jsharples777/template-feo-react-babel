var _require = require('./JSONFileStorageUtil'),
    JSONFileStorageUtil = _require.JSONFileStorageUtil;

var uuid = require('../util/UUID');

var debug = require('debug')('datasource');

var DataSource = /*#__PURE__*/function () {
  function DataSource() {
    debug('Setting up datasource(s)');
    this.jsonDS = new JSONFileStorageUtil();
    this.jsonDS.initialise();
  }

  var _proto = DataSource.prototype;

  _proto.addNewItem = function addNewItem(dataObj) {
    debug('Adding new item');
    debug(dataObj);
    dataObj.id = uuid.getUniqueId();
    this.jsonDS.addWithId(dataObj.id, dataObj);
    return dataObj;
  };

  _proto.updateItem = function updateItem(dataObj) {
    debug('Updating item');
    debug(dataObj);

    if (dataObj.id) {
      this.jsonDS.saveWithId(dataObj.id, dataObj);
    } else {
      dataObj = this.addNewItem(dataObj);
    }

    return dataObj;
  };

  _proto.deleteItem = function deleteItem(id) {
    debug("Updating item " + id);

    if (id) {
      this.jsonDS.removeWithId(id);
    }
  };

  _proto.getItemById = function getItemById(id) {
    debug("Getting item " + id);
    var result = {};

    if (id) {
      result = this.jsonDS.getWithId(id);
    }

    debug(result);
    return result;
  };

  _proto.getItems = function getItems() {
    debug('Getting items');
    var items = this.jsonDS.getItems();
    debug(items);
    return items;
  };

  return DataSource;
}();

var ds = new DataSource();
module.exports = ds;