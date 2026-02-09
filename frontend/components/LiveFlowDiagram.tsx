"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui/Card";
import { LogEvent, TicketStatus } from "@/types/events";

export function LiveFlowDiagram({ logs, status }: { logs: LogEvent[]; status: TicketStatus | null }) {
  const [pulses, setPulses] = useState<{id: string, type: 'in' | 'out'}[]>([]);

  useEffect(() => {
    if (!logs.length) return;
    const latest = logs[0];
    const isRelease = latest.message.toLowerCase().includes("released");
    const isSell = latest.message.toLowerCase().includes("purchased");
    
    if (isRelease || isSell) {
      const id = Math.random().toString(36);
      setPulses(p => [...p.slice(-10), { id, type: isRelease ? 'in' : 'out' }]);
      setTimeout(() => setPulses(p => p.filter(x => x.id !== id)), 1000);
    }
  }, [logs]);

  const fillPct = status ? Math.min(100, (status.available / status.maxCapacity) * 100) : 0;
  const isActive = (status?.available ?? 0) > 0;

  return (
    <Card className="min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden bg-white/40 p-4 md:p-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`}></div>
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Live Flow</span>
      </div>

      {/* Main Flow Container - Adjusted for better responsiveness */}
      <div className="flex flex-col md:flex-row w-full items-center justify-center gap-4 md:gap-6 lg:gap-12 relative z-10">
        
        {/* VENDORS */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border border-blue-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex items-center justify-center text-blue-500 transition-transform group-hover:scale-105 group-hover:shadow-blue-200">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <div className="text-center">
             <div className="text-xs md:text-sm font-bold text-zinc-700">Vendors</div>
             <div className="text-[10px] text-zinc-400 font-mono">PRODUCERS</div>
          </div>
        </div>

        {/* ANIMATED PIPELINE IN (Responsive Width) */}
        <div className="relative h-1.5 w-16 md:w-24 lg:w-32 bg-zinc-100 rounded-full overflow-hidden shadow-inner rotate-90 md:rotate-0 my-2 md:my-0">
          {pulses.filter(p => p.type === 'in').map(p => (
            <div key={p.id} className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-flow-right shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
          ))}
        </div>

        {/* CENTRAL POOL */}
        <div className="relative group mx-2">
          {/* Outer Glow Ring */}
          <div className={`absolute -inset-4 bg-indigo-500/20 rounded-full blur-xl transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}></div>
          
          <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white bg-zinc-50 shadow-2xl flex items-center justify-center overflow-hidden z-20">
             {/* Liquid Fill Effect */}
             <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300 ease-out opacity-90" style={{ height: `${fillPct}%` }} />
             
             {/* Text Overlay */}
             <div className={`relative z-30 text-center transition-colors duration-300 ${fillPct > 50 ? 'text-white' : 'text-zinc-900'}`}>
               <div className="text-2xl md:text-4xl font-black tracking-tighter">{status?.available ?? 0}</div>
               <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Buffer</div>
             </div>
          </div>
        </div>

        {/* ANIMATED PIPELINE OUT (Responsive Width) */}
        <div className="relative h-1.5 w-16 md:w-24 lg:w-32 bg-zinc-100 rounded-full overflow-hidden shadow-inner rotate-90 md:rotate-0 my-2 md:my-0">
           {pulses.filter(p => p.type === 'out').map(p => (
            <div key={p.id} className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-flow-right shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
          ))}
        </div>

        {/* CUSTOMERS */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white border border-emerald-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] flex items-center justify-center text-emerald-500 transition-transform group-hover:scale-105 group-hover:shadow-emerald-200">
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div className="text-center">
             <div className="text-xs md:text-sm font-bold text-zinc-700">Customers</div>
             <div className="text-[10px] text-zinc-400 font-mono">CONSUMERS</div>
          </div>
        </div>
      </div>
    </Card>
  );
}