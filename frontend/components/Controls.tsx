"use client";

import { useState } from "react";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { api } from "@/lib/api";

export function Controls() {
    const [vendors, setVendors] = useState(2);
    const [customers, setCustomers] = useState(8);
    const [vip, setVip] = useState(2);

    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    async function start() {
        setBusy(true);
        setMsg(null);
        try {
            await api.startSim(vendors, customers, vip);
            setMsg("Simulation started ✅");
        } catch (e: any) {
            setMsg(e.message || "Failed to start");
        } finally {
            setBusy(false);
        }
    }

    async function stop() {
        setBusy(true);
        setMsg(null);
        try {
            await api.stopSim();
            setMsg("Simulation stopped ✅");
        } catch (e: any) {
            setMsg(e.message || "Failed to stop");
        } finally {
            setBusy(false);
        }
    }

    return (
        <Card>
            <div className="text-sm font-semibold">Simulation Controls</div>
            <div className="mt-1 text-xs text-zinc-500">Calls /api/sim/start and /api/sim/stop</div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field label="Vendors">
                    <Input type="number" value={vendors} onChange={(e) => setVendors(Number(e.target.value))} />
                </Field>
                <Field label="Customers">
                    <Input type="number" value={customers} onChange={(e) => setCustomers(Number(e.target.value))} />
                </Field>
                <Field label="VIP">
                    <Input type="number" value={vip} onChange={(e) => setVip(Number(e.target.value))} />
                </Field>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <Button onClick={start} disabled={busy}>Start</Button>
                <Button variant="danger" onClick={stop} disabled={busy}>Stop</Button>
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
