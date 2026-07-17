import Link from "next/link";
import {
  getSampleRequests,
  getSampleRequestCounts,
  SAMPLE_REQUEST_STATUSES,
  SAMPLE_REQUEST_STATUS_LABELS,
  type SampleRequestStatus,
} from "@/lib/sample-requests";
import { updateSampleRequestStatus } from "./actions";
import {
  PageTitle,
  codeStyle,
  tableStyle,
  tdStyle,
  thStyle,
} from "../_layout/Table";

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

const SOURCES = [
  { key: "chilifest", label: "Samples" },
  { key: "press-evening", label: "Press evening" },
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
  const source = SOURCES.some((s) => s.key === sp.source)
    ? (sp.source as string)
    : "chilifest";

  const [requests, counts] = await Promise.all([
    getSampleRequests(filter, 500, source),
    getSampleRequestCounts(source),
  ]);

  return (
    <>
      <PageTitle
        title="Sample requests"
        subtitle="Journalist requests from the ChiliFest press hub. Review before shipping or granting access."
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {SOURCES.map((s) => {
          const active = s.key === source;
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
              href={`/admin/sample-requests?status=${s}&source=${source}`}
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
              <th style={thStyle}>Journalist</th>
              <th style={thStyle}>Outlet / handle</th>
              <th style={thStyle}>Ship to</th>
              <th style={thStyle}>Note</th>
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
