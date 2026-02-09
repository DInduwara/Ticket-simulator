"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./Card";
import { TicketStatus } from "@/types/events";

type Point = {
  t: number;
  available: number;
  sold: number;
  booth: number; // ✅ sold + available
};

type Props = {
  status: TicketStatus | null;
  maxPoints?: number;
  sampleMs?: number;
};

export function LiveLineChart({ status, maxPoints = 80, sampleMs = 700 }: Props) {
  const [series, setSeries] = useState<Point[]>([]);
  const statusRef = useRef<TicketStatus | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // ✅ one stable interval
  useEffect(() => {
    const id = setInterval(() => {
      const s = statusRef.current;
      if (!s) return;

      const available = Math.max(0, s.available ?? 0);
      const sold = Math.max(0, s.totalSold ?? 0);
      const booth = sold + available;

      setSeries((prev) => {
        const p: Point = { t: Date.now(), available, sold, booth };
        const next = [...prev, p];
        return next.length > maxPoints ? next.slice(next.length - maxPoints) : next;
      });
    }, sampleMs);

    return () => clearInterval(id);
  }, [maxPoints, sampleMs]);

  const width = 980;
  const height = 320;
  const pad = 36;

  const { paths, yMax } = useMemo(() => {
    const pts = series;

    const maxY =
      pts.length > 0
        ? Math.max(...pts.map((p) => Math.max(p.available, p.sold, p.booth)), 1)
        : 1;

    const xScale = (i: number) =>
      pad + (i * (width - pad * 2)) / Math.max(1, pts.length - 1);

    const yScale = (v: number) =>
      height - pad - (v * (height - pad * 2)) / maxY;

    const buildPath = (getY: (p: Point) => number) => {
      if (pts.length === 0) return "";
      return pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(getY(p))}`)
        .join(" ");
    };

    return {
      yMax: maxY,
      paths: {
        booth: buildPath((p) => p.booth),
        sold: buildPath((p) => p.sold),
        available: buildPath((p) => p.available),
      },
    };
  }, [series]);

  const last = series[series.length - 1];

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Real-time Ticket Trend</div>
          <div className="text-xs text-zinc-500">
            Booth (green = sold+available), Sold (red), Available (yellow)
          </div>
        </div>

        <div className="text-right text-xs text-zinc-600">
          <div>Samples: {series.length}</div>
          <div>Y max: {Math.round(yMax)}</div>
          {last && (
            <div className="text-[11px] text-zinc-500">
              booth={last.booth} • sold={last.sold} • avail={last.available}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg
          width={width}
          height={height}
          className="rounded-xl border border-zinc-200 bg-white"
          role="img"
          aria-label="Real-time line chart for booth, sold, and available tickets"
        >
          {/* axes */}
          <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="black" strokeWidth="2" />
          <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="black" strokeWidth="2" />

          {/* grid */}
          {[0.25, 0.5, 0.75].map((k) => {
            const y = pad + k * (height - pad * 2);
            return (
              <line
                key={k}
                x1={pad}
                y1={y}
                x2={width - pad}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* lines */}
          <path d={paths.booth} fill="none" stroke="#84cc16" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <path d={paths.sold} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <path d={paths.available} fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

          {/* legend */}
          <g transform={`translate(${pad + 10},${pad + 10})`}>
            <LegendItem y={0} color="#84cc16" label="Booth (Sold + Available)" />
            <LegendItem y={18} color="#ef4444" label="Sold" />
            <LegendItem y={36} color="#f59e0b" label="Available" />
          </g>
        </svg>
      </div>
    </Card>
  );
}

function LegendItem({ y, color, label }: { y: number; color: string; label: string }) {
  return (
    <g transform={`translate(0, ${y})`}>
      <line x1={0} y1={8} x2={28} y2={8} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <text x={36} y={12} fontSize="12" fill="#111827">
        {label}
      </text>
    </g>
  );
}
