import type { Metadata } from "next";
import {
  Geist_Mono,
  Instrument_Serif,
  Plus_Jakarta_Sans,
} from "next/font/google";

import "./globals.css";

const brandSans = Plus_Jakarta_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heroDisplay = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Divulgador Inteligente",
  description:
    "Vitrine premium de produtos, cupons e descoberta visual para o teste técnico da Divulgador Inteligente.",
  icons: {
    icon: "/brand/divulgador-inteligente-favicon.ico",
    shortcut: "/brand/divulgador-inteligente-favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${brandSans.variable} ${geistMono.variable} ${heroDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
