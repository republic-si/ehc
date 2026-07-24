"use client";

import { usePathname } from "next/navigation";
import { ChiliFestBanner } from "./SiteChrome";

// The site-wide Chili Fest promo bar, gated off the EHSA press hub so /ehsa
// opens on its own brand rather than a competing campaign banner.
export function BannerGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/ehsa")) return null;
  return <ChiliFestBanner />;
}
