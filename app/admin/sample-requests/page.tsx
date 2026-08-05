import React from "react";
import Link from "next/link";
import {
  getSampleRequests,
  getSampleRequestCounts,
  SAMPLE_REQUEST_STATUSES,
  SAMPLE_REQUEST_STATUS_LABELS,
  REQUEST_ROLES,
  REQUEST_ROLE_LABELS,
  AUDIENCES,
  AUDIENCE_LABELS,
  type SampleRequestStatus,
  type Audience,
} from "@/lib/sample-requests";
import {
  updateSampleRequestStatus,
  toggleAttended,
  createManualRequest,
} from "./actions";
import LabelControl from "./LabelControl";
import WeightControl from "./WeightControl";
import BatchLabelButton from "./BatchLabelButton";
import { isSupportedDhlDestination, resolveCountryAlpha3 } from "@/lib/dhl";
import { getLabelBatchHistory, getNewLabelCount } from "@/lib/dhl-labels";
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

// A posted sample box (press/influencer) gets a DHL label; a trade box sits on
// the door, so no label. Mirrors the address checks in lib/dhl's
// generateSampleLabel so the button state matches what a mint would actually do.
function labelState(r: {
  wantsSamples: boolean;
  audience: string;
  addrStreet: string;
  addrPostcode: string;
  addrCity: string;
  addrCountry: string;
}): { needsLabel: boolean; shippable: boolean; addressIssue: string } {
  const needsLabel = r.wantsSamples && r.audience !== "trade";
  const missing: string[] = [];
  if (!r.addrStreet?.trim()) missing.push("street");
  if (!r.addrPostcode?.trim()) missing.push("postcode");
  if (!r.addrCity?.trim()) missing.push("city");

  let addressIssue = "";
  if (!resolveCountryAlpha3(r.addrCountry ?? "")) {
    addressIssue = r.addrCountry?.trim()
      ? `Unmapped country: ${r.addrCountry}`
      : "No country";
  } else if (!isSupportedDhlDestination(r.addrCountry ?? "")) {
    addressIssue = "Destination not supported in EU-only labels";
  } else if (missing.length) {
    addressIssue = `Missing ${missing.join(", ")}`;
  }
  return { needsLabel, shippable: addressIssue === "", addressIssue };
}

const VIEWS = [
  { key: "samples", label: "Samples", filter: { wantsSamples: true } },
  {
    key: "press-evening",
    label: "Industry pass",
    filter: { wantsPressEvening: true },
  },
  {
    key: "leads",
    label: "Leads (incomplete)",
    filter: { completed: false },
  },
  {
    key: "producer-contact",
    label: "Producer contact",
    filter: { source: "producer-contact" },
  },
] as const;

// Door-list filter, orthogonal to the source/flag views above: a trade buyer is
// also a press-evening attendee, so audience is its own axis. "" = both.
const AUDIENCE_VIEWS = [
  { key: "", label: "All" },
  ...AUDIENCES.map((a) => ({ key: a, label: AUDIENCE_LABELS[a] })),
] as const;

interface Props {
  searchParams: Promise<{
    status?: string;
    source?: string;
    audience?: string;
    labelError?: string;
    labelFor?: string;
    labelVoided?: string;
    batchError?: string;
    batchEmpty?: string;
  }>;
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
  const audience = (AUDIENCES as readonly string[]).includes(sp.audience ?? "")
    ? (sp.audience as Audience)
    : undefined;

  const reqFilter = { ...view.filter, ...(audience ? { audience } : {}) };
  const [requests, counts, newLabelCount, batchHistory] = await Promise.all([
    getSampleRequests(filter, 500, reqFilter),
    getSampleRequestCounts(reqFilter),
    getNewLabelCount(),
    getLabelBatchHistory(),
  ]);

  // Preserve the active audience filter across the source/status links.
  const audParam = audience ? `&audience=${audience}` : "";

