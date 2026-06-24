import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-haiku-4-5";

const SYSTEM = `You translate event organiser notes (mostly German market/festival events) to natural English.

Rules:
- Translate from German, Italian, Spanish, Dutch, or any language to English.
- If already English, return unchanged.
- Preserve event-specific terms verbatim when no clean English equivalent: Standgebühr, Anmeldeschluss, Gewerbeschein, Wochenmarkt, Marktbeschicker, Krämermarkt, Standmiete, Hütte, Schausteller.
- Preserve URLs, email addresses, ISO dates (YYYY-MM-DD), bracketed tags like [2026-06-18], pipe-separated key=value tokens.
- Keep tone factual and brief. Don't pad, soften, or paraphrase.
- Output ONLY the translated text. No commentary, no quotes, no markdown.`;

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

export async function translateNoteToEnglish(text: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }
  const resp = await client().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [
      { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: text }],
  });
  const block = resp.content[0];
  if (block.type !== "text") {
    throw new Error(`Unexpected response shape: ${block.type}`);
  }
  return block.text.trim();
}
