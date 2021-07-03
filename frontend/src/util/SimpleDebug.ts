class SimpleDebug {
    private static debugOn = true;
    private static debugDepth = 100;


    static log(message:string, debugDepth = 5):void {
        if (!SimpleDebug.debugOn) return;
        if (debugDepth > SimpleDebug.debugDepth) return;
        console.log(message);
    }

    static setLevel(newLevel:number):void {
        SimpleDebug.debugDepth = newLevel;
    }

    static setOn():void {
        SimpleDebug.debugOn = true;
    }

    static setOff():void {
        SimpleDebug.debugOn = false;
    }

}

export default SimpleDebug;