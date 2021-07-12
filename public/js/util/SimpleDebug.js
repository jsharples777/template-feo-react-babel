class SimpleDebug {
    constructor() {
        this.debugOn = true;
        this.debugDepth = 100;
        this.minDebugDepth = 0;
    }

    log(message, debugDepth = 0) {
        if (!this.debugOn) return;
        if (debugDepth > this.debugDepth) return;
        if (debugDepth < this.minDebugDepth) return;
        console.log(message);
    }

    setLevel(newLevel) {
        this.debugDepth = newLevel;
    }

    level() {
        return this.debugDepth;
    }

    minlevel() {
        return this.minDebugDepth;
    }

    setMinLevel(newLevel) {
        this.minDebugDepth = newLevel;
    }

    setOn() {
        this.debugOn = true;
    }

    setOff() {
        this.debugOn = false;
    }

    isOn() {
        return this.debugOn;
    }

}

let logger = new SimpleDebug();
export default logger;