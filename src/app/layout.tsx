import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3D Chess Strategy Trainer | AI-Powered Chess Training",
  description: "An immersive 3D chess training experience with AI analysis, blunder detection, and real-time evaluation. Built with React Three Fiber and Stockfish.",
  keywords: ["Chess", "3D Chess", "Chess Trainer", "Stockfish", "React Three Fiber", "AI Chess", "Blunder Detection"],
  authors: [{ name: "Chess Trainer Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "3D Chess Strategy Trainer",
    description: "Master chess with AI-powered analysis and 3D visualization",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Chess Strategy Trainer",
    description: "Master chess with AI-powered analysis and 3D visualization",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
