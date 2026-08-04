"use client";

import { useFormStatus } from "react-dom";
import { printSampleLabel } from "./actions";

// BCF (Berlin Chili Fest) palette — orange accent + deep-green ink, per the
// public Chili Fest pages (--accent / --ink-deep in globals.css). NOT the
// black + IMDb-yellow, which is the EHSA awards chrome.
const ACCENT = "#ea580c"; // BCF orange — primary CTA colour
const INK = "#122a1d"; // BCF deep green

const btnBase: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "4px 10px",
  border: `1px solid ${ACCENT}`,
  width: "100%",
  textAlign: "center",
  cursor: "pointer",
};

// The submit button reads the enclosing <form>'s pending state so a second
// click can't fire a second (paid, in production) label mint before the first
// round-trip lands.
function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        ...btnBase,
        background: pending ? "#eee" : "#fff",
        color: pending ? "#999" : ACCENT,
        borderColor: pending ? "#ccc" : ACCENT,
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Generating…" : "🏷 Generate label"}
    </button>
  );
}

interface Props {
  id: string;
  /** Whether this row's box is actually posted (press sample) vs door pickup. */
  needsLabel: boolean;
  labelUrl: string | null;
  trackingNumber: string | null;
  /** True only if the address resolves to a DHL-shippable form. */
  shippable: boolean;
  /** Why it can't ship, shown when !shippable (e.g. 'Unknown country'). */
  addressIssue: string;
  /** Current search string, so the action redirects back to this exact view. */
  returnTo: string;
  /** Error from the last mint attempt on THIS row, if any. */
  error?: string;
}

export default function LabelControl({
  id,
  needsLabel,
  labelUrl,
  trackingNumber,
  shippable,
  addressIssue,
  returnTo,
  error,
}: Props) {
  // Door-pickup / trade rows don't get a posted label — nothing to show here.
  if (!needsLabel) return null;

  // Already minted → reprint the stored PDF (never re-bills). Show tracking.
  if (labelUrl) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <a
          href={labelUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnBase,
            background: ACCENT,
            color: "#fff",
            textDecoration: "none",
          }}
        >
          🏷 Print label
        </a>
        {trackingNumber && (
          <span style={{ fontSize: 10, color: INK, fontFamily: "monospace" }}>
            {trackingNumber}
          </span>
        )}
      </div>
    );
  }

  // No label yet. If the address won't resolve, say why instead of offering a
  // button that's guaranteed to fail on the DHL round-trip.
  if (!shippable) {
    return (
      <div
        title="Fix the shipping address before a label can be generated."
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: "#b06000",
          border: "1px solid #e0b070",
          background: "#fff8ec",
          padding: "4px 8px",
        }}
      >
        ⚠ {addressIssue}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <form action={printSampleLabel}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <GenerateButton />
      </form>
      {error && (
        <span style={{ fontSize: 10, color: "#c00", lineHeight: 1.3 }}>
          {error}
        </span>
      )}
    </div>
  );
}
