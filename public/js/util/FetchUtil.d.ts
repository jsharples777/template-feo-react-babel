declare class FetchUtil {
    static fetchQLJSON(url: string, parameters: any, callback: (jsonData: any, httpStatus: number) => void): void;
}
export default FetchUtil;
