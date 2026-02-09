"use client";
import { useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { api } from "@/lib/api";

export function Controls({ onStatusChange }: { onStatusChange?: () => void }) {
  const [params, setParams] = useState({ vendors: 2, customers: 8, vip: 2 });
  const [loading, setLoading] = useState(false);

  const action = async (type: "start" | "stop") => {
    setLoading(true);
    try {
      if (type === "start") await api.startSim(params.vendors, params.customers, params.vip);
      else await api.stopSim();
      onStatusChange?.();
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">Control Panel</h3>
            <p className="text-xs text-zinc-500">Active threads</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Input label="Vendors" type="number" value={params.vendors} onChange={e => setParams({...params, vendors: +e.target.value})} />
          <Input label="Customers" type="number" value={params.customers} onChange={e => setParams({...params, customers: +e.target.value})} />
          <Input label="VIP" type="number" value={params.vip} onChange={e => setParams({...params, vip: +e.target.value})} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button onClick={() => action("start")} disabled={loading} variant="primary" className="h-12 bg-indigo-600 hover:bg-indigo-700">
          Start System
        </Button>
        <Button onClick={() => action("stop")} disabled={loading} variant="danger" className="h-12 bg-rose-500 hover:bg-rose-600">
          Stop System
        </Button>
      </div>
    </Card>
  );
}