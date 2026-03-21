import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aquatic Biosecurity Simulation",
  description: "Invasive mussel response and preparedness exercise prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-950 antialiased">
        {children}
      </body>
    </html>
  );
}