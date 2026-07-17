"use client";

import { useState } from "react";
import { submitPressRequest } from "./actions";

const INPUT =
  "w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink";

function Toggle({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={`flex items-start gap-3 text-left border p-4 transition-colors ${
        checked
          ? "border-ink bg-paper-green/50"
          : "border-rule bg-white hover:border-ink/40"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border ${
          checked ? "border-ink bg-ink text-white" : "border-rule bg-white"
        }`}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
      <span>
        <span className="block text-sm font-medium text-ink">{title}</span>
        <span className="block text-xs text-muted mt-0.5">{hint}</span>
      </span>
    </button>
  );
}

export function RequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [webOrInstagram, setWebOrInstagram] = useState("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState("");

  const [wantsSamples, setWantsSamples] = useState(false);
  const [wantsPressEvening, setWantsPressEvening] = useState(false);

  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [doneWants, setDoneWants] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!wantsSamples && !wantsPressEvening) {
      setError("Tick at least one: samples, or the press preview.");
      return;
    }
    setStatus("submitting");

    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("organisation", organisation);
    fd.set("web_or_instagram", webOrInstagram);
    fd.set("note", note);
    fd.set("company_website", trap);
    fd.set("wants_samples", wantsSamples ? "on" : "");
    fd.set("wants_press_evening", wantsPressEvening ? "on" : "");
    if (wantsSamples) {
      fd.set("addr_street", street);
      fd.set("addr_postcode", postcode);
      fd.set("addr_city", city);
      fd.set("addr_country", country);
    }

    try {
      const result = await submitPressRequest(fd);
      if (result.ok) {
        setDoneWants(
          [
            wantsSamples ? "a sample pack" : null,
            wantsPressEvening ? "a press-preview place" : null,
          ]
            .filter(Boolean)
            .join(" and "),
        );
        setStatus("done");
      } else {
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
      <div className="mt-8 border border-rule bg-paper-green/40 p-6 max-w-2xl">
        <p className="label text-ink">Request received</p>
        <p className="mt-2 text-foreground/90 leading-relaxed">
          Thank you. You asked for {doneWants}. The Council reviews requests
          individually and will be in touch by email. Places and packs are
          limited, so allow a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
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

      <fieldset>
        <legend className="label text-muted mb-3">
          What would you like? (pick one or both)
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle
            checked={wantsSamples}
            onChange={setWantsSamples}
            title="Send me samples"
            hint="A curated Chili Fest sample pack, posted within the EU."
          />
          <Toggle
            checked={wantsPressEvening}
            onChange={setWantsPressEvening}
            title="Attend the press preview"
            hint="A place at the press evening before the public days."
          />
        </div>
      </fieldset>

      {wantsSamples ? (
        <fieldset className="border-t border-rule pt-6">
          <legend className="label text-muted mb-4">
            Where should we post the samples? (EU)
          </legend>
          <div className="space-y-6">
            <label className="block">
              <span className="label text-muted block mb-2">
                Street and number
              </span>
              <input
                type="text"
                value={street}
                autoComplete="address-line1"
                onChange={(e) => setStreet(e.target.value)}
                className={INPUT}
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <label className="block">
                <span className="label text-muted block mb-2">Postcode</span>
                <input
                  type="text"
                  value={postcode}
                  autoComplete="postal-code"
                  onChange={(e) => setPostcode(e.target.value)}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className="label text-muted block mb-2">City</span>
                <input
                  type="text"
                  value={city}
                  autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className="label text-muted block mb-2">Country</span>
                <input
                  type="text"
                  value={country}
                  autoComplete="country-name"
                  onChange={(e) => setCountry(e.target.value)}
                  className={INPUT}
                />
              </label>
            </div>
          </div>
        </fieldset>
      ) : null}

      <label className="block">
        <span className="label text-muted block mb-2">
          What are you working on? (optional)
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
          {status === "submitting" ? "Sending…" : "Send request"}
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          Your details go to the European Heat Council for review. We use them
          only to assess and fulfil your request.
        </p>
      </div>
    </form>
  );
}
