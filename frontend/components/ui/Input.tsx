import React from "react";

export function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="group">
      {label && <label className="mb-1.5 block text-xs font-semibold text-zinc-500 group-focus-within:text-indigo-600">{label}</label>}
      <input
        {...props}
        className={`w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 ${props.className ?? ""}`}
      />
    </div>
  );
}