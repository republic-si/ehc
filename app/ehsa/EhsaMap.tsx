"use client";

import { useState } from "react";
import geo from "@/lib/ehsa/europe-geo.json";
import type { CountryDatum } from "@/lib/ehsa/map-data";

// Producers-across-Europe bubble map. Europe outline + dot positions are a
// static projected asset (lib/ehsa/europe-geo.json, generated offline with
// d3-geo; no map library ships). Dots scale with producer count; hovering a
// dot shows a tooltip. Black on brand yellow, hard edges, matching the deck.

const YELLOW = "#f5c518";
const INK = "#0c0c0c";

type Geo = {
  viewBox: number[];
  countries: { name: string; d: string }[];
  dots: { name: string; x: number; y: number }[];
};
const G = geo as Geo;
const [VX, VY, VW, VH] = G.viewBox;
const radius = (n: number) => 5.5 + 3.3 * Math.sqrt(n);

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
  const pad = 11;
  const lh = 20;
  const w = Math.round(
    Math.max(lines[0].length * 9.2, ...lines.slice(1).map((l) => l.length * 7.4)) + pad * 2,
  );
  const h = lines.length * lh + pad;
  let bx = x > VX + VW * 0.55 ? x - w - 10 : x + 12;
  let by = y - h - 10;
  bx = Math.min(Math.max(bx, VX + 2), VX + VW - w - 2);
  by = Math.max(by, VY + 2);
  return (
    <g pointerEvents="none">
      <rect x={bx} y={by} width={w} height={h} fill={INK} />
      {lines.map((l, i) => (
        <text
          key={i}
          x={bx + pad}
          y={by + pad + 11 + i * lh}
          fontSize={i === 0 ? 15 : 13}
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
      viewBox={`${VX} ${VY} ${VW} ${VH}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label="Producers across Europe"
    >
      <rect x={VX} y={VY} width={VW} height={VH} fill={YELLOW} />
      {G.countries.map((c) => (
        <path key={c.name} d={c.d} fill="none" stroke={INK} strokeWidth={0.7} strokeOpacity={0.5} />
      ))}
      {active.map((d) => {
        const n = data[d.name].count;
        const rr = radius(n) + (hover === d.name ? 2 : 0);
        const fs = Math.min(15, Math.max(9, radius(n) + 1));
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
            <circle cx={d.x} cy={d.y} r={rr} fill={INK} />
            <text
              x={d.x}
              y={d.y}
              dy="0.34em"
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
