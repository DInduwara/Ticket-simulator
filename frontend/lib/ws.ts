import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { LogEvent, TicketStatus } from "@/types/events";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

type Handlers = {
  onStatus: (s: TicketStatus) => void;
  onLog: (l: LogEvent) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
};

export function connectRealtime(handlers: Handlers) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000, // Auto-reconnect after 5s
    debug: () => {}, // Quiet mode
  });

  client.onConnect = () => {
    handlers.onConnected?.();

    client.subscribe("/topic/status", (msg: IMessage) => {
      try {
        const data = JSON.parse(msg.body);
        handlers.onStatus(data);
      } catch (e) { console.error(e); }
    });

    client.subscribe("/topic/logs", (msg: IMessage) => {
      try {
        const data = JSON.parse(msg.body);
        handlers.onLog(data);
      } catch (e) { console.error(e); }
    });
  };

  client.onWebSocketClose = () => handlers.onDisconnected?.();
  
  client.activate();
  return () => client.deactivate();
}