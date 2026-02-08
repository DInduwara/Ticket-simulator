export function Badge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-900">
      {text}
    </span>
    );
}
