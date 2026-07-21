"use client";

import { useState } from "react";
import { contactProducer } from "./actions";
import type { Lang } from "@/lib/chilifest/copy";

const INPUT =
  "w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink";

const F: Record<
  Lang,
  {
    heading: (m: string) => string;
    intro: (m: string) => string;
    name: string;
    email: string;
    org: string;
    web: string;
    message: string;
    messagePlaceholder: (m: string) => string;
    send: (m: string) => string;
    sending: string;
    privacy: string;
    genErr: string;
    received: string;
    thanks: (m: string) => string;
  }
> = {
  en: {
    heading: (m) => `Contact ${m} directly`,
    intro: (m) =>
      `Send a message straight to ${m}. It goes to the producer's own inbox, with the Berlin Chili Fest press office copied. They reply to you directly.`,
    name: "Your name",
    email: "Email",
    org: "Organisation or outlet",
    web: "Website or Instagram handle (optional)",
    message: "Your message",
    messagePlaceholder: (m) =>
      `Introduce yourself and what you're working on, and what you'd like from ${m}.`,
    send: (m) => `Send to ${m}`,
    sending: "Sending…",
    privacy:
      "Your message is sent to the producer and copied to the Berlin Chili Fest press office (Simon and Neil). We use your details only to pass on and follow up your enquiry.",
    genErr: "Something went wrong. Please try again.",
    received: "Message sent",
    thanks: (m) =>
      `Thank you. Your message is on its way to ${m}, and the press office is copied. They'll reply to you by email.`,
  },
  de: {
    heading: (m) => `${m} direkt kontaktieren`,
    intro: (m) =>
      `Schreiben Sie direkt an ${m}. Ihre Nachricht geht an den Posteingang des Produzenten, das Pressebüro des Berlin Chili Fest ist in Kopie. Die Antwort kommt direkt an Sie.`,
    name: "Ihr Name",
    email: "E-Mail",
    org: "Organisation oder Redaktion",
    web: "Website oder Instagram-Handle (optional)",
    message: "Ihre Nachricht",
    messagePlaceholder: (m) =>
      `Stellen Sie sich kurz vor, woran Sie arbeiten und was Sie von ${m} möchten.`,
    send: (m) => `An ${m} senden`,
    sending: "Wird gesendet…",
    privacy:
      "Ihre Nachricht geht an den Produzenten, in Kopie an das Pressebüro des Berlin Chili Fest (Simon und Neil). Wir nutzen Ihre Angaben ausschließlich, um Ihre Anfrage weiterzuleiten und nachzufassen.",
    genErr: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    received: "Nachricht gesendet",
    thanks: (m) =>
      `Vielen Dank. Ihre Nachricht ist auf dem Weg zu ${m}, das Pressebüro ist in Kopie. Die Antwort kommt per E-Mail zu Ihnen.`,
  },
};

export function ProducerContactForm({
  makerId,
  makerName,
  lang = "en",
}: {
  makerId: string;
  makerName: string;
  lang?: Lang;
}) {
  const f = F[lang];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [webOrInstagram, setWebOrInstagram] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const fd = new FormData();
    fd.set("maker_id", makerId);
    fd.set("maker_name", makerName);
    fd.set("name", name);
    fd.set("email", email);
    fd.set("organisation", organisation);
    fd.set("web_or_instagram", webOrInstagram);
    fd.set("message", message);
    fd.set("company_website", trap);

    try {
      const result = await contactProducer(fd);
      if (result.ok) {
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
      <div className="border border-accent/40 bg-accent/5 p-6">
        <p className="label text-ink">{f.received}</p>
        <p className="mt-2 text-foreground/90 leading-relaxed">
          {f.thanks(makerName)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="label text-accent">{f.heading(makerName)}</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {f.intro(makerName)}
        </p>
      </div>

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
            value={webOrInstagram}
            onChange={(e) => setWebOrInstagram(e.target.value)}
            className={INPUT}
          />
        </label>
      </div>

      <label className="block">
        <span className="label text-muted block mb-2">{f.message}</span>
        <textarea
          required
          rows={5}
          value={message}
          placeholder={f.messagePlaceholder(makerName)}
          onChange={(e) => setMessage(e.target.value)}
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

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? f.sending : f.send(makerName)}
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          {f.privacy}
        </p>
      </div>
    </form>
  );
}
