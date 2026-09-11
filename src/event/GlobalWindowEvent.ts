type CallBack = (data: any) => void;
export class GlobalWindowEvent {
    static events = new Map<string, CallBack>();
    static on(key: string, callback: CallBack) {
        this.events.set(key, callback);
    }
    static emit(key: string, data?: any) {
        const callback = this.events.get(key);
        if (callback) callback(data);
    }
}