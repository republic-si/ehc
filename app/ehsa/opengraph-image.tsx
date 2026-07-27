import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded 1200x630 share card for the /ehsa press hub. Rendered at request time
// (regenerates itself, no static asset to maintain). Anton is bundled in this
// folder so the card matches the EHSA display face.

export const alt = "European Hot Sauce Awards 2027 — Press hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const anton = await readFile(join(process.cwd(), "app/ehsa/Anton-Regular.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#f5c518",
          color: "#0c0c0c",
          padding: "0 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          European Hot Sauce Awards · For press
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Anton",
            fontSize: 230,
            lineHeight: 1,
            letterSpacing: -6,
            marginTop: 10,
          }}
        >
          EHSA 2027
        </div>
        <div style={{ display: "flex", width: 300, height: 18, background: "#0c0c0c", marginTop: 14 }} />
        <div style={{ display: "flex", fontSize: 46, marginTop: 40 }}>
          Berlin · February to March 2027
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Anton", data: anton, weight: 400, style: "normal" }],
    },
  );
}
