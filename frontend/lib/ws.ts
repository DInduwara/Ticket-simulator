"use client";

import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LogEvent, TicketStatus } from "@/types/events";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

type Handlers = {
    onStatus: (s: TicketStatus) => void;
    onLog: (l: LogEvent) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
};

export function connectRealtime(handlers: Handlers) {
    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        reconnectDelay: 2000,
        debug: () => {}, // keep quiet
    });

    client.onConnect = () => {
        handlers.onConnected?.();

        client.subscribe("/topic/status", (msg: IMessage) => {
            try {
                handlers.onStatus(JSON.parse(msg.body));
            } catch {}
        });

        client.subscribe("/topic/logs", (msg: IMessage) => {
            try {
                handlers.onLog(JSON.parse(msg.body));
            } catch {}
        });
    };

    client.onWebSocketClose = () => handlers.onDisconnected?.();

    client.activate();

    return () => client.deactivate();
}
