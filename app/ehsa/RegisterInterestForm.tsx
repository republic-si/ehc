"use client";

import { useRef, useState } from "react";
import { registerInterest } from "./actions";
import type { Lang } from "@/lib/ehsa/copy";
import type { InterestRole } from "@/lib/ehsa/interest";

// Typeform-style register-interest flow, adapted from the Chili Fest request
// form but simpler: no samples, no address, no guests. Three steps, one
// authoritative submit at the end. Mobile-first (16px inputs, big tap targets,
// buttons disabled while in flight). Retries the final submit on flaky networks.

type Step = "contact" | "role" | "note" | "done";

const INPUT =
  "w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base text-[#0c0c0c] " +
  "focus:outline-none focus:border-[#0c0c0c] focus:ring-2 focus:ring-[#0c0c0c]/15";
const BTN =
  "inline-flex w-full items-center justify-center rounded-full bg-[#0c0c0c] px-6 py-3.5 " +
  "text-base font-semibold text-white transition-colors hover:bg-black disabled:opacity-60 sm:w-auto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface Strings {
  stepOf: (n: number, total: number) => string;
  back: string;
  cont: string;
  working: string;
  genErr: string;
  s1Sub: string;
  name: string;
  email: string;
  org: string;
  s2Title: string;
  s2Sub: string;
  roles: [InterestRole, string][];
  s3Title: string;
  s3Sub: string;
  notePh: string;
  submit: string;
  doneTitle: string;
  doneBody: string;
  privacy: string;
}

const F: Record<Lang, Strings> = {
  en: {
    stepOf: (n, total) => `Step ${n} of ${total}`,
    back: "Back",
    cont: "Continue",
    working: "Saving…",
    genErr: "Something went wrong. Please check your connection and try again.",
    s1Sub: "Start with your name and email.",
    name: "Your name",
    email: "Email",
    org: "Outlet or organisation (optional)",
    s2Title: "Who are you?",
    s2Sub: "So we send you the right things.",
    roles: [
      ["press", "Journalist / Editor"],
      ["influencer", "Influencer / Creator"],
      ["trade", "Trade / Buyer"],
    ],
    s3Title: "Anything to add?",
    s3Sub: "Optional. Tell us how you would like to be involved.",
    notePh: "A line or two (optional)",
    submit: "Register my interest",
    doneTitle: "You are on the list.",
    doneBody:
      "Thanks. We will be in touch by email as the 2027 dates, venue and programme are confirmed.",
    privacy:
      "Your details go to the European Heat Council for EHSA 2027. We use them only for that.",
  },
  de: {
    stepOf: (n, total) => `Schritt ${n} von ${total}`,
    back: "Zurück",
    cont: "Weiter",
    working: "Wird gespeichert…",
    genErr:
      "Etwas ist schiefgelaufen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    s1Sub: "Beginnen Sie mit Name und E-Mail.",
    name: "Ihr Name",
    email: "E-Mail",
    org: "Medium oder Organisation (optional)",
    s2Title: "Wer sind Sie?",
    s2Sub: "Damit wir Ihnen das Richtige senden.",
    roles: [
      ["press", "Journalist / Redakteur"],
      ["influencer", "Influencer / Creator"],
      ["trade", "Handel / Einkauf"],
    ],
    s3Title: "Noch etwas?",
    s3Sub: "Optional. Sagen Sie uns, wie Sie dabei sein möchten.",
    notePh: "Ein, zwei Zeilen (optional)",
    submit: "Interesse anmelden",
    doneTitle: "Sie stehen auf der Liste.",
    doneBody:
      "Danke. Wir melden uns per E-Mail, sobald Termine, Ort und Programm 2027 feststehen.",
    privacy:
      "Ihre Angaben gehen an den European Heat Council für EHSA 2027. Wir nutzen sie ausschließlich dafür.",
  },
};

const STEP_INDEX: Record<Step, number> = { contact: 1, role: 2, note: 3, done: 4 };
const TOTAL = 3;

