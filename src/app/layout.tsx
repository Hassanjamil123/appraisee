import type { Metadata } from "next";
import { Inter, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Appraise — Operational Context for AI Applications",
  description:
    "Appraise gives AI apps operational context, workflow intelligence, and decision-ready reasoning through a simple API.",
  keywords: [
    "AI context",
    "context infrastructure",
    "AI infrastructure",
    "developer tools",
    "API",
    "workflow reasoning",
    "agent context",
  ],
  openGraph: {
    title: "Appraise — Operational Context for AI Applications",
    description:
      "Turn stateless AI apps into context-aware systems with workflow intelligence and decision-ready reasoning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${sora.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
