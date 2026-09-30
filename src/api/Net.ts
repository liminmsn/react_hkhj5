import GlobalWebViewEbent from "../event/GlobalWebViewEvent";

export default class Net {
    private callback: CallbackType = () => { };
    private id = '';
    private url = '';
    private body: any = null;
    private header: any = {
        "Accept-Charset": "utf-8"
    };

    protected init(id: string, url: string, callback: CallbackType) {
        this.id = id;
        this.url = url;
        this.callback = callback;
        return this;
    }

    get() {
        this.request("GET");
    }

    post(body: any) {
        this.body = body;
        this.request("POST");
    }

    setHeader(obj: any) {
        this.body = obj;
        return this;
    }

    private requestEnd(data: { status: number, body: string }) {
        this.callback(data.status, data.body);
    }

    private request(method: HttpMethod) {
        const data = {
            url: this.url,
            body: this.body,
            headers: this.header,
            method,
        }
        if (!this.body) delete data.body;
        GlobalWebViewEbent.send({
            id: this.id,
            type: 'http',
            value: data
        }, this.requestEnd.bind(this));
    }
}