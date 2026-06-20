"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TOPICS = [
  "Membership",
  "Press",
  "Event coordination",
  "Corrections",
  "Other",
] as const;

type Topic = (typeof TOPICS)[number];

function normaliseTopic(raw: string | null): Topic {
  if (!raw) return "Press";
  const match = TOPICS.find(
    (t) => t.toLowerCase() === raw.toLowerCase(),
  );
  return match ?? "Press";
}

export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = normaliseTopic(params.get("topic"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTopic(normaliseTopic(params.get("topic")));
  }, [params]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const subject = `[${topic}] ${name.trim()}`;
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      organisation.trim() ? `Organisation: ${organisation.trim()}` : null,
      "",
      message.trim(),
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    window.location.href = `mailto:simon@republicofheat.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="label text-muted block mb-2">Your name</span>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="label text-muted block mb-2">Email</span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink"
          />
        </label>
      </div>

      <label className="block">
        <span className="label text-muted block mb-2">
          Producer or organisation (optional)
        </span>
        <input
          type="text"
          name="organisation"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          className="w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="label text-muted block mb-2">Topic</span>
        <select
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as Topic)}
          className="w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink"
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="label text-muted block mb-2">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-rule px-3 py-2 text-sm bg-white text-ink focus:outline-none focus:border-ink resize-y"
        />
      </label>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center px-6 py-3 rounded-full bg-ink text-white text-sm font-medium tracking-wide hover:bg-ink-deep transition-colors"
        >
          Send
        </button>
        <p className="mt-4 text-xs text-muted-soft leading-relaxed">
          Submitting opens your mail client with the message pre-filled. The
          Council does not store form submissions.
        </p>
      </div>
    </form>
  );
}
