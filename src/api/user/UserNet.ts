export const Api = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    sendCaptcha: "/api/auth/send-captcha",
}

const baseUrl: string = "/api";
export default class {
    private url: string;
    private body: NetUser.BodyType;
    private method: "GET" | "POST" = "GET";
    private header = {
        "Content-Type": "application/json"
    };

    constructor(url: string) {
        this.url = (baseUrl + url) || "";
    }

    private async send(callFun: (res: Blob) => void) {
        const res = await fetch(this.url, {
            headers: this.header,
            method: this.method,
            body: this.body
        }).then(async (onf) => onf.blob());
        callFun(res);
    }

    setHeader(header: any) {
        this.header = header;
        return this;
    }

    get() {
        return this.send.bind(this);
    }

    post(body?: NetUser.BodyType) {
        this.method = "POST";
        this.body = body;
        return this.send.bind(this);
    }

    static utils = {
        async toJson(data: Blob) {
            const text = await data.text();
            return JSON.parse(text);
        }
    }
}
