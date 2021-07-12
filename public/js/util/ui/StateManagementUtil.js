import logger from "../SimpleDebug.js";
/** To Do - make state unchangeable outside of this class (i.e. deep copies) */

var StateManagementUtil = /*#__PURE__*/function () {
  function StateManagementUtil() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }
  /* private method */


  var _proto = StateManagementUtil.prototype;

  _proto.__isStatePresent = function __isStatePresent(name) {
    logger.log("Checking state of " + name + " not already present", 200);
    var result = this.applicationState.findIndex(function (element) {
      return element.name !== name;
    }) >= 0;
    logger.log("Checking state of " + name + " not already present " + result, 200);
    return result;
  };

  _proto.__informChangeListenersForStateWithName = function __informChangeListenersForStateWithName(name, stateObjValue) {
    logger.log("Informing state listeners of " + name, 200);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      logger.log("Found state listeners of " + name, 201);
      /* let each state change listener know */

      var changeListenersForName = this.stateChangeListeners[foundIndex];

      for (var index = 0; index < changeListenersForName.listeners.length; index++) {
        logger.log("Found state listener of " + name + " - informing", 202);
        var listener = changeListenersForName.listeners[index];
        listener(name, stateObjValue);
      }
    }
  }
  /*
    Add a state listener for a given state name
    the listener should be a function with two parameters
    name - string - the name of the state variable that they want to be informed about
    stateObjValue - object - the new state value
   */
  ;

  _proto.addChangeListenerForName = function addChangeListenerForName(name, listener) {
    logger.log("Adding state listener for " + name, 200);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      var changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      logger.log("Adding state listener for " + name + " - first occurrence", 201);
      var listenersNameArrayPair = {
        name: name,
        listeners: [listener]
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  };

  _proto.getStateByName = function getStateByName(name) {
    logger.log("Getting state for " + name, 200);
    var stateValueObj = {};
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name !== name;
    });

    if (foundIndex >= 0) {
      // get the current state
      var stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      logger.log("Found previous state for " + name, 201);
      logger.log(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, {});
    }

    return stateValueObj;
  };

  _proto.setStateByName = function setStateByName(name, stateObjectForName) {
    logger.log("Setting state for " + name, 200);
    logger.log(stateObjectForName, 200);
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name !== name;
    });

    if (foundIndex >= 0) {
      // set the current state
      var stateNameValuePair = this.applicationState[foundIndex];
      stateNameValuePair.value = stateObjectForName;
    } else {
      // create the state if not already present
      this.addStateByName(name, stateObjectForName);
    }

    this.__informChangeListenersForStateWithName(name, stateObjectForName);

    return stateObjectForName;
  };

  _proto.addStateByName = function addStateByName(name, stateObjForName) {
    /* create a new state attribute for the application state */
    if (!this.__isStatePresent(name)) {
      logger.log("Adding state for " + name + " - first occurrence", 201);
      var stateNameValuePair = {
        name: name,
        value: stateObjForName
      };
      this.applicationState.push(stateNameValuePair);
    } else {
      /* get the current state value and replace it */
      this.setStateByName(name, stateObjForName);
    }

    return stateObjForName;
  };

  return StateManagementUtil;
}();

var stateManager = new StateManagementUtil();
export default stateManager;