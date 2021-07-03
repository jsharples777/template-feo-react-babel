declare class SimpleDebug {
    private static debugOn;
    private static debugDepth;
    static log(message: string, debugDepth?: number): void;
    static setLevel(newLevel: number): void;
    static setOn(): void;
    static setOff(): void;
}
export default SimpleDebug;
