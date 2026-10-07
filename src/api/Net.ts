import GlobalWebViewEbent from "../event/GlobalWebViewEvent";

export default class Net {
    private callback: CallbackType = () => {};
    private id = "";
    private url = "";
    private body: string | null = null;

    private header: Record<string, string> = {
        "Accept-Charset": "utf-8",
    };

    protected init(
        id: string,
        url: string,
        callback: CallbackType
    ) {
        this.id = id;
        this.url = url;
        this.callback = callback;
        return this;
    }

    get() {
        this.request("GET");
    }

    post(body: any) {
        this.body = this.encodeBody(body);
        this.request("POST");
    }

    setHeader(data: Record<string, string>) {
        Object.assign(this.header, data);
        return this;
    }

    private encodeBody(body: any): string | null {
        if (body == null) {
            return null;
        }

        const contentType =
            Object.entries(this.header)
                .find(([key]) => key.toLowerCase() === "content-type")
                ?.[1]
                ?.toLowerCase();

        // application/x-www-form-urlencoded
        if (contentType?.includes("application/x-www-form-urlencoded")) {

            const params = new URLSearchParams();

            for (const [key, value] of Object.entries(body)) {
                params.append(key, String(value));
            }

            return params.toString();
        }

        // 默认 JSON
        return JSON.stringify(body);
    }

    private requestEnd(data: {
        status: number;
        body: string;
    }) {
        this.callback(data.status, data.body);
    }

    private request(method: HttpMethod) {

        const data: {
            url: string;
            body?: string;
            headers: Record<string, string>;
            method: HttpMethod;
        } = {
            url: this.url,
            headers: this.header,
            method,
        };

        if (this.body != null && this.body !== "") {
            data.body = this.body;
        }

        GlobalWebViewEbent.send(
            {
                id: this.id,
                type: "http",
                value: data,
            },
            this.requestEnd.bind(this)
        );
    }
}