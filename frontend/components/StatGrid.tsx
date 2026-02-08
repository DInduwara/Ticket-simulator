import { Card } from "./Card";

export function StatGrid({
                             available,
                             released,
                             sold,
                             maxCapacity,
                             totalLimit,
                         }: {
    available: number;
    released: number;
    sold: number;
    maxCapacity: number;
    totalLimit: number;
}) {
    const items = [
        { label: "Available", value: available },
        { label: "Released", value: released },
        { label: "Sold", value: sold },
        { label: "Max Capacity", value: maxCapacity },
        { label: "Total Limit", value: totalLimit },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {items.map((x) => (
                <Card key={x.label} className="p-3">
                    <div className="text-xs text-zinc-500">{x.label}</div>
                    <div className="mt-1 text-2xl font-semibold text-zinc-900">{x.value}</div>
                </Card>
            ))}
        </div>
    );
}
