"use client";

import { useEffect, useMemo, useState } from "react";
import { connectRealtime } from "@/lib/ws";
import { LogEvent, TicketStatus } from "@/types/events";
import { StatGrid } from "./StatGrid";
import { LogsPanel } from "./LogsPanel";
import { Badge } from "./Badge";
import { api } from "@/lib/api";

export function Dashboard() {
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState<TicketStatus | null>(null);
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [simState, setSimState] = useState<string>("UNKNOWN");

    useEffect(() => {
        api.simStatus().then(setSimState).catch(() => setSimState("UNKNOWN"));
    }, []);

    useEffect(() => {
        const disconnect = connectRealtime({
            onConnected: () => setConnected(true),
            onDisconnected: () => setConnected(false),
            onStatus: (s) => setStatus(s),
            onLog: (l) => {
                setLogs((prev) => [l, ...prev].slice(0, 200)); // keep last 200
            },
        });
        return () => disconnect();
    }, []);

    const ui = useMemo(() => {
        const available = status?.available ?? 0;
        const released = status?.totalReleased ?? 0;
        const sold = status?.totalSold ?? 0;
        const maxCapacity = status?.maxCapacity ?? 0;
        const totalLimit = status?.totalLimit ?? 0;
        return { available, released, sold, maxCapacity, totalLimit };
    }, [status]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <div className="text-xl font-semibold text-zinc-900">Real-Time Dashboard</div>
                    <div className="text-sm text-zinc-500">
                        WebSocket: {connected ? <span className="text-green-600">Connected</span> : <span className="text-red-600">Disconnected</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge text={`Sim: ${simState}`} />
                    {status?.at && <Badge text={`Updated: ${new Date(status.at).toLocaleTimeString()}`} />}
                </div>
            </div>

            <StatGrid
                available={ui.available}
                released={ui.released}
                sold={ui.sold}
                maxCapacity={ui.maxCapacity}
                totalLimit={ui.totalLimit}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <LogsPanel logs={logs} />
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="text-sm font-semibold">Notes</div>
                    <div className="mt-2 text-sm text-zinc-700">
                        - Status updates come from <code>/topic/status</code><br />
                        - Logs come from <code>/topic/logs</code><br />
                        - If disconnected, make sure backend allows SockJS and the WS endpoint is <code>/ws</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
