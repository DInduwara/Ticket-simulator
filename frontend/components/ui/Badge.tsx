export function Badge({ text, color = "gray" }: { text: string; color?: "green" | "red" | "blue" | "gray" }) {
  const colors = {
    gray: "bg-zinc-100 text-zinc-600 border-zinc-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[color]}`}>
      {text}
    </span>
  );
}