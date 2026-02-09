import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TicketSim Pro",
  description: "Advanced Real-time Ticketing Simulation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-indigo-100 selection:text-indigo-900`}>{children}</body>
    </html>
  );
}