"use client";

import { useFormStatus } from "react-dom";
import { createNewLabelBatch } from "./actions";

function SubmitButton({ count }: { count: number }) {
  const { pending } = useFormStatus();
  const batchCount = Math.min(count, 25);
  return (
    <button
      type="submit"
      disabled={pending || count === 0}
      style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        padding: "8px 14px",
        border: "1px solid #ea580c",
        background: pending || count === 0 ? "#eee" : "#ea580c",
        color: pending || count === 0 ? "#777" : "#fff",
        cursor: pending ? "wait" : count === 0 ? "default" : "pointer",
      }}
    >
      {pending
        ? "Building PDF…"
        : count === 0
          ? "No new labels to batch"
          : `Create PDF from ${batchCount}${count > batchCount ? ` of ${count}` : ""} new labels`}
    </button>
  );
}

export default function BatchLabelButton({ count }: { count: number }) {
  return (
    <form action={createNewLabelBatch}>
      <SubmitButton count={count} />
    </form>
  );
}
