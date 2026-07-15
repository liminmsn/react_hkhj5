import GlobalWebViewEbent from "../event/GlobalWebViewEbent";

export default class Net {
    private callback: CallbackType = () => { };
    private id = '';
    private url = '';
    private body: any = null;
    private header: any = {
        "Content-Type": "application/json; charset=utf-8",
        "Accept": "application/json"
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

    private requestEnd(data: { status: number, body: string }) {
        this.callback(data.status, data.body);
    }

    private request(method: HttpMethod) {
        GlobalWebViewEbent.send({
            id: this.id,
            data: {
                type: 'cpr',
                query: {
                    url: this.url,
                    head: this.header,
                    body: this.body,
                    method,
                }
            }
        }, this.requestEnd.bind(this));
    }
}