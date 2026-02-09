import { SystemConfiguration } from "@/types/events";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return undefined as T;

  return res.json();
}

export const api = {
  getLatestConfig: () => http<SystemConfiguration>(`/api/config/latest`),
  
  saveConfig: (cfg: SystemConfiguration) =>
    http<SystemConfiguration>(`/api/config`, {
      method: "POST",
      body: JSON.stringify(cfg),
    }),

  startSim: (vendors: number, customers: number, vip: number) =>
    http<void>(`/api/sim/start?vendors=${vendors}&customers=${customers}&vip=${vip}`, {
      method: "POST",
    }),

  stopSim: () => http<void>(`/api/sim/stop`, { method: "POST" }),

  simStatus: () => http<string>(`/api/sim/status`),
};