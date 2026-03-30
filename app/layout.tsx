import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aquatic Biosecurity Simulation",
  description: "Aquatic biosecurity hazard simulation platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}