import { ENV } from "../env.js";

export default class WSClient {

    private websocket: WebSocket | null = new WebSocket(ENV.websocketUrl);
    private name: string = "";

    constructor(name: string) {
        this.name = name;
        this.websocket!.onopen = this.onOpen.bind(this);
        this.websocket!.onmessage = this.onMessage.bind(this);
        this.websocket!.onclose = this.onClosed.bind(this);
        this.websocket!.onerror = this.onError.bind(this);
    }

    private onOpen() {

    }

    private onMessage(event: MessageEvent) {

    }

    private onClosed() {

    }

    private onError() {
        
    }

    private send(data: any) {
        this.websocket!.send(JSON.stringify(data));
    }
}