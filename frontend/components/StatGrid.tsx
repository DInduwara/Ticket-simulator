import { Card } from "./ui/Card";

export function StatGrid({ available, released, sold, maxCapacity }: any) {
  const stats = [
    { label: "Available Tickets", value: available, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Released", value: released, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Sold", value: sold, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Max Capacity", value: maxCapacity, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="flex items-center justify-between p-4 border-l-4" style={{borderLeftColor: 'currentColor'}}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{s.label}</div>
            <div className="mt-1 text-3xl font-bold text-zinc-900">{s.value}</div>
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          </div>
        </Card>
      ))}
    </div>
  );
}