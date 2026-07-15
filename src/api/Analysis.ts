import Net from "./Net";

export default class Analysis<T> extends Net {
    constructor(id: string, url: string, parseFun: (document: Document) => T | null, callback: (res: T | null) => void, otherParseFun?: (document: Document) => void) {
        super()
        this.init(id, url, function call(status, body) {
            console.log(`%c网络请求结束%c${status}%c${url}`, 'padding:2px;background-color:green;color:white', 'padding:2px;background-color:black;color:yellow;', '');
            if (status == 200) {
                const dom = new DOMParser().parseFromString(body, "text/html")
                callback(parseFun(dom))
                if (otherParseFun) {
                    otherParseFun(dom);
                }
                // console.log('请求成功[txt]:', body);
                // console.log('请求成功[dom]:', dom);
            }
            // Net.bridge.requestFinished.disconnect(call);
        })
    }
}