  // Passed to the label action so its redirects land back on this exact view.
  const returnTo = new URLSearchParams({
    status: filter,
    ...(sp.source ? { source: sp.source } : {}),
    ...(audience ? { audience } : {}),
  }).toString();
  // Set when a label generation just failed, so we show the reason on its row.
  const labelError = typeof sp.labelError === "string" ? sp.labelError : "";
  const labelErrorFor = typeof sp.labelFor === "string" ? sp.labelFor : "";
  const labelVoided = sp.labelVoided === "1";

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
          <label style={addLabel}>
            Role
            <select name="role" style={addInput} defaultValue="">
              <option value="">—</option>
              {REQUEST_ROLES.map((rk) => (
                <option key={rk} value={rk}>
                  {REQUEST_ROLE_LABELS[rk]}
                </option>
              ))}
            </select>
          </label>
          <label style={addLabel}>
            Audience
            <select name="audience" style={addInput} defaultValue="press">
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>
                  {AUDIENCE_LABELS[a]}
                </option>
              ))}
            </select>
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
              href={`/admin/sample-requests?source=${s.key}&status=${filter}${audParam}`}
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

      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#777",
            marginRight: 4,
          }}
        >
          Audience
        </span>
        {AUDIENCE_VIEWS.map((a) => {
          const active = a.key === (audience ?? "");
          return (
            <Link
              key={a.key || "all"}
              href={`/admin/sample-requests?source=${view.key}&status=${filter}${
                a.key ? `&audience=${a.key}` : ""
              }`}
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 14px",
                background: active ? "#1a56c4" : "#fff",
                color: active ? "#fff" : "#111",
                border: "1px solid #1a56c4",
                textDecoration: "none",
              }}
            >
              {a.label}
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
              href={`/admin/sample-requests?status=${s}&source=${view.key}${audParam}`}
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

      {filter === "shipped" && view.key === "samples" && (
        <section
          style={{
            border: "1px solid #ddd",
            background: "#fafafa",
            padding: 14,
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <BatchLabelButton count={newLabelCount} />
            <span style={{ fontSize: 12, color: "#666" }}>
              Individual labels are included in their first successful print batch only.
            </span>
          </div>
          {sp.batchError && (
            <p style={{ color: "#b00020", fontSize: 12, margin: "10px 0 0" }}>
              Batch failed: {sp.batchError}
            </p>
          )}
          {sp.batchEmpty && (
            <p style={{ color: "#666", fontSize: 12, margin: "10px 0 0" }}>
              There were no new stored labels to batch.
            </p>
          )}
          {batchHistory.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Batch history
              </strong>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                {batchHistory.map((batch) => (
                  <div key={batch.id} style={{ fontSize: 12, display: "flex", gap: 8 }}>
                    <span>{new Date(batch.createdAt).toLocaleString("en-GB")}</span>
                    <span>{batch.labelCount} labels</span>
                    <span>{batch.state}</span>
                    {batch.state === "ready" && (
                      <a href={`/admin/sample-requests/label-batches/${batch.id}`}>
                        Download PDF
                      </a>
                    )}
                    {batch.failureReason && <span style={{ color: "#b00020" }}>{batch.failureReason}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

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
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Audience</th>
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
            {requests.map((r) => {
              const ls = labelState(r);
              // Just-labelled row we redirected to: highlight it so the fresh
              // "Print label" is easy to spot. (labelFor with no error = success.)
              const justShipped =
                labelErrorFor === r.id && !labelError && !labelVoided;
              return (
              <tr
                key={r.id}
                style={
                  justShipped
                    ? { boxShadow: "inset 3px 0 0 #ea580c", background: "#fdf2ea" }
                    : undefined
                }
              >
                <td style={{ ...tdStyle, ...codeStyle, whiteSpace: "nowrap" }}>
                  {r.createdAt.slice(0, 16)}
                  {!r.completedAt && r.source === "chilifest" ? (
                    <div
                      style={{
                        marginTop: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#b06000",
                      }}
                    >
                      Partial · chase
                    </div>
                  ) : null}
                </td>
                {view.key === "producer-contact" && (
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {r.maker || "—"}
                  </td>
                )}
                <td style={tdStyle}>
                  {r.guestOf ? (
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: 3,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#fff",
                        background: "#c8612e",
                        padding: "1px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Pass guest
                    </span>
                  ) : (
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                  )}
                  <div style={{ ...codeStyle, color: "#666" }}>
                    <a href={`mailto:${r.email}`} style={{ color: "#1a56c4" }}>
                      {r.email}
                    </a>
                  </div>
                </td>
                <td style={{ ...tdStyle, fontSize: 12 }}>
                  {r.role ? REQUEST_ROLE_LABELS[r.role] : "—"}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: r.audience === "trade" ? "#1a56c4" : "#eee",
                      color: r.audience === "trade" ? "#fff" : "#555",
                    }}
                  >
                    {AUDIENCE_LABELS[r.audience]}
                  </span>
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
                        ✓ Pass
                      </span>
                    )}
                    {r.extraEmails.length > 0 && (
                      <span
                        style={{ color: "#137333", fontWeight: 700 }}
                        title={r.extraEmails.join(", ")}
                      >
                        +{r.extraEmails.length} guest
                        {r.extraEmails.length === 1 ? "" : "s"}
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
                  {labelVoided && labelErrorFor === r.id && (
                    <div style={{ marginTop: 4, fontSize: 10, color: "#137333", fontWeight: 700 }}>
                      DHL label voided
                    </div>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {/* Posted-box rows get a per-box weight field until the
                        label is minted (after which the weight is baked in and
                        we show it read-only alongside the reprint button). */}
                    {ls.needsLabel && !r.dhlLabelUrl && (
                      <WeightControl id={r.id} weightKg={r.weightKg} />
                    )}
                    <LabelControl
                      id={r.id}
                      needsLabel={ls.needsLabel}
                      labelUrl={r.dhlLabelUrl}
                      hasStoredLabel={r.hasStoredLabel}
                      trackingNumber={r.dhlTrackingNumber}
                      shippable={ls.shippable}
                      addressIssue={ls.addressIssue}
                      returnTo={returnTo}
                      weightKg={r.weightKg}
                      error={labelErrorFor === r.id ? labelError : undefined}
                    />
                    {NEXT_ACTIONS[r.status]
                      // For a posted sample box the label IS the ship step, so
                      // hide the manual "Mark shipped" (it would ship with no
                      // label). Door/trade rows keep it.
                      .filter(
                        (next) =>
                          !(next === "shipped" && ls.needsLabel && !r.dhlLabelUrl),
                      )
                      .map((next) => (
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
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
