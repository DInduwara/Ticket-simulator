import { Dashboard } from "@/components/Dashboard";
import { ConfigForm } from "@/components/ConfigForm";
import { Controls } from "@/components/Controls";

export default function HomePage() {
  return (
      <main className="space-y-4">
        <header className="space-y-1">
          <div className="text-2xl font-semibold">Ticket Simulator</div>
          <div className="text-sm text-zinc-500">
            Producer–Consumer + VIP Priority + Real-time WebSocket Dashboard
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ConfigForm />
          <Controls />
        </div>

        <Dashboard />
      </main>
  );
}
