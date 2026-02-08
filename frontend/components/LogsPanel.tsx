"use client";

import { Card } from "./Card";
import { LogEvent } from "@/types/events";

export function LogsPanel({ logs }: { logs: LogEvent[] }) {
    return (
        <Card className="h-[420px] overflow-hidden p-0">
            <div className="border-b border-zinc-200 p-4">
                <div className="text-sm font-semibold">Live Logs</div>
                <div className="text-xs text-zinc-500">Real-time events from /topic/logs</div>
            </div>
            <div className="h-[360px] overflow-auto p-4">
                <div className="space-y-2">
                    {logs.length === 0 && <div className="text-sm text-zinc-500">No logs yet…</div>}
                    {logs.map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-zinc-200 bg-white p-2">
                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium text-zinc-900">
                                    {l.actorType} • {l.actorId}
                                </div>
                                <div className="text-[11px] text-zinc-500">
                                    {new Date(l.at).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="mt-1 text-sm text-zinc-800">{l.message}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
