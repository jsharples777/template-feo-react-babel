import logger from './SimpleDebug.js';

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
class StateManagementUtil {
  constructor() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }

  /* private method */ __isStatePresent(name) {
    const result = (this.applicationState.findIndex(element => element.name === name) >= 0);
    logger.log(`State Manager: Checking state of ${name} is present = ${result}`, 200);
    return result;
  }

  __informChangeListenersForStateWithName(name, stateObjValue) {
    logger.log(`State Manager: Informing state listeners of ${name}`, 200);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      logger.log(`State Manager: Found state listeners of ${name}`, 201);
      /* let each state change listener know */
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      for (let index = 0; index < changeListenersForName.listeners.length; index++) {
        logger.log(`State Manager: Found state listener of ${name} - informing`, 202);
        const listener = changeListenersForName.listeners[index];
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
  addChangeListenerForName(name, listener) {
    logger.log(`State Manager: Adding state listener for ${name}`, 200);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      logger.log(`State Manager: Adding state listener for ${name} - first occurrence`, 201);
      const listenersNameArrayPair = {
        name,
        listeners: [listener],
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  }

  getStateByName(name) {
    logger.log(`State Manager: Getting state for ${name}`, 200);
    let stateValueObj = {};
    const foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      // get the current state
      const stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      logger.log(`State Manager: Found previous state for ${name}`, 201);
      logger.log(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, []);
    }
    return stateValueObj;
  }

  setStateByName(name, stateObjectForName) {
    logger.log(`State Manager: Setting state for ${name}`, 200);
    logger.log(stateObjectForName, 200);
    const foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      // set the current state
      const stateNameValuePair = this.applicationState[foundIndex];
      stateNameValuePair.value = stateObjectForName;
    } else {
      // create the state if not already present
      this.addStateByName(name, stateObjectForName);
    }
    this.__informChangeListenersForStateWithName(name, stateObjectForName);
    return stateObjectForName;
  }

  addStateByName(name, stateObjForName) {
    /* create a new state attribute for the application state */
    if (!this.__isStatePresent(name)) {
      logger.log(`State Manager: Adding state for ${name} - first occurrence`, 201);
      logger.log(stateObjForName, 201);
      const stateNameValuePair = {
        name,
        value: stateObjForName,
      };
      this.applicationState.push(stateNameValuePair);
    } else {
      /* get the current state value and replace it */
      this.setStateByName(name, stateObjForName);
    }
    return stateObjForName;
  }

  addNewItemToState(name, item) { // assumes state is an array
    logger.log(`State Manager: Adding item to state ${name}`, 201);
    const state = this.getStateByName(name);
    state.push(item);
    logger.log(state);
    this.__informChangeListenersForStateWithName(name, state);
  }

  findItemInState(name, item, testForEqualityFunction) { // assumes state is an array
    let result = {};
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex(element => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = state[foundIndex];
    }
    return result;
  }

  isItemInState(name, item, testForEqualityFunction) { // assumes state is an array
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex(element => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
    }
    return result;
  }

  removeItemFromState(name, item, testForEqualityFunction) {
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex(element => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
      // remove the item from the state
      logger.log('State Manager: Found item - removing ', 100);
      state.splice(foundIndex, 1);
      logger.log(state, 101);
      this.setStateByName(name, state);
    }
    return result;
  }

  updateItemInState(name, item, testForEqualityFunction) {
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex(element => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
      // remove the item from the state
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
  }
}

const stateManager = new StateManagementUtil();
export default stateManager;
