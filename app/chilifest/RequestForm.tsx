"use client";

import { useState } from "react";
import { submitPressRequest } from "./actions";
import type { Lang } from "@/lib/chilifest/copy";

const INPUT =
  "w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink";

const F: Record<
  Lang,
  {
    name: string;
    email: string;
    org: string;
    web: string;
    like: string;
    samplesTitle: string;
    samplesHint: string;
    pressTitle: string;
    pressHint: string;
    addr: string;
    street: string;
    postcode: string;
    city: string;
    country: string;
    working: string;
    send: string;
    sending: string;
    privacy: string;
    needOne: string;
    genErr: string;
    received: string;
    thanks: (w: string) => string;
    samplePack: string;
    pressPlace: string;
    and: string;
  }
> = {
  en: {
    name: "Your name",
    email: "Email",
    org: "Organisation or outlet",
    web: "Website or Instagram handle",
    like: "What would you like? (pick one or both)",
    samplesTitle: "Send me samples",
    samplesHint: "A curated Chili Fest sample pack, posted within the EU.",
    pressTitle: "Attend the press preview",
    pressHint: "A place at the press evening before the public days.",
    addr: "Where should we post the samples? (EU)",
    street: "Street and number",
    postcode: "Postcode",
    city: "City",
    country: "Country",
    working: "What are you working on? (optional)",
    send: "Send request",
    sending: "Sending…",
    privacy:
      "Your details go to the European Heat Council for review. We use them only to assess and fulfil your request.",
    needOne: "Tick at least one: samples, or the press preview.",
    genErr: "Something went wrong. Please try again.",
    received: "Request received",
    thanks: (w) =>
      `Thank you. You asked for ${w}. The Council reviews requests individually and will be in touch by email. Places and packs are limited, so allow a few days.`,
    samplePack: "a sample pack",
    pressPlace: "a press-preview place",
    and: " and ",
  },
  de: {
    name: "Ihr Name",
    email: "E-Mail",
    org: "Organisation oder Redaktion",
    web: "Website oder Instagram-Handle",
    like: "Was möchten Sie? (eines oder beides)",
    samplesTitle: "Muster zusenden",
    samplesHint:
      "Ein kuratiertes Chili-Fest-Musterpaket, Versand innerhalb der EU.",
    pressTitle: "Am Presse-Vorabend teilnehmen",
    pressHint: "Ein Platz am Presseabend vor den Publikumstagen.",
    addr: "Wohin sollen wir die Muster senden? (EU)",
    street: "Straße und Hausnummer",
    postcode: "PLZ",
    city: "Stadt",
    country: "Land",
    working: "Woran arbeiten Sie? (optional)",
    send: "Anfrage senden",
    sending: "Wird gesendet…",
    privacy:
      "Ihre Angaben gehen zur Prüfung an den European Heat Council. Wir nutzen sie ausschließlich, um Ihre Anfrage zu bewerten und zu erfüllen.",
    needOne: "Bitte mindestens eines ankreuzen: Muster oder Presse-Vorabend.",
    genErr: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    received: "Anfrage erhalten",
    thanks: (w) =>
      `Vielen Dank. Sie haben ${w} angefragt. Der Council prüft Anfragen individuell und meldet sich per E-Mail. Plätze und Pakete sind begrenzt, bitte rechnen Sie mit einigen Tagen.`,
    samplePack: "ein Musterpaket",
    pressPlace: "einen Platz beim Presse-Vorabend",
    and: " und ",
  },
};

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
      className={`flex items-start gap-3 text-left border-2 p-5 transition-colors ${
        checked
          ? "border-accent bg-accent text-white shadow-sm"
          : "border-accent/50 bg-accent/5 hover:border-accent hover:bg-accent/10"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 text-sm font-bold ${
          checked ? "border-white bg-white text-accent" : "border-accent bg-white text-accent"
        }`}
        aria-hidden
      >
        {checked ? "✓" : ""}
      </span>
      <span>
        <span
          className={`block text-base font-semibold ${checked ? "text-white" : "text-ink"}`}
        >
          {title}
        </span>
        <span
          className={`block text-xs mt-0.5 ${checked ? "text-white/85" : "text-muted"}`}
        >
          {hint}
        </span>
      </span>
    </button>
  );
}

export function RequestForm({ lang = "en" }: { lang?: Lang }) {
  const f = F[lang];
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
      setError(f.needOne);
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
            wantsSamples ? f.samplePack : null,
            wantsPressEvening ? f.pressPlace : null,
          ]
            .filter(Boolean)
            .join(f.and),
        );
        setStatus("done");
      } else {
        setError(result.error);
        setStatus("idle");
      }
    } catch {
      setError(f.genErr);
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-8 border border-rule bg-paper-green/40 p-6 max-w-2xl">
        <p className="label text-ink">{f.received}</p>
        <p className="mt-2 text-foreground/90 leading-relaxed">
          {f.thanks(doneWants)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="label text-muted block mb-2">{f.name}</span>
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
          <span className="label text-muted block mb-2">{f.email}</span>
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
          <span className="label text-muted block mb-2">{f.org}</span>
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
          <span className="label text-muted block mb-2">{f.web}</span>
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
        <legend className="label text-muted mb-3">{f.like}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Toggle
            checked={wantsSamples}
            onChange={setWantsSamples}
            title={f.samplesTitle}
            hint={f.samplesHint}
          />
          <Toggle
            checked={wantsPressEvening}
            onChange={setWantsPressEvening}
            title={f.pressTitle}
            hint={f.pressHint}
          />
        </div>
      </fieldset>

      {wantsSamples ? (
        <fieldset className="border-t border-rule pt-6">
          <legend className="label text-muted mb-4">{f.addr}</legend>
          <div className="space-y-6">
            <label className="block">
              <span className="label text-muted block mb-2">{f.street}</span>
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
                <span className="label text-muted block mb-2">
                  {f.postcode}
                </span>
                <input
                  type="text"
                  value={postcode}
                  autoComplete="postal-code"
                  onChange={(e) => setPostcode(e.target.value)}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className="label text-muted block mb-2">{f.city}</span>
                <input
                  type="text"
                  value={city}
                  autoComplete="address-level2"
                  onChange={(e) => setCity(e.target.value)}
                  className={INPUT}
                />
              </label>
              <label className="block">
                <span className="label text-muted block mb-2">{f.country}</span>
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
        <span className="label text-muted block mb-2">{f.working}</span>
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
          {status === "submitting" ? f.sending : f.send}
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          {f.privacy}
        </p>
      </div>
    </form>
  );
}
