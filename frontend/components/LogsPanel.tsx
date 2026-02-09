import { LogEvent } from "@/types/events";
import { Card } from "./ui/Card";

export function LogsPanel({ logs }: { logs: LogEvent[] }) {
  return (
    <Card className="h-[300px] flex flex-col !bg-zinc-900 !border-zinc-800 p-0 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 opacity-50">
           <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
           <span className="text-xs font-mono text-zinc-400">system_events.log</span>
        </div>
      </div>
      
      {/* Logs Area */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs space-y-3 custom-scrollbar">
        {logs.length === 0 && <div className="text-zinc-600 italic pl-2 mt-20 text-center">Waiting for simulation events...</div>}
        
        {logs.map((l, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-zinc-800 pl-3 hover:border-zinc-600 hover:bg-zinc-800/30 transition-all rounded-r-lg py-1">
            <span className="text-zinc-500 shrink-0 select-none w-16">
              {new Date(l.at).toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}
            </span>
            <span className={`shrink-0 font-bold uppercase tracking-wider w-24 ${
              l.actorType === 'VENDOR' ? 'text-blue-400' : 
              l.actorType === 'VIP' ? 'text-amber-400' : 
              l.actorType === 'SYSTEM' ? 'text-purple-400' : 'text-emerald-400'
            }`}>
              {l.actorType}-{l.actorId}
            </span>
            <span className="text-zinc-300 truncate">{l.message}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}