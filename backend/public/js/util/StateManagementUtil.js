import logger from './SimpleDebug.js';
/** To Do - make state unchangeable outside of this class (i.e. deep copies) */

var StateManagementUtil = /*#__PURE__*/function () {
  function StateManagementUtil() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }
  /* private method */


  var _proto = StateManagementUtil.prototype;

  _proto.__isStatePresent = function __isStatePresent(name) {
    var result = this.applicationState.findIndex(function (element) {
      return element.name === name;
    }) >= 0;
    logger.log("State Manager: Checking state of " + name + " is present = " + result, 200);
    return result;
  };

  _proto.__informChangeListenersForStateWithName = function __informChangeListenersForStateWithName(name, stateObjValue) {
    logger.log("State Manager: Informing state listeners of " + name, 200);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      logger.log("State Manager: Found state listeners of " + name, 201);
      /* let each state change listener know */

      var changeListenersForName = this.stateChangeListeners[foundIndex];

      for (var index = 0; index < changeListenersForName.listeners.length; index++) {
        logger.log("State Manager: Found state listener of " + name + " - informing", 202);
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
    logger.log("State Manager: Adding state listener for " + name, 200);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      var changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      logger.log("State Manager: Adding state listener for " + name + " - first occurrence", 201);
      var listenersNameArrayPair = {
        name: name,
        listeners: [listener]
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  };

  _proto.getStateByName = function getStateByName(name) {
    logger.log("State Manager: Getting state for " + name, 200);
    var stateValueObj = {};
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      // get the current state
      var stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      logger.log("State Manager: Found previous state for " + name, 201);
      logger.log(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, []);
    }

    return stateValueObj;
  };

  _proto.setStateByName = function setStateByName(name, stateObjectForName) {
    logger.log("State Manager: Setting state for " + name, 200);
    logger.log(stateObjectForName, 200);
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
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
      logger.log("State Manager: Adding state for " + name + " - first occurrence", 201);
      logger.log(stateObjForName, 201);
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

  _proto.addNewItemToState = function addNewItemToState(name, item) {
    // assumes state is an array
    logger.log("State Manager: Adding item to state " + name, 201);
    var state = this.getStateByName(name);
    state.push(item);
    logger.log(state);

    this.__informChangeListenersForStateWithName(name, state);
  };

  _proto.findItemInState = function findItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    var result = {};
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = state[foundIndex];
    }

    return result;
  };

  _proto.isItemInState = function isItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true;
    }

    return result;
  };

  _proto.removeItemFromState = function removeItemFromState(name, item, testForEqualityFunction) {
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true; // remove the item from the state

      logger.log('State Manager: Found item - removing ', 100);
      state.splice(foundIndex, 1);
      logger.log(state, 101);
      this.setStateByName(name, state);
    }

    return result;
  };

  _proto.updateItemInState = function updateItemInState(name, item, testForEqualityFunction) {
    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true; // remove the item from the state

      logger.log('State Manager: Found item - replacing ', 100);
      state.splice(foundIndex, 1);
      state.push(item);
      logger.log(state, 101);
      this.setStateByName(name, state);
    } else {
      // add the item to the state
      this.addNewItemToState(name, item);
    }

    return result;
  };

  return StateManagementUtil;
}();

var stateManager = new StateManagementUtil();
export default stateManager;