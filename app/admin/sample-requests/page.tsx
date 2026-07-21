import React from "react";
import Link from "next/link";
import {
  getSampleRequests,
  getSampleRequestCounts,
  SAMPLE_REQUEST_STATUSES,
  SAMPLE_REQUEST_STATUS_LABELS,
  type SampleRequestStatus,
} from "@/lib/sample-requests";
import {
  updateSampleRequestStatus,
  toggleAttended,
  createManualRequest,
} from "./actions";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

const addLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#555",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const addInput: React.CSSProperties = {
  fontSize: 13,
  padding: "6px 8px",
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 400,
  textTransform: "none",
  letterSpacing: "normal",
};

const STATUS_COLOR: Record<SampleRequestStatus, string> = {
  new: "#b06000",
  approved: "#137333",
  shipped: "#1a56c4",
  declined: "#5f6368",
};

// Which one-click transitions to offer from each status.
const NEXT_ACTIONS: Record<SampleRequestStatus, SampleRequestStatus[]> = {
  new: ["approved", "declined"],
  approved: ["shipped", "declined"],
  shipped: [],
  declined: ["approved"],
};

function Pill({ status }: { status: SampleRequestStatus }) {
  return (
    <span
      style={{
        background: STATUS_COLOR[status],
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 4,
      }}
    >
      {SAMPLE_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}

const VIEWS = [
  { key: "samples", label: "Samples", filter: { wantsSamples: true } },
  {
    key: "press-evening",
    label: "Press evening",
    filter: { wantsPressEvening: true },
  },
  {
    key: "producer-contact",
    label: "Producer contact",
    filter: { source: "producer-contact" },
  },
] as const;

interface Props {
  searchParams: Promise<{ status?: string; source?: string }>;
}

export default async function SampleRequestsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter = (
    (SAMPLE_REQUEST_STATUSES as readonly string[]).includes(sp.status ?? "")
      ? sp.status
      : "new"
  ) as SampleRequestStatus;
  // Default to Samples; legacy ?source=chilifest also lands here.
  const view =
    VIEWS.find((v) => v.key === sp.source) ??
    VIEWS.find((v) => v.key === "samples")!;

  const [requests, counts] = await Promise.all([
    getSampleRequests(filter, 500, view.filter),
    getSampleRequestCounts(view.filter),
  ]);

  return (
    <>
      <PageTitle
        title="Sample requests"
        subtitle="Journalist requests from the Chili Fest press hub. Review before shipping or granting access."
      />

      <details style={{ marginBottom: 18 }}>
        <summary
          style={{
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#c8612e",
            userSelect: "none",
          }}
        >
          + Add request (email reply)
        </summary>
        <form
          action={createManualRequest}
          style={{
            marginTop: 12,
            padding: 16,
            border: "1px solid #e5e5e5",
            background: "#fafafa",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
            maxWidth: 720,
          }}
        >
          <label style={addLabel}>
            Name*
            <input name="name" required style={addInput} />
          </label>
          <label style={addLabel}>
            Email*
            <input name="email" type="email" required style={addInput} />
          </label>
          <label style={addLabel}>
            Outlet / organisation
            <input name="organisation" style={addInput} />
          </label>
          <label style={addLabel}>
            Web / Instagram
            <input name="web_or_instagram" style={addInput} />
          </label>
          <label style={{ ...addLabel, gridColumn: "1 / -1" }}>
            Street
            <input name="addr_street" style={addInput} />
          </label>
          <label style={addLabel}>
            Postcode
            <input name="addr_postcode" style={addInput} />
          </label>
          <label style={addLabel}>
            City
            <input name="addr_city" style={addInput} />
          </label>
          <label style={addLabel}>
            Country
            <input name="addr_country" style={addInput} />
          </label>
          <label style={{ ...addLabel, gridColumn: "1 / -1" }}>
            Note
            <input name="note" style={addInput} />
          </label>
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: 18,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label style={{ fontSize: 13, display: "flex", gap: 6 }}>
              <input type="checkbox" name="wants_samples" />
              Wants samples
            </label>
            <label style={{ fontSize: 13, display: "flex", gap: 6 }}>
              <input type="checkbox" name="wants_press_evening" />
              Wants press evening
            </label>
            <span style={{ fontSize: 11, color: "#888" }}>
              Saved as <strong>approved</strong>.
            </span>
            <button
              type="submit"
              style={{
                marginLeft: "auto",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "8px 18px",
                background: "#c8612e",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Add request
            </button>
          </div>
        </form>
      </details>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {VIEWS.map((s) => {
          const active = s.key === view.key;
          return (
            <Link
              key={s.key}
              href={`/admin/sample-requests?source=${s.key}&status=${filter}`}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 14px",
                background: active ? "#c8612e" : "#fff",
                color: active ? "#fff" : "#111",
                border: "1px solid #c8612e",
                textDecoration: "none",
              }}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {SAMPLE_REQUEST_STATUSES.map((s) => {
          const active = s === filter;
          return (
            <Link
              key={s}
              href={`/admin/sample-requests?status=${s}&source=${view.key}`}
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "6px 12px",
                background: active ? "#111" : "#fff",
                color: active ? "#F5C518" : "#111",
                border: "1px solid #111",
                textDecoration: "none",
              }}
            >
              {SAMPLE_REQUEST_STATUS_LABELS[s]} ({counts[s]})
            </Link>
          );
        })}
      </div>

      {requests.length === 0 ? (
        <p style={{ color: "#666", fontSize: 13 }}>
          No {SAMPLE_REQUEST_STATUS_LABELS[filter].toLowerCase()} requests.
        </p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Received</th>
              {view.key === "producer-contact" && (
                <th style={thStyle}>Producer</th>
              )}
              <th style={thStyle}>Journalist</th>
              <th style={thStyle}>Outlet / handle</th>
              <th style={thStyle}>Wants</th>
              <th style={thStyle}>Ship to</th>
              <th style={thStyle}>Note</th>
              {view.key === "press-evening" && (
                <th style={thStyle}>Attended</th>
              )}
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td style={{ ...tdStyle, ...codeStyle, whiteSpace: "nowrap" }}>
                  {r.createdAt.slice(0, 16)}
                </td>
                {view.key === "producer-contact" && (
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {r.maker || "—"}
                  </td>
                )}
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ ...codeStyle, color: "#666" }}>
                    <a href={`mailto:${r.email}`} style={{ color: "#1a56c4" }}>
                      {r.email}
                    </a>
                  </div>
                </td>
                <td style={tdStyle}>
                  <div>{r.organisation || "—"}</div>
                  <div style={{ fontSize: 11, color: "#666" }}>
                    {r.webOrInstagram || "—"}
                  </div>
                </td>
                <td style={{ ...tdStyle, fontSize: 11 }}>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {r.wantsSamples && (
                      <span style={{ color: "#137333", fontWeight: 700 }}>
                        ✓ Samples
                      </span>
                    )}
                    {r.wantsPressEvening && (
                      <span style={{ color: "#1a56c4", fontWeight: 700 }}>
                        ✓ Press
                      </span>
                    )}
                    {!r.wantsSamples && !r.wantsPressEvening && "—"}
                  </div>
                </td>
                <td style={{ ...tdStyle, fontSize: 12 }}>
                  {r.addrStreet}
                  <br />
                  {r.addrPostcode} {r.addrCity}
                  <br />
                  {r.addrCountry}
                </td>
                <td style={{ ...tdStyle, fontSize: 12, maxWidth: 240 }}>
                  {r.note || "—"}
                </td>
                {view.key === "press-evening" && (
                  <td style={tdStyle}>
                    <form action={toggleAttended}>
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="attended"
                        value={r.attended ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          background: r.attended ? "#137333" : "#fff",
                          color: r.attended ? "#fff" : "#137333",
                          border: "1px solid #137333",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.attended ? "✓ Attended" : "Mark attended"}
                      </button>
                    </form>
                  </td>
                )}
                <td style={tdStyle}>
                  <Pill status={r.status} />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {NEXT_ACTIONS[r.status].map((next) => (
                      <form key={next} action={updateSampleRequestStatus}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="status" value={next} />
                        <button
                          type="submit"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            background: "#fff",
                            color: STATUS_COLOR[next],
                            border: `1px solid ${STATUS_COLOR[next]}`,
                            cursor: "pointer",
                            width: "100%",
                          }}
                        >
                          {next === "approved"
                            ? "Approve"
                            : next === "shipped"
                              ? "Mark shipped"
                              : next === "declined"
                                ? "Decline"
                                : next}
                        </button>
                      </form>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
