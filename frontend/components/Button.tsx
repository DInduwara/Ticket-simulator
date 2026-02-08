"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
    const base =
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
        variant === "primary"
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-500"
                : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";

    return <button className={`${base} ${styles} ${className}`} {...props} />;
}
