"use client";

import { useState } from "react";
import { submitPressEveningRequest } from "./actions";

const INPUT =
  "w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink";

export function PressEveningForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [webOrInstagram, setWebOrInstagram] = useState("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("organisation", organisation);
    fd.set("web_or_instagram", webOrInstagram);
    fd.set("note", note);
    fd.set("company_website", trap);

    try {
      const result = await submitPressEveningRequest(fd);
      if (result.ok) setStatus("done");
      else {
        setError(result.error);
        setStatus("idle");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-8 border border-rule bg-paper-green/40 p-6">
        <p className="label text-ink">Request received</p>
        <p className="mt-2 text-foreground/90 leading-relaxed">
          Thank you. The Council reviews press-evening requests individually and
          will confirm your place by email. Places are limited, so allow a few
          days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="label text-muted block mb-2">Your name</span>
          <input
            type="text"
            required
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="block">
          <span className="label text-muted block mb-2">Email</span>
          <input
            type="email"
            required
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="label text-muted block mb-2">
            Organisation or outlet
          </span>
          <input
            type="text"
            required
            value={organisation}
            autoComplete="organization"
            onChange={(e) => setOrganisation(e.target.value)}
            className={INPUT}
          />
        </label>
        <label className="block">
          <span className="label text-muted block mb-2">
            Website or Instagram handle
          </span>
          <input
            type="text"
            required
            value={webOrInstagram}
            onChange={(e) => setWebOrInstagram(e.target.value)}
            className={INPUT}
          />
        </label>
      </div>

      <label className="block">
        <span className="label text-muted block mb-2">
          What are you covering? (optional)
        </span>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${INPUT} resize-y`}
        />
      </label>

      <div aria-hidden className="hidden">
        <label>
          Company website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </label>
      </div>

      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Request press-evening access"}
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          Requests are reviewed by the European Heat Council. We use your details
          only to assess accreditation and confirm your place.
        </p>
      </div>
    </form>
  );
}
