"use client";
import { useEffect, useState } from "react";
import { connectRealtime } from "@/lib/ws";
import { LogEvent, TicketStatus } from "@/types/events";
import { api } from "@/lib/api";
import { ConfigForm } from "./ConfigForm";
import { Controls } from "./Controls";
import { StatGrid } from "./StatGrid";
import { LiveFlowDiagram } from "./LiveFlowDiagram";
import { LogsPanel } from "./LogsPanel";
import { Badge } from "./ui/Badge";
import { LiveLineChart } from "./LiveLineChart";

export function Dashboard() {
  const [status, setStatus] = useState<TicketStatus | null>(null);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [simState, setSimState] = useState("UNKNOWN");

  const refreshStatus = () => api.simStatus().then(setSimState).catch(() => setSimState("OFFLINE"));

  useEffect(() => {
    refreshStatus();
    const disconnect = connectRealtime({
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onStatus: setStatus,
      onLog: (l) => setLogs((prev) => [l, ...prev].slice(0, 100)),
    });
    return () => disconnect();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900">
            TicketSim<span className="text-indigo-600">Pro</span>
          </h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Real-time Concurrency & Event Monitor</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${connected ? 'bg-emerald-50/50 border-emerald-200 text-emerald-700' : 'bg-rose-50/50 border-rose-200 text-rose-700'} backdrop-blur-sm`}>
             <div className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
             <span className="text-xs font-bold uppercase">{connected ? "System Online" : "Disconnected"}</span>
           </div>
           <Badge text={simState} color={simState === "RUNNING" ? "blue" : "gray"} />
        </div>
      </div>

      {/* 2. Hero Stats */}
      <StatGrid 
        available={status?.available ?? 0}
        released={status?.totalReleased ?? 0}
        sold={status?.totalSold ?? 0}
        maxCapacity={status?.maxCapacity ?? 0}
      />

      {/* 3. Main Control Deck */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 h-full"><ConfigForm /></div>
        <div className="xl:col-span-5 h-full"><Controls onStatusChange={refreshStatus} /></div>
      </div>

      {/* 4. Analytics Section */}
      <div className="w-full">
         <LiveLineChart status={status} />
      </div>

      {/* 5. Visualization & Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LiveFlowDiagram logs={logs} status={status} />
        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}