"use client";

import { useState } from "react";
import { submitSampleRequest } from "./actions";

const INPUT =
  "w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label text-muted block mb-2">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </label>
  );
}

export function RequestSamplesForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [webOrInstagram, setWebOrInstagram] = useState("");
  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState(""); // honeypot

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
    fd.set("addr_street", street);
    fd.set("addr_postcode", postcode);
    fd.set("addr_city", city);
    fd.set("addr_country", country);
    fd.set("note", note);
    fd.set("company_website", trap);

    try {
      const result = await submitSampleRequest(fd);
      if (result.ok) {
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
      <div className="mt-8 border border-rule bg-paper-green/40 p-6">
        <p className="label text-ink">Request received</p>
        <p className="mt-2 text-foreground/90 leading-relaxed">
          Thank you. The Council will review your request and be in touch about
          a sample pack. Requests are handled individually, so allow a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          label="Your name"
          name="name"
          value={name}
          onChange={setName}
          autoComplete="name"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field
          label="Organisation or outlet"
          name="organisation"
          value={organisation}
          onChange={setOrganisation}
          autoComplete="organization"
        />
        <Field
          label="Website or Instagram handle"
          name="web_or_instagram"
          value={webOrInstagram}
          onChange={setWebOrInstagram}
        />
      </div>

      <fieldset className="border-t border-rule pt-6">
        <legend className="label text-muted mb-4">
          Shipping address (EU)
        </legend>
        <div className="space-y-6">
          <Field
            label="Street and number"
            name="addr_street"
            value={street}
            onChange={setStreet}
            autoComplete="address-line1"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field
              label="Postcode"
              name="addr_postcode"
              value={postcode}
              onChange={setPostcode}
              autoComplete="postal-code"
            />
            <Field
              label="City"
              name="addr_city"
              value={city}
              onChange={setCity}
              autoComplete="address-level2"
            />
            <Field
              label="Country"
              name="addr_country"
              value={country}
              onChange={setCountry}
              autoComplete="country-name"
            />
          </div>
        </div>
      </fieldset>

      <label className="block">
        <span className="label text-muted block mb-2">
          What are you working on? (optional)
        </span>
        <textarea
          name="note"
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`${INPUT} resize-y`}
        />
      </label>

      {/* Honeypot: hidden from real users, catches bots. */}
      <div aria-hidden className="hidden">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
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
          {status === "submitting" ? "Sending…" : "Request samples"}
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          Your details go to the European Heat Council for review before any
          samples are sent. We use them only to assess and fulfil your request.
        </p>
      </div>
    </form>
  );
}
