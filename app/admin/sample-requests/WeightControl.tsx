"use client";

import { useFormStatus } from "react-dom";
import { saveSampleRequestWeight } from "./actions";

// BCF (Berlin Chili Fest) palette — matches LabelControl. Weighing is a step on
// the same posted-box path as the label, so it lives in the same visual family.
const ACCENT = "#ea580c"; // BCF orange
const INK = "#122a1d"; // BCF deep green

// Standard ROH box weight — shown as the placeholder / the value the mint uses
// when no per-box weight is saved. Kept in sync with SAMPLE_BOX_SPECS in lib/dhl.
const DEFAULT_WEIGHT = 1.3;

// Its own <form> pending state, so a double-click can't fire two saves and the
// admin gets a clear "Saving…" beat. Saving persists ONLY the weight — it never
// mints a label.
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "4px 8px",
        border: `1px solid ${pending ? "#ccc" : INK}`,
        background: pending ? "#eee" : "#fff",
        color: pending ? "#999" : INK,
        cursor: pending ? "wait" : "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

interface Props {
  id: string;
  /** Current saved weight in kg, or null if none recorded yet. */
  weightKg: number | null;
}

export default function WeightControl({ id, weightKg }: Props) {
  return (
    <form
      action={saveSampleRequestWeight}
      style={{ display: "flex", alignItems: "center", gap: 4 }}
    >
      <input type="hidden" name="id" value={id} />
      <input
        name="weight_kg"
        type="number"
        step="0.01"
        min="0"
        max="31.5"
        inputMode="decimal"
        defaultValue={weightKg ?? ""}
        placeholder={String(DEFAULT_WEIGHT)}
        aria-label="Box weight in kg"
        style={{
          width: 58,
          fontSize: 12,
          padding: "4px 6px",
          border: "1px solid #ccc",
          background: "#fff",
        }}
      />
      <span style={{ fontSize: 11, color: INK, fontWeight: 700 }}>kg</span>
      <SaveButton />
    </form>
  );
}