export function RegisterInterestForm({ lang = "en" }: { lang?: Lang }) {
  const f = F[lang];

  const [step, setStep] = useState<Step>("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [role, setRole] = useState<InterestRole | "">("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  function goto(next: Step) {
    setError(null);
    setStep(next);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }),
    );
  }

  function submitContact(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !EMAIL_RE.test(email.trim())) return setError(f.genErr);
    goto("role");
  }

  function chooseRole(next: InterestRole) {
    setRole(next);
    goto("note");
  }

  async function submitFinal() {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("name", name.trim());
      form.set("email", email.trim());
      form.set("organisation", organisation.trim());
      form.set("role", role);
      form.set("note", note.trim());
      form.set("company_website", trap);
      const res = await callWithRetry(() => registerInterest(form));
      if (!res.ok) setError(res.error);
      else goto("done");
    } catch {
      setError(f.genErr);
    } finally {
      setBusy(false);
    }
  }

  const errorBox = error ? (
    <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
      <p className="text-sm text-red-700" role="alert">
        {error}
      </p>
    </div>
  ) : null;

  return (
    <div ref={topRef} className="w-full">
      {step !== "done" ? (
        <div className="mb-5 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: n <= STEP_INDEX[step] ? "#0c0c0c" : "#e6e2d6" }}
            />
          ))}
        </div>
      ) : null}

      {/* STEP 1 — name + email + optional organisation */}
      {step === "contact" ? (
        <form onSubmit={submitContact} className="space-y-5" noValidate>
          <p className="text-sm text-black/60">{f.s1Sub}</p>
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
              {f.name}
            </span>
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
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
              {f.email}
            </span>
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
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/50">
              {f.org}
            </span>
            <input
              type="text"
              autoComplete="organization"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
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
          <button type="submit" className={BTN}>
            {f.cont}
          </button>
          <p className="text-xs leading-relaxed text-black/50">{f.privacy}</p>
        </form>
      ) : null}

      {/* STEP 2 — role */}
      {step === "role" ? (
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-black/40">
              {f.stepOf(2, TOTAL)}
            </span>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#0c0c0c]">
              {f.s2Title}
            </h3>
            <p className="mt-1 text-sm text-black/60">{f.s2Sub}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {f.roles.map(([value, labelText]) => (
              <button
                key={value}
                type="button"
                onClick={() => chooseRole(value)}
                className="flex items-center justify-between rounded-lg border-2 border-black/15 bg-white px-5 py-4 text-left text-base font-semibold text-[#0c0c0c] transition-colors hover:border-[#0c0c0c]"
              >
                {labelText}
                <span aria-hidden>→</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goto("contact")}
            className="text-sm text-black/60 underline underline-offset-4 hover:text-[#0c0c0c]"
          >
            {f.back}
          </button>
        </div>
      ) : null}

      {/* STEP 3 — optional note + submit */}
      {step === "note" ? (
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-black/40">
              {f.stepOf(3, TOTAL)}
            </span>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[#0c0c0c]">
              {f.s3Title}
            </h3>
            <p className="mt-1 text-sm text-black/60">{f.s3Sub}</p>
          </div>
          <textarea
            rows={4}
            placeholder={f.notePh}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={INPUT}
          />
          {errorBox}
          <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <button
              type="button"
              disabled={busy}
              onClick={submitFinal}
              className={BTN}
            >
              {busy ? f.working : f.submit}
            </button>
            <button
              type="button"
              onClick={() => goto("role")}
              className="text-sm text-black/60 underline underline-offset-4 hover:text-[#0c0c0c]"
            >
              {f.back}
            </button>
          </div>
        </div>
      ) : null}

      {/* DONE */}
      {step === "done" ? (
        <div className="rounded-lg border-2 border-[#0c0c0c] bg-[#f5c518] p-6">
          <p className="text-lg font-bold text-[#0c0c0c]">{f.doneTitle}</p>
          <p className="mt-2 leading-relaxed text-[#0c0c0c]/85">{f.doneBody}</p>
        </div>
      ) : null}
    </div>
  );
}
