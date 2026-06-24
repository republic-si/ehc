"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { markNotInterestedAction } from "../actions";

export function NotInterestedButton({ eventId }: { eventId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="card-not-interested"
      title="Not interested"
      aria-label="Mark not interested"
      disabled={pending}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        start(() => {
          markNotInterestedAction(eventId);
        });
      }}
    >
      <X size={12} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
