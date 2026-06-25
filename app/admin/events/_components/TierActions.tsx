"use client";

import { useTransition } from "react";
import { Star, Flag, X } from "lucide-react";
import {
  markInterestedAction,
  markPriorityAction,
  markPotentialAction,
  markNotInterestedAction,
} from "../actions";

type Tier = "we_want_to_go" | "priority_for_us" | "potential" | "not_interested";

export function TierActions({
  eventId,
  current,
}: {
  eventId: string;
  current: Tier;
}) {
  const [pending, start] = useTransition();
  function fire(target: Tier) {
    start(() => {
      // Toggle: clicking an already-active tier resets to potential.
      const next = current === target ? "potential" : target;
      if (next === "we_want_to_go") markInterestedAction(eventId);
      else if (next === "priority_for_us") markPriorityAction(eventId);
      else if (next === "not_interested") markNotInterestedAction(eventId);
      else markPotentialAction(eventId);
    });
  }
  return (
    <div className="tier-actions" role="group" aria-label="Interest level">
      <button
        type="button"
        className={`ta-btn ta-int ${current === "we_want_to_go" ? "is-active" : ""}`}
        title="Interested"
        aria-label="Mark interested"
        aria-pressed={current === "we_want_to_go"}
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fire("we_want_to_go");
        }}
      >
        <Star size={11} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`ta-btn ta-pri ${current === "priority_for_us" ? "is-active" : ""}`}
        title="Priority"
        aria-label="Mark priority"
        aria-pressed={current === "priority_for_us"}
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fire("priority_for_us");
        }}
      >
        <Flag size={11} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`ta-btn ta-skip ${current === "not_interested" ? "is-active" : ""}`}
        title="Not interested"
        aria-label="Mark not interested"
        aria-pressed={current === "not_interested"}
        disabled={pending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fire("not_interested");
        }}
      >
        <X size={12} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}
