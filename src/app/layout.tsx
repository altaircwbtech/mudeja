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
    default: "MudeJá — Mudanças, Carretos e Fretes Confiáveis",
    template: "%s | MudeJá",
  },
  description:
    "Encontre prestadores verificados para mudanças, carretos e fretes locais. Avaliações reais, preços justos e profissionais de confiança perto de você.",
  keywords: [
    "mudança",
    "carreto",
    "frete",
    "mudança residencial",
    "frete local",
    "prestador de mudança",
    "mudança barata",
    "carreto barato",
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MudeJá",
    title: "MudeJá — Mudanças, Carretos e Fretes Confiáveis",
    description:
      "Encontre prestadores verificados para mudanças, carretos e fretes locais.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0D9488" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
