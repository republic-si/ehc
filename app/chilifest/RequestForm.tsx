"use client";

import { useEffect, useRef, useState } from "react";
import { startRequest, updateRequest, completeRequest } from "./actions";
import type { Lang } from "@/lib/chilifest/copy";
import type { RequestRole } from "@/lib/sample-requests";

// Pass-first, Typeform-style request flow. Built to work on every device, every
// time:
//   - saves progressively (name+email committed on step 1, so a lead is never
//     lost), and RE-SENDS the whole record on the final confirm so the stored
//     row is correct even if an intermediate save dropped on a flaky network;
//   - every server call is retried with backoff;
//   - id/editToken/answers persist to sessionStorage, so an accidental refresh
//     resumes the flow instead of orphaning it;
//   - mobile-first: 16px+ inputs (no iOS zoom), big tap targets, no hover-only
//     controls, buttons disabled while in flight to block double taps.

type Step = "contact" | "role" | "offer" | "done";
const STORAGE_KEY = "chilifest_request_v1";

const INPUT =
  "w-full rounded-lg border border-rule bg-white px-4 py-3 text-base text-ink " +
  "focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/20";

// Retry thrown (network) errors a few times; validation results ({ok:false})
// are returned straight through and NOT retried.
async function callWithRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw lastErr;
}

const F: Record<
  Lang,
  {
    stepOf: (n: number, total: number) => string;
    back: string;
    genErr: string;
    working: string;
    s1Title: string;
    s1Sub: string;
    name: string;
    email: string;
    cont: string;
    s2Title: string;
    s2Sub: string;
    rolePress: string;
    roleInfluencer: string;
    roleTrade: string;
    passReserved: (name: string) => string;
    s3TradeBody: string;
    s3PIBody: string;
    samplesTitle: string;
    samplesHint: string;
    confirm: string;
    doneTitle: (name: string) => string;
    doneBody: string;
    optional: string;
    addrTitle: string;
    street: string;
    postcode: string;
    city: string;
    country: string;
    emailsTitle: string;
    emailsHint: string;
    guestEmail: (n: number) => string;
    save: string;
    saved: string;
    privacy: string;
    ctx: (m: string) => string;
  }
