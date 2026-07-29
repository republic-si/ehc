import React from "react";

// Classification badges for a producer. Green = grows chilis, amber = makes
// sauce, purple = pays EHC membership. Colours echo the design tokens used
// across the admin (see _layout/Table.tsx).

function Badge({ bg, label }: { bg: string; label: string }) {
  return (
    <span
      style={{
        background: bg,
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: 4,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function ClassBadges({
  growsChilis,
  makesSauce,
  isMember,
}: {
  growsChilis: boolean;
  makesSauce: boolean;
  isMember: boolean;
}) {
  const seedToSauce = growsChilis && makesSauce;
  return (
    <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
      {seedToSauce ? (
        <Badge bg="#137333" label="Seed to sauce" />
      ) : (
        <>
          {growsChilis && <Badge bg="#137333" label="Grower" />}
          {makesSauce && <Badge bg="#b06000" label="Maker" />}
        </>
      )}
      {isMember && <Badge bg="#7a4bd6" label="Member" />}
    </span>
  );
}
