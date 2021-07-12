import logger from "./SimpleDebug.js";

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
class StateManagementUtil {
    constructor() {
        this.applicationState = [];
        this.stateChangeListeners = [];
    }

    /* private method */ __isStatePresent(name) {
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Checking state of ${name} not already present`);
        let result = (this.applicationState.findIndex((element) => element.name === name) >= 0);
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Checking state of ${name} is already present ${result}`,200);
        return result;
    }

    __informChangeListenersForStateWithName(name,stateObjValue) {
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Informing state listeners of ${name}`);
        let foundIndex = this.stateChangeListeners.findIndex((element) => element.name === name);
        if (foundIndex >= 0) {
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Found state listeners of ${name}`);
            /* let each state change listener know */
            let changeListenersForName = this.stateChangeListeners[foundIndex];
            for (let index = 0;index < changeListenersForName.listeners.length;index++) {
                if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Found state listener of ${name} - informing`);
                let listener = changeListenersForName.listeners[index];
                listener(name,stateObjValue);
            }
        }
    }


    /*
      Add a state listener for a given state name
      the listener should be a function with two parameters
      name - string - the name of the state variable that they want to be informed about
      stateObjValue - object - the new state value
     */
    addChangeListenerForName(name,listener) {
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Adding state listener for ${name}`);
        let foundIndex = this.stateChangeListeners.findIndex((element) => element.name === name);
        if (foundIndex >= 0) {
            let changeListenersForName = this.stateChangeListeners[foundIndex];
            changeListenersForName.listeners.push(listener);
        }
        else {
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Adding state listener for ${name} - first occurrence`);
            let listenersNameArrayPair = {
                name: name,
                listeners: [listener]
            }
            this.stateChangeListeners.push(listenersNameArrayPair);
        }

    }

    getStateByName(name) {
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Getting state for ${name}`);
        let stateValueObj = {};
        let foundIndex = this.applicationState.findIndex((element) => element.name == name);
        if (foundIndex >= 0) {
            // get the current state
            let stateNameValuePair = this.applicationState[foundIndex];
            stateValueObj = stateNameValuePair.value;
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Found previous state for ${name}`);
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(stateValueObj);
        }
        else {
            // create the state if not already present
            stateValueObj = this.addStateByName(name,{});
        }
        return stateValueObj;
    }

    setStateByName(name, stateObjectForName) {
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Setting state for ${name}`);
        if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(stateObjectForName);
        let foundIndex = this.applicationState.findIndex((element) => element.name == name);
        if (foundIndex >= 0) {
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Setting state for ${name} into current value of state manager`);
            // set the current state
            let stateNameValuePair = this.applicationState[foundIndex];
            stateNameValuePair.value = stateObjectForName;
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(this.applicationState[foundIndex]);
        }
        else {
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`State ${name} doesn't exist yet, adding`);
            // create the state if not already present
            this.addStateByName(name,stateObjectForName);
        }
        this.__informChangeListenersForStateWithName(name,stateObjectForName);
        return stateObjectForName;
    }

    addStateByName(name, stateObjForName) {
        /* create a new state attribute for the application state */
        if (!this.__isStatePresent(name)) {
            if (logger.isOn() && (600 <= logger.level()) && (600 >= logger.minlevel())) console.log(`Adding state for ${name} - first occurrence`);
            let stateNameValuePair = {
                name: name,
                value: stateObjForName
            }
            this.applicationState.push(stateNameValuePair);
        }
        else {
            /* get the current state value and replace it */
            this.setStateByName(name, stateObjForName);
        }
        return stateObjForName;
    }
}

let stateManager = new StateManagementUtil();
export default stateManager;