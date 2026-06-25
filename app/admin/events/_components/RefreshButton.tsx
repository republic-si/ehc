"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { refreshEventsAction } from "../actions";

export function RefreshButton() {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="refresh-btn"
      disabled={pending}
      onClick={() => start(() => refreshEventsAction())}
      title="Refresh events cache"
      aria-label="Refresh"
    >
      <RefreshCw
        size={13}
        strokeWidth={2.2}
        className={pending ? "rotating" : ""}
        aria-hidden="true"
      />
      <span>{pending ? "Refreshing…" : "Refresh"}</span>
    </button>
  );
}
