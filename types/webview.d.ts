export declare global {
    interface Window {
        webview?: {
            onJsMessage: (message: string) => void;
        };
        __webviewReceive?: (message: string) => void;
    }

    interface WebViewEventData {
        id: string;
        type: string;
        value?: any;
    }

    type WebViewEventCallback = (value: any) => void;


    type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

    type CallbackType = (status: number, body: string) => void;

    interface Bridge {
        [key: string]: () => Promise<any>;
        id: string;

        player(url: string): void;
        request(
            id: string,
            method: HttpMethod,
            url: string,
            headers: Record<string, string>,
            body: string
        ): void;
    }
}