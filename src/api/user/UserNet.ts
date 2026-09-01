export const Api = {
    login: "/api/auth/login",
    register: "/api/auth/register",
    sendCaptcha: "/api/auth/send-captcha",
    forgotPassword: "/api/auth/forgot-password",
    priceList: "/api/price/list",
    initPay: "/api/spay/init_pay",
    energyRanking: "/api/energy/ranking",
    flowingWater: "/api/energy/flowing-water",
    flowingWaterChat: "/api/energy/flowing-water-chat",
}

const baseUrl: string = "/api";
export default class {
    private url: string;
    private body: NetUser.BodyType;
    private method: "GET" | "POST" = "GET";
    private header = {
        "Content-Type": "application/json"
    } as any;

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
    CarryToken() {
        const info = localStorage.getItem('info');
        if (info) {
            const d = JSON.parse(info) as NetUser.Response.ModelUser.Login;
            this.header["Authorization"] = d.token;
        } else {
            alert("请先登录!");
        }
        return this;
    }
    setHeader(header: any) {
        this.header = header;
        return this;
    }
    setBody(body: NetUser.BodyType) {
        this.body = body;
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
