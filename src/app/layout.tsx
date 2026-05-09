import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MovaFácil — Sua mudança sem dor de cabeça",
    template: "%s | MovaFácil",
  },
  description:
    "O app que facilita sua mudança. Encontre motoristas flex e ajudantes de confiança perto de você. Compare preços, veja avaliações e mude tranquilo.",
  keywords: [
    "mudança",
    "carreto",
    "frete",
    "mudança residencial",
    "frete local",
    "mudança fácil",
    "mova fácil",
    "mudança barata",
    "carreto barato",
    "ajudante de mudança",
    "motorista de mudança",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MovaFácil",
    title: "MovaFácil — Sua mudança sem dor de cabeça",
    description:
      "O app que facilita sua mudança. Motoristas flex e ajudantes de confiança perto de você.",
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'MovaFácil — Sua mudança sem dor de cabeça',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F26522" },
    { media: "(prefers-color-scheme: dark)", color: "#1E293B" },
  ],
};

import { Toaster } from "@/components/ui/sonner";
import { ToastParams } from "@/components/ui/toast-params";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
        <Toaster />
        <Suspense fallback={null}>
          <ToastParams />
        </Suspense>
      </body>
    </html>
  );
}
