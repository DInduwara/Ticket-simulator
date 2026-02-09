"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card } from "./ui/Card";
import { TicketStatus } from "@/types/events";

type ChartData = {
  time: string;
  available: number;
  sold: number;
  released: number;
};

export function LiveLineChart({ status }: { status: TicketStatus | null }) {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!status) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

    setData((prev) => {
      const newData = [...prev, { 
        time: timeStr, 
        available: status.available, 
        sold: status.totalSold,
        released: status.totalReleased 
      }];
      return newData.slice(-40); // Increased window for better visualization
    });
  }, [status]);

  if (!data.length) {
    return (
        <Card className="h-[400px] flex items-center justify-center text-zinc-400 text-sm">
            <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin" />
                <span>Waiting for simulation stream...</span>
            </div>
        </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h3 className="text-lg font-bold text-zinc-900">Throughput Analytics</h3>
            <p className="text-xs text-zinc-500">Real-time supply vs demand curves</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold bg-zinc-100/50 p-2 rounded-lg border border-zinc-200/50">
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                <span>Released</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span>Sold</span>
            </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
            <XAxis dataKey="time" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dy={10} />
            <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
            <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600, padding: '2px 0' }}
            />
            <Area type="monotone" dataKey="released" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorReleased)" />
            <Area type="monotone" dataKey="sold" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSold)" />
            <Area type="monotone" dataKey="available" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAvailable)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}