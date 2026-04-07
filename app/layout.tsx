import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const brandSans = Plus_Jakarta_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Divulgador Inteligente",
  description:
    "Vitrine premium de produtos, cupons e descoberta visual para o teste tecnico da Divulgador Inteligente.",
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
      className={cn("h-full", "antialiased", brandSans.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