> = {
  en: {
    stepOf: (n, total) => `Step ${n} of ${total}`,
    back: "Back",
    genErr: "Something went wrong. Please check your connection and try again.",
    working: "Saving…",
    s1Title: "Get your industry pass",
    s1Sub: "Berlin Chili Fest industry preview. Start with your name and email.",
    name: "Your name",
    email: "Email",
    cont: "Continue",
    s2Title: "Who are you?",
    s2Sub: "So we send you the right things.",
    rolePress: "Press",
    roleInfluencer: "Influencer / Creator",
    roleTrade: "Trade / Buyer",
    passReserved: (name) =>
      name ? `${name}, your industry pass is reserved.` : "Your industry pass is reserved.",
    s3TradeBody:
      "You are on the list for the industry preview, before the public doors. After this you can add colleagues who are coming with you.",
    s3PIBody:
      "You are on the list for the industry preview. Want a sample box posted to you before the fest?",
    samplesTitle: "Yes, send me a sample box",
    samplesHint: "A curated Chili Fest sample pack, posted within the EU.",
    confirm: "Confirm my pass",
    doneTitle: (name) =>
      name ? `You are on the list, ${name}.` : "You are on the list.",
    doneBody:
      "We will be in touch by email with your pass details. One quick optional thing below to speed it up.",
    optional: "Optional. We will email you if we need it.",
    addrTitle: "Where should we post the sample box? (EU)",
    street: "Street and number",
    postcode: "Postcode",
    city: "City",
    country: "Country",
    emailsTitle: "Bringing colleagues?",
    emailsHint: "Add up to 5 emails and we will put them on the list too.",
    guestEmail: (n) => `Colleague ${n} email`,
    save: "Save details",
    saved: "Saved. Thank you.",
    privacy:
      "Your details go to the European Heat Council to arrange your pass. We use them only for that.",
    ctx: (m) => `Regarding ${m}`,
  },
  de: {
    stepOf: (n, total) => `Schritt ${n} von ${total}`,
    back: "Zurück",
    genErr:
      "Etwas ist schiefgelaufen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    working: "Wird gespeichert…",
    s1Title: "Sichern Sie sich Ihren Fachbesucher-Pass",
    s1Sub: "Berlin Chili Fest Fachvorschau. Beginnen Sie mit Name und E-Mail.",
    name: "Ihr Name",
    email: "E-Mail",
    cont: "Weiter",
    s2Title: "Wer sind Sie?",
    s2Sub: "Damit wir Ihnen das Richtige senden.",
    rolePress: "Presse",
    roleInfluencer: "Influencer / Creator",
    roleTrade: "Handel / Einkauf",
    passReserved: (name) =>
      name
        ? `${name}, Ihr Fachbesucher-Pass ist reserviert.`
        : "Ihr Fachbesucher-Pass ist reserviert.",
    s3TradeBody:
      "Sie stehen auf der Liste für die Fachvorschau, vor dem Publikumseinlass. Danach können Sie Kolleginnen und Kollegen hinzufügen, die mitkommen.",
    s3PIBody:
      "Sie stehen auf der Liste für die Fachvorschau. Möchten Sie vorab ein Musterpaket zugeschickt bekommen?",
    samplesTitle: "Ja, senden Sie mir ein Musterpaket",
    samplesHint:
      "Ein kuratiertes Chili-Fest-Musterpaket, Versand innerhalb der EU.",
    confirm: "Pass bestätigen",
    doneTitle: (name) =>
      name ? `Sie stehen auf der Liste, ${name}.` : "Sie stehen auf der Liste.",
    doneBody:
      "Wir melden uns per E-Mail mit Ihren Pass-Details. Eine kurze optionale Angabe unten beschleunigt es.",
    optional: "Optional. Wir melden uns per E-Mail, falls nötig.",
    addrTitle: "Wohin sollen wir das Musterpaket senden? (EU)",
    street: "Straße und Hausnummer",
    postcode: "PLZ",
    city: "Stadt",
    country: "Land",
    emailsTitle: "Bringen Sie Kolleginnen und Kollegen mit?",
    emailsHint:
      "Fügen Sie bis zu 5 E-Mails hinzu und wir setzen sie ebenfalls auf die Liste.",
    guestEmail: (n) => `E-Mail Kollege/in ${n}`,
    save: "Angaben speichern",
    saved: "Gespeichert. Vielen Dank.",
    privacy:
      "Ihre Angaben gehen an den European Heat Council, um Ihren Pass zu organisieren. Wir nutzen sie ausschließlich dafür.",
    ctx: (m) => `Betrifft ${m}`,
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RequestForm({ lang = "en" }: { lang?: Lang }) {
  const f = F[lang];

  const [step, setStep] = useState<Step>("contact");
  const [id, setId] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RequestRole | null>(null);
  const [wantsSamples, setWantsSamples] = useState(false);
  const [maker, setMaker] = useState<string | null>(null);
  const [trap, setTrap] = useState("");

  const [street, setStreet] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [guests, setGuests] = useState<string[]>(["", "", "", "", ""]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedExtra, setSavedExtra] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // Rehydrate an in-progress flow after an accidental refresh, and read the
  // ?maker deep link for context.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.id && s.editToken && s.step && s.step !== "done") {
          setId(s.id);
          setEditToken(s.editToken);
          setName(s.name ?? "");
          setEmail(s.email ?? "");
          setRole(s.role ?? null);
          setWantsSamples(Boolean(s.wantsSamples));
          setStep(s.step);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    const p = new URLSearchParams(window.location.search);
    const m = p.get("maker");
    if (m) setMaker(m);
    hydrated.current = true;
  }, []);

  // Persist core progress so a reload can resume it. Never persist enrichment
  // (address/guests) — those are entered on the final screen only.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (id && editToken && step !== "done") {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ id, editToken, step, name, email, role, wantsSamples }),
        );
      } else if (step === "done") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage may be unavailable (private mode) — flow still works in-memory */
    }
  }, [id, editToken, step, name, email, role, wantsSamples]);

  function goto(next: Step) {
    setError(null);
    setStep(next);
    // Scroll the card into view on small screens where steps differ in height.
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  }

  function fd(entries: Record<string, string>): FormData {
    const form = new FormData();
    for (const [k, v] of Object.entries(entries)) form.set(k, v);
    return form;
  }

  // Step 1 -> commit name+email, get id + edit_token.
  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !EMAIL_RE.test(email.trim())) return setError(f.genErr);
    setBusy(true);
    try {
      const res = await callWithRetry(() =>
        startRequest(
          fd({
            name: name.trim(),
            email: email.trim(),
            maker: maker ?? "",
            company_website: trap,
          }),
        ),
      );
      if (!res.ok) {
        setError(res.error);
      } else {
        setId(res.id);
        setEditToken(res.editToken);
        goto("role");
      }
    } catch {
      setError(f.genErr);
    } finally {
      setBusy(false);
    }
  }

  // Step 2 -> record role (best-effort background patch; re-sent authoritatively
  // at confirm) and advance immediately so the UI never stalls on the network.
  function chooseRole(next: RequestRole) {
    setRole(next);
    if (next === "trade") setWantsSamples(false);
    if (id && editToken) {
      void updateRequest(fd({ id, edit_token: editToken, role: next })).catch(
        () => {},
      );
    }
    goto("offer");
  }

  // Step 3 -> authoritative save of the full record, then mark complete. Retried
  // so a flaky connection can't leave a half-saved row.
  async function confirmOffer() {
    if (!id || !editToken) return setError(f.genErr);
    setBusy(true);
    setError(null);
    try {
      const upd = await callWithRetry(() =>
        updateRequest(
          fd({
            id,
            edit_token: editToken,
            role: role ?? "",
            wants_press_evening: "on",
            wants_samples: wantsSamples ? "on" : "",
          }),
        ),
      );
      if (!upd.ok) {
        setError(upd.error);
        return;
      }
      const done = await callWithRetry(() =>
        completeRequest(fd({ id, edit_token: editToken })),
      );
      if (!done.ok) {
        setError(done.error);
        return;
      }
      goto("done");
    } catch {
      setError(f.genErr);
    } finally {
      setBusy(false);
    }
  }

  // Final screen -> optional enrichment (address for samples, else guest emails).
  async function saveExtra() {
    if (!id || !editToken) return;
    setBusy(true);
    setError(null);
    try {
      const entries: Record<string, string> = { id, edit_token: editToken };
      if (wantsSamples) {
        entries.addr_street = street.trim();
        entries.addr_postcode = postcode.trim();
        entries.addr_city = city.trim();
        entries.addr_country = country.trim();
      } else {
        entries.extra_emails = JSON.stringify(
          guests.map((g) => g.trim()).filter(Boolean),
        );
      }
      const res = await callWithRetry(() => updateRequest(fd(entries)));
      if (!res.ok) setError(res.error);
      else setSavedExtra(true);
    } catch {
      setError(f.genErr);
    } finally {
      setBusy(false);
    }
  }

  const STEP_INDEX: Record<Step, number> = {
    contact: 1,
    role: 2,
    offer: 3,
    done: 4,
  };
  const totalSteps = 3;

  const errorBox = error ? (
    <div className="mt-4 rounded-lg border border-accent/40 bg-accent/5 px-4 py-3">
      <p className="text-sm text-accent" role="alert">
        {error}
      </p>
    </div>
  ) : null;

  return (
    <div ref={topRef} className="mt-8 w-full max-w-xl">
      {/* progress */}
      {step !== "done" ? (
        <div className="mb-5 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                n <= STEP_INDEX[step] ? "bg-accent" : "bg-rule"
              }`}
            />
          ))}
        </div>
      ) : null}

      {maker && step === "contact" ? (
        <p className="mb-4 rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-sm font-medium text-ink">
          {f.ctx(maker)}
        </p>
      ) : null}

      {/* STEP 1 — name + email */}
      {step === "contact" ? (
        <form onSubmit={submitContact} className="space-y-5" noValidate>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-ink">
              {f.s1Title}
            </h3>
            <p className="mt-1 text-sm text-muted">{f.s1Sub}</p>
          </div>
          <label className="block">
            <span className="label mb-2 block text-muted">{f.name}</span>
            <input
              type="text"
              required
              autoComplete="name"
              autoCapitalize="words"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
            />
          </label>
          <label className="block">
            <span className="label mb-2 block text-muted">{f.email}</span>
            <input
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
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
          {errorBox}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-ink-deep disabled:opacity-60 sm:w-auto"
          >
            {busy ? f.working : f.cont}
          </button>
          <p className="text-xs leading-relaxed text-muted-soft">{f.privacy}</p>
        </form>
      ) : null}

      {/* STEP 2 — role */}
      {step === "role" ? (
        <div className="space-y-5">
          <div>
            <span className="label text-muted-soft">
              {f.stepOf(2, totalSteps)}
            </span>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {f.s2Title}
            </h3>
            <p className="mt-1 text-sm text-muted">{f.s2Sub}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(
              [
                ["press", f.rolePress],
                ["influencer", f.roleInfluencer],
                ["trade", f.roleTrade],
              ] as [RequestRole, string][]
            ).map(([value, labelText]) => (
              <button
                key={value}
                type="button"
                disabled={busy}
                onClick={() => chooseRole(value)}
                className="flex items-center justify-between rounded-lg border-2 border-accent/50 bg-accent/5 px-5 py-4 text-left text-base font-semibold text-ink transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-60"
              >
                {labelText}
                <span aria-hidden className="text-accent">
                  →
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goto("contact")}
            className="text-sm text-muted underline underline-offset-4 hover:text-ink"
          >
            {f.back}
          </button>
        </div>
      ) : null}

      {/* STEP 3 — offer */}
      {step === "offer" ? (
        <div className="space-y-5">
          <div>
            <span className="label text-muted-soft">
              {f.stepOf(3, totalSteps)}
            </span>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">
              {f.passReserved(name)}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {role === "trade" ? f.s3TradeBody : f.s3PIBody}
            </p>
          </div>

          {role !== "trade" ? (
            <button
              type="button"
              onClick={() => setWantsSamples((v) => !v)}
              aria-pressed={wantsSamples}
              className={`flex w-full items-start gap-3 rounded-lg border-2 p-5 text-left transition-colors ${
                wantsSamples
                  ? "border-accent bg-accent text-white"
                  : "border-accent/50 bg-accent/5 hover:border-accent hover:bg-accent/10"
              }`}
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 text-sm font-bold ${
                  wantsSamples
                    ? "border-white bg-white text-accent"
                    : "border-accent bg-white text-accent"
                }`}
                aria-hidden
              >
                {wantsSamples ? "✓" : ""}
              </span>
              <span>
                <span
                  className={`block text-base font-semibold ${wantsSamples ? "text-white" : "text-ink"}`}
                >
                  {f.samplesTitle}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${wantsSamples ? "text-white/85" : "text-muted"}`}
                >
                  {f.samplesHint}
                </span>
              </span>
            </button>
          ) : null}

          {errorBox}

          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <button
              type="button"
              disabled={busy}
              onClick={confirmOffer}
              className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-ink-deep disabled:opacity-60 sm:w-auto"
            >
              {busy ? f.working : f.confirm}
            </button>
            <button
              type="button"
              onClick={() => goto("role")}
              className="text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              {f.back}
            </button>
          </div>
        </div>
      ) : null}

      {/* DONE — success + optional enrichment */}
      {step === "done" ? (
        <div className="space-y-5">
          <div className="rounded-lg border border-rule bg-paper-green/40 p-6">
            <p className="label text-ink">{f.doneTitle(name)}</p>
            <p className="mt-2 leading-relaxed text-foreground/90">{f.doneBody}</p>
          </div>

          {savedExtra ? (
            <p className="rounded-lg border border-rule bg-paper-green/40 px-4 py-3 text-sm font-medium text-ink">
              {f.saved}
            </p>
          ) : (
            <div className="space-y-4">
              {wantsSamples ? (
                <fieldset className="space-y-4">
                  <legend className="label mb-1 text-muted">{f.addrTitle}</legend>
                  <input
                    type="text"
                    placeholder={f.street}
                    autoComplete="address-line1"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className={INPUT}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder={f.postcode}
                      autoComplete="postal-code"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className={INPUT}
                    />
                    <input
                      type="text"
                      placeholder={f.city}
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={INPUT}
                    />
                    <input
                      type="text"
                      placeholder={f.country}
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={INPUT}
                    />
                  </div>
                </fieldset>
              ) : (
                <fieldset className="space-y-3">
                  <legend className="label text-muted">{f.emailsTitle}</legend>
                  <p className="text-xs text-muted">{f.emailsHint}</p>
                  {guests.map((g, i) => (
                    <input
                      key={i}
                      type="email"
                      inputMode="email"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder={f.guestEmail(i + 1)}
                      value={g}
                      onChange={(e) =>
                        setGuests((prev) => {
                          const next = [...prev];
                          next[i] = e.target.value;
                          return next;
                        })
                      }
                      className={INPUT}
                    />
                  ))}
                </fieldset>
              )}

              {errorBox}

              <button
                type="button"
                disabled={busy}
                onClick={saveExtra}
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-ink-deep disabled:opacity-60 sm:w-auto"
              >
                {busy ? f.working : f.save}
              </button>
              <p className="text-xs leading-relaxed text-muted-soft">
                {f.optional}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
