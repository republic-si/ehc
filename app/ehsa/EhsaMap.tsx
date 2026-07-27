"use client";

import { useState } from "react";
import geo from "@/lib/ehsa/europe-geo.json";
import type { CountryDatum } from "@/lib/ehsa/map-data";

// Producers-across-Europe bubble map. The Europe outline + dot positions are a
// static projected asset (lib/ehsa/europe-geo.json, generated offline with
// d3-geo, no map library ships). Dots scale with producer count; hovering a
// dot shows a tooltip. Matches the deck: black on brand yellow, hard edges.

const YELLOW = "#f5c518";
const INK = "#0c0c0c";

type Geo = {
  width: number;
  height: number;
  countries: { name: string; d: string }[];
  dots: { name: string; x: number; y: number }[];
};

const G = geo as Geo;
const radius = (n: number) => 5 + 3 * Math.sqrt(n);

function Tooltip({
  datum,
  x,
  y,
  lang,
}: {
  datum: CountryDatum;
  x: number;
  y: number;
  lang: "en" | "de";
}) {
  const lines = [
    datum.country.toUpperCase(),
    `${datum.count} ${lang === "de" ? "Hersteller" : datum.count === 1 ? "producer" : "producers"}`,
    ...(datum.winner ? [`${lang === "de" ? "Sieger" : "Top winner"}: ${datum.winner}`] : []),
  ];
  const pad = 12;
  const lh = 22;
  const w = Math.max(...lines.map((l) => l.length)) * 8.2 + pad * 2;
  const h = lines.length * lh + pad;
  const flip = x > G.width * 0.6;
  const bx = flip ? x - w - 10 : x + 10;
  const by = Math.max(4, y - h - 10);
  return (
    <g pointerEvents="none">
      <rect x={bx} y={by} width={w} height={h} fill={INK} />
      {lines.map((l, i) => (
        <text
          key={i}
          x={bx + pad}
          y={by + pad + 12 + i * lh}
          fontSize={i === 0 ? 16 : 14}
          fontWeight={i === 0 ? 800 : 600}
          fill={i === 0 ? YELLOW : "#ffffff"}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

export function EhsaMap({
  data,
  lang = "en",
}: {
  data: Record<string, CountryDatum>;
  lang?: "en" | "de";
}) {
  const [hover, setHover] = useState<string | null>(null);
  const active = G.dots.filter((d) => data[d.name]);
  const hoveredDatum = hover ? data[hover] : null;
  const hoveredDot = hover ? G.dots.find((d) => d.name === hover) : null;

  return (
    <svg
      viewBox={`0 0 ${G.width} ${G.height}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label="Producers across Europe"
    >
      <rect width={G.width} height={G.height} fill={YELLOW} />
      {G.countries.map((c) => (
        <path key={c.name} d={c.d} fill="none" stroke={INK} strokeWidth={0.8} strokeOpacity={0.5} />
      ))}
      {active.map((d) => {
        const n = data[d.name].count;
        const r = radius(n) + (hover === d.name ? 2 : 0);
        const fs = Math.min(13, Math.max(9, radius(n) - 2));
        return (
          <g
            key={d.name}
            tabIndex={0}
            role="button"
            aria-label={`${d.name}, ${n} producers`}
            onMouseEnter={() => setHover(d.name)}
            onMouseLeave={() => setHover((h) => (h === d.name ? null : h))}
            onFocus={() => setHover(d.name)}
            onBlur={() => setHover((h) => (h === d.name ? null : h))}
            style={{ cursor: "pointer", outline: "none" }}
          >
            <circle cx={d.x} cy={d.y} r={r} fill={INK} />
            <text
              x={d.x}
              y={d.y}
              dy="0.35em"
              textAnchor="middle"
              fontSize={fs}
              fontWeight={800}
              fill={YELLOW}
              pointerEvents="none"
            >
              {n}
            </text>
          </g>
        );
      })}
      {hoveredDatum && hoveredDot ? (
        <Tooltip datum={hoveredDatum} x={hoveredDot.x} y={hoveredDot.y} lang={lang} />
      ) : null}
    </svg>
  );
}
