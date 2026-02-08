"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { api } from "@/lib/api";
import { SystemConfiguration } from "@/types/events";

export function ConfigForm({ onSaved }: { onSaved?: (cfg: SystemConfiguration) => void }) {
    const [cfg, setCfg] = useState<SystemConfiguration>({
        totalTickets: 100,
        ticketReleaseRate: 2,
        customerRetrievalRate: 1,
        maxTicketCapacity: 50,
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    useEffect(() => {
        api.getLatestConfig()
            .then((c) => setCfg(c))
            .catch(() => {});
    }, []);

    async function save() {
        setLoading(true);
        setMsg(null);
        try {
            const saved = await api.saveConfig(cfg);
            setMsg("Configuration saved ✅");
            onSaved?.(saved);
        } catch (e: any) {
            setMsg(e.message || "Failed to save config");
        } finally {
            setLoading(false);
        }
    }

    function setNum<K extends keyof SystemConfiguration>(k: K, v: string) {
        setCfg((prev) => ({ ...prev, [k]: Number(v) } as SystemConfiguration));
    }

    return (
        <Card>
            <div className="text-sm font-semibold">System Configuration</div>
            <div className="mt-1 text-xs text-zinc-500">Saved to SQLite via /api/config</div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field label="Total Tickets">
                    <Input type="number" value={cfg.totalTickets} onChange={(e) => setNum("totalTickets", e.target.value)} />
                </Field>
                <Field label="Max Ticket Capacity">
                    <Input type="number" value={cfg.maxTicketCapacity} onChange={(e) => setNum("maxTicketCapacity", e.target.value)} />
                </Field>
                <Field label="Ticket Release Rate (per cycle)">
                    <Input type="number" value={cfg.ticketReleaseRate} onChange={(e) => setNum("ticketReleaseRate", e.target.value)} />
                </Field>
                <Field label="Customer Retrieval Rate (not used yet)">
                    <Input type="number" value={cfg.customerRetrievalRate} onChange={(e) => setNum("customerRetrievalRate", e.target.value)} />
                </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <Button onClick={save} disabled={loading}>
                    {loading ? "Saving..." : "Save Config"}
                </Button>
                {msg && <div className="text-sm text-zinc-700">{msg}</div>}
            </div>
        </Card>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-1 text-xs font-medium text-zinc-700">{label}</div>
            {children}
        </div>
    );
}
