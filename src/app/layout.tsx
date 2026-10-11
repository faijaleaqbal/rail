import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RailYatra — Live Train Tracking",
  description: "Track Indian Railways trains live. Offline schedules, station boards, coach layout, PNR status.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
