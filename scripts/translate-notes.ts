// Batch-translate event notes to English using Claude Haiku.
// Reads events where notes_en = notes (untranslated copies from the A2 backfill)
// and updates notes_en with English translations.
//
// Re-runnable: only touches rows where notes_en still equals notes.
// Requires ANTHROPIC_API_KEY in env.

import Anthropic from "@anthropic-ai/sdk";
import { sql } from "../db/client.ts";

const MODEL = "claude-haiku-4-5";
const BATCH_SIZE = 20;

const SYSTEM = `You translate event organiser notes (mostly for German market/festival events) to natural English.

Rules:
- Translate from German, Italian, Spanish, Dutch, or any language to English.
- If a note is already English, return it unchanged.
- Preserve event-specific terms verbatim where there's no clean English equivalent: Standgebühr, Anmeldeschluss, Gewerbeschein, Wochenmarkt, Marktbeschicker, Krämermarkt, Standmiete, Hütte, Schausteller.
- Preserve URLs, email addresses, ISO dates (YYYY-MM-DD), bracketed tags like [2026-06-18], and pipe-separated key=value tokens.
- Keep tone factual and brief. Don't pad, soften, or paraphrase.
- Output ONLY a JSON array of strings, one translation per input note, in the same order. No commentary, no markdown fences.`;

const client = new Anthropic();

async function translateBatch(notes: string[]): Promise<string[]> {
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: JSON.stringify(notes) }],
  });
  const block = resp.content[0];
  if (block.type !== "text") {
    throw new Error(`Unexpected response shape: ${block.type}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(block.text);
  } catch {
    throw new Error(`Bad JSON from model: ${block.text.slice(0, 200)}`);
  }
  if (!Array.isArray(parsed) || parsed.length !== notes.length) {
    throw new Error(
      `Expected array of ${notes.length} items, got ${
        Array.isArray(parsed) ? parsed.length : typeof parsed
      }`,
    );
  }
  return parsed.map((s) => String(s));
}

async function translateColumn(
  src: "notes" | "updates",
  enCol: "notes_en" | "updates_en",
): Promise<void> {
  const rows = (await sql.query(
    `SELECT event_id, ${src} AS text
     FROM events
     WHERE ${src} <> '' AND ${enCol} = ${src}
     ORDER BY event_id`,
  )) as Array<{ event_id: string; text: string }>;

  console.log(`${src}: ${rows.length} untranslated`);
  if (rows.length === 0) return;

  const total = Math.ceil(rows.length / BATCH_SIZE);
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const inputs = batch.map((r) => r.text);
    const num = Math.floor(i / BATCH_SIZE) + 1;
    process.stdout.write(`  ${src} batch ${num}/${total} (${batch.length})... `);
    const translations = await translateBatch(inputs);
    for (let j = 0; j < batch.length; j++) {
      await sql.query(
        `UPDATE events SET ${enCol} = $1 WHERE event_id = $2`,
        [translations[j], batch[j].event_id],
      );
    }
    console.log("ok");
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set. Add it to .env.local.");
    process.exit(2);
  }
  await translateColumn("notes", "notes_en");
  await translateColumn("updates", "updates_en");
  console.log("translate-notes done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
