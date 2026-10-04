export default class GlobalWebViewEvent {
    private static listenerMap: Map<string, WebViewEventCallback> = new Map();
    private static started = false;

    static async start(): Promise<void> {
        if (this.started) return;
        this.started = true;

        window.__webviewReceive = (message: string) => {
            try {
                const data: WebViewEventData = typeof message === 'string' ? JSON.parse(message) : message;
                
                const callback = this.listenerMap.get(data.id);
                if (!callback) return;
                this.listenerMap.delete(data.id);
                try {
                    callback(data.value);
                } catch (e) {
                    console.error('[WebViewEvent] 回调执行异常:', e);
                }
                // this.handleMessage(data);
            } catch (e) {
                console.error('[WebViewEvent] 解析原生消息失败:', e, message);
            }
        };
    }

    // private static handleMessage(data: WebViewEventData): void {
    //     const callback = this.listenerMap.get(data.id);
    //     if (!callback) return;
    //     this.listenerMap.delete(data.id);
    //     try {
    //         callback(data.value);
    //     } catch (e) {
    //         console.error('[WebViewEvent] 回调执行异常:', e);
    //     }
    // }

    /** 统一发送入口 */
    private static postToNative(data: WebViewEventData): boolean {
        const bridge = window.webview;
        if (!bridge || typeof bridge.onJsMessage !== 'function') {
            console.warn('[WebViewEvent] 不在 Android WebView 环境中，消息未发送:', data);
            return false;
        }
        try {
            bridge.onJsMessage(JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[WebViewEvent] 调用原生桥失败:', e);
            return false;
        }
    }

    static async send(data: WebViewEventData, callback: WebViewEventCallback): Promise<void> {
        this.listenerMap.set(data.id, callback);
        const ok = this.postToNative(data);
        if (!ok) {
            this.listenerMap.delete(data.id);
        }
    }

    static async sendOnce(data: WebViewEventData): Promise<void> {
        this.postToNative(data);
    }
}