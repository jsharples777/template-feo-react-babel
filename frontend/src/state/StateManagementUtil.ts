import debug from 'debug';

const smLogger = debug('state-manager');

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
class StateManagementUtil {
  constructor() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }

  /* private method */ __isStatePresent(name) {
    const result = (this.applicationState.findIndex(element => element.name === name) >= 0);
    smLogger(`State Manager: Checking state of ${name} is present = ${result}`);
    return result;
  }

  __informChangeListenersForStateWithName(name, stateObjValue) {
    smLogger(`State Manager: Informing state listeners of ${name}`);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      smLogger(`State Manager: Found state listeners of ${name}`);
      /* let each state change listener know */
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      for (let index = 0; index < changeListenersForName.listeners.length; index++) {
        smLogger(`State Manager: Found state listener of ${name} - informing`);
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
    smLogger(`State Manager: Adding state listener for ${name}`);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      smLogger(`State Manager: Adding state listener for ${name} - first occurrence`);
      const listenersNameArrayPair = {
        name,
        listeners: [listener],
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  }

  getStateByName(name) {
    smLogger(`State Manager: Getting state for ${name}`);
    let stateValueObj = {};
    const foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      // get the current state
      const stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      smLogger(`State Manager: Found previous state for ${name}`);
      smLogger(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, []);
    }
    return stateValueObj;
  }

  setStateByName(name, stateObjectForName) {
    smLogger(`State Manager: Setting state for ${name}`);
    smLogger(stateObjectForName);
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
      smLogger(`State Manager: Adding state for ${name} - first occurrence`);
      smLogger(stateObjForName, 201);
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
    smLogger(`State Manager: Adding item to state ${name}`);
    const state = this.getStateByName(name);
    state.push(item);
    smLogger(state);
    this.__informChangeListenersForStateWithName(name, state);
  }

  findItemInState(name, item, testForEqualityFunction) { // assumes state is an array
    let result = {};
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex(element => testForEqualityFunction(element, item));
    smLogger(`Finding item in state ${name} - found index ${foundIndex}`);
    smLogger(item);
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
      smLogger('State Manager: Found item - removing ');
      state.splice(foundIndex, 1);
      smLogger(state);
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
      smLogger('State Manager: Found item - replacing ');
      state.splice(foundIndex, 1, item);
      //state.push(item);
      smLogger(state);
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
