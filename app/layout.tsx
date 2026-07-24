import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import { BannerGate } from "@/app/_components/BannerGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "European Heat Council",
  description:
    "Convening body for the European hot sauce industry. Growing Europe's heat makers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BannerGate />
        {children}
        {/* Umami — self-hosted, cookieless analytics (no consent banner). Source counts via ?utm_source= tags on press links. */}
        <Script
          defer
          src="https://umami-analytics-swart-six.vercel.app/script.js"
          data-website-id="c2b7dc9a-d192-4491-8fe8-ebb3211073be"
          strategy="afterInteractive"
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
