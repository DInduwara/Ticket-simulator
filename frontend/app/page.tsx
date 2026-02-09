import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <Dashboard />
      </div>
    </main>
  );
}