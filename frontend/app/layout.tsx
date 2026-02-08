import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
        </body>
        </html>
    );
}
