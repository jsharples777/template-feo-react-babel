var UUID = /*#__PURE__*/function () {
  function UUID() {}

  var _proto = UUID.prototype;

  _proto.getUniqueId = function getUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  return UUID;
}();

var uuid = new UUID();
export default uuid;