"use client";

import { openRequestModal } from "./RequestModal";

// Thin client trigger so server-rendered layout (hero, section card) can open
// the request modal. Styling is passed in so the same button can wear the hero
// pill or the card CTA.
export function OpenRequestButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={openRequestModal} className={className}>
      {children}
    </button>
  );
}
