"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { LogEvent, TicketStatus } from "@/types/events";

type Props = {
  status: TicketStatus | null;
  logs: LogEvent[];
  vendorCount?: number;
  vipCount?: number;
  customerCount?: number;
};

type Pulse = { id: string; kind: "release" | "sell"; at: number };

export function LiveFlowDiagram({
  status,
  logs,
  vendorCount = 2,
  vipCount = 2,
  customerCount = 8,
}: Props) {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  // ✅ keep time out of render to satisfy React purity rules
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Detect recent actions from logs (pure — depends only on logs + now state)
  const recentActions = useMemo(() => {
    const last5s = logs.filter((l) => now - new Date(l.at).getTime() <= 5000);

    const releases = last5s.filter((l) =>
      l.message.toLowerCase().includes("released")
    ).length;

    const sells = last5s.filter((l) =>
      l.message.toLowerCase().includes("purchased")
    ).length;

    return { releases, sells };
  }, [logs, now]);

  // Create short-lived pulses whenever we see releases/sells
  useEffect(() => {
    if (logs.length === 0) return;

    const latest = logs[0];
    const msg = latest.message.toLowerCase();

    const isRelease = msg.includes("released");
    const isSell = msg.includes("purchased");

    if (!isRelease && !isSell) return;

    const p: Pulse = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      kind: isRelease ? "release" : "sell",
      at: Date.now(),
    };

    setPulses((prev) => [p, ...prev].slice(0, 12));

    const t = setTimeout(() => {
      setPulses((prev) => prev.filter((x) => x.id !== p.id));
    }, 900);

    return () => clearTimeout(t);
  }, [logs]);

  const available = status?.available ?? 0;
  const maxCapacity = status?.maxCapacity ?? 0;
  const released = status?.totalReleased ?? 0;
  const sold = status?.totalSold ?? 0;

  const poolPct =
    maxCapacity > 0
      ? Math.min(100, Math.round((available / maxCapacity) * 100))
      : 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Live System Diagram</div>
          <div className="text-xs text-zinc-500">
            Producer → TicketPool → Consumers (VIP priority)
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-zinc-500">Activity (last 5s)</div>
          <div className="text-sm font-medium text-zinc-900">
            +{recentActions.releases} released • -{recentActions.sells} sold
          </div>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="relative mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Producers */}
          <Node
            title="Vendors (Producers)"
            subtitle={`${vendorCount} threads`}
            tone="producer"
          >
            <MiniList
              items={Array.from(
                { length: vendorCount },
                (_, i) => `Vendor V${i + 1}`
              )}
            />
            <Hint text="Adds tickets into the pool (ReentrantLock + notFull condition)." />
          </Node>

          {/* Pool */}
          <Node title="TicketPool (Shared Buffer)" subtitle="Thread-safe queue" tone="pool">
            <div className="space-y-2">
              <MetricRow label="Available" value={`${available}`} />
              <MetricRow label="Capacity" value={`${available} / ${maxCapacity}`} />
              <MetricRow label="Released" value={`${released}`} />
              <MetricRow label="Sold" value={`${sold}`} />

              <div className="mt-2">
                <div className="mb-1 text-xs font-medium text-zinc-700">Fill Level</div>
                <div className="h-3 w-full rounded-full bg-zinc-200">
                  <div
                    className="h-3 rounded-full bg-zinc-900 transition-all"
                    style={{ width: `${poolPct}%` }}
                  />
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">{poolPct}%</div>
              </div>

              <Hint text="Signals VIP first if waiting; otherwise regular customers." />
            </div>
          </Node>

          {/* Consumers */}
          <Node
            title="Customers (Consumers)"
            subtitle={`${customerCount} threads`}
            tone="consumer"
          >
            <div className="grid grid-cols-1 gap-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-2">
                <div className="text-xs font-semibold">VIP Customers</div>
                <div className="text-xs text-zinc-500">{vipCount} threads</div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-2">
                <div className="text-xs font-semibold">Regular Customers</div>
                <div className="text-xs text-zinc-500">
                  {Math.max(0, customerCount - vipCount)} threads
                </div>
              </div>
            </div>

            <Hint text="VIP waits on VIP condition, gets priority when tickets arrive." />
          </Node>
        </div>

        {/* Flow arrows */}
        <Arrow from="left" to="center" label="release()" />
        <Arrow from="center" to="right" label="remove()" />

        {/* Pulses */}
        {pulses.map((p) => (
          <FlowDot key={p.id} kind={p.kind} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
        <LegendDot tone="producer" label="Producer action" />
        <LegendDot tone="pool" label="Shared buffer" />
        <LegendDot tone="consumer" label="Consumer action" />
        <span className="text-zinc-400">•</span>
        <span>Dots animate when logs show “released” or “purchased”.</span>
      </div>
    </Card>
  );
}

function Node({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string;
  subtitle: string;
  tone: "producer" | "pool" | "consumer";
  children: React.ReactNode;
}) {
  const border =
    tone === "producer"
      ? "border-blue-200"
      : tone === "consumer"
      ? "border-emerald-200"
      : "border-zinc-200";

  return (
    <div className={`rounded-xl border ${border} bg-white p-4 shadow-sm`}>
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      <div className="text-xs text-zinc-500">{subtitle}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function MiniList({ items }: { items: string[] }) {
  return (
    <div className="space-y-1">
      {items.map((x) => (
        <div
          key={x}
          className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs"
        >
          {x}
        </div>
      ))}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <div className="text-xs text-zinc-600">{label}</div>
      <div className="text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

function Hint({ text }: { text: string }) {
  return <div className="mt-2 text-[11px] text-zinc-500">{text}</div>;
}

function Arrow({
  from,
  to,
  label,
}: {
  from: "left" | "center";
  to: "center" | "right";
  label: string;
}) {
  const base = "absolute top-1/2 hidden -translate-y-1/2 md:block";
  const isLeftToCenter = from === "left" && to === "center";

  const left = isLeftToCenter ? "left-[33.3%]" : "left-[66.6%]";
  const width = "w-[18%]";
  const line = "h-[2px] bg-zinc-300";
  const head =
    "h-0 w-0 border-y-4 border-y-transparent border-l-8 border-l-zinc-300";

  return (
    <div className={`${base} ${left} ${width}`}>
      <div className="flex items-center gap-2">
        <div className={`flex-1 ${line}`} />
        <div className={head} />
      </div>
      <div className="mt-1 text-center text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}

function FlowDot({ kind }: { kind: "release" | "sell" }) {
  const isRelease = kind === "release";
  const dotColor = isRelease ? "bg-blue-600" : "bg-emerald-600";

  const start = isRelease ? "md:left-[23%]" : "md:left-[50%]";

  return (
    <div
      className={[
        "pointer-events-none absolute top-1/2 -translate-y-1/2",
        "h-3 w-3 rounded-full",
        dotColor,
        "opacity-90",
        start,
        "left-[50%]",
      ].join(" ")}
      style={{
        animation: `flow-${kind} 0.75s ease-out forwards`,
      }}
    />
  );
}

function LegendDot({
  tone,
  label,
}: {
  tone: "producer" | "pool" | "consumer";
  label: string;
}) {
  const color =
    tone === "producer"
      ? "bg-blue-600"
      : tone === "consumer"
      ? "bg-emerald-600"
      : "bg-zinc-900";

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <div>{label}</div>
    </div>
  );
}
