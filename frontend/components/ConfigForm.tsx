"use client";
import { useEffect, useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { api } from "@/lib/api";
import { SystemConfiguration } from "@/types/events";

export function ConfigForm() {
  const [cfg, setCfg] = useState<SystemConfiguration>({
    totalTickets: 100,
    ticketReleaseRate: 10,
    customerRetrievalRate: 1000,
    maxTicketCapacity: 50,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    api.getLatestConfig().then(setCfg).catch(() => {});
  }, []);

  async function save() {
    setLoading(true);
    try {
      await api.saveConfig(cfg);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (key: keyof SystemConfiguration, val: string) => {
    setCfg(prev => ({ ...prev, [key]: Number(val) }));
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">System Configuration</h3>
            <p className="text-xs text-zinc-500">Global parameters</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          <Input label="Total Tickets" type="number" value={cfg.totalTickets} onChange={e => handleChange("totalTickets", e.target.value)} />
          <Input label="Max Capacity" type="number" value={cfg.maxTicketCapacity} onChange={e => handleChange("maxTicketCapacity", e.target.value)} />
          <Input label="Release Rate" type="number" value={cfg.ticketReleaseRate} onChange={e => handleChange("ticketReleaseRate", e.target.value)} />
          <Input label="Cust. Delay (ms)" type="number" value={cfg.customerRetrievalRate} onChange={e => handleChange("customerRetrievalRate", e.target.value)} />
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={save} disabled={loading} className="w-full h-12 text-base shadow-indigo-500/20">
          {loading ? "Saving..." : status === "saved" ? "Saved Successfully!" : "Save Configuration"}
        </Button>
      </div>
    </Card>
  );
}