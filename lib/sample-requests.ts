import { sql } from "@/db/client";

export const SAMPLE_REQUEST_STATUSES = [
  "new",
  "approved",
  "shipped",
  "declined",
] as const;
export type SampleRequestStatus = (typeof SAMPLE_REQUEST_STATUSES)[number];

export const SAMPLE_REQUEST_STATUS_LABELS: Record<SampleRequestStatus, string> =
  {
    new: "New",
    approved: "Approved",
    shipped: "Shipped",
    declined: "Declined",
  };

// Who the requester is. The industry preview is open to all three; samples are
// offered to press + influencer only. "" is a legacy row with no role captured.
export const REQUEST_ROLES = ["press", "influencer", "trade"] as const;
export type RequestRole = (typeof REQUEST_ROLES)[number];

export const REQUEST_ROLE_LABELS: Record<RequestRole, string> = {
  press: "Press",
  influencer: "Influencer",
  trade: "Trade",
};

export function asRequestRole(v: unknown): RequestRole | "" {
  return (REQUEST_ROLES as readonly string[]).includes(v as string)
    ? (v as RequestRole)
    : "";
}

// Which door list a row belongs to for the BCF Press + Trade Preview. Distinct
// from `role`: press = sample box posted in advance; trade = buyer, box on the
// door only. Every row has one; legacy rows default to 'press'.
export const AUDIENCES = ["press", "trade"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCE_LABELS: Record<Audience, string> = {
  press: "Press",
  trade: "Trade",
};

export function asAudience(v: unknown): Audience {
  return (AUDIENCES as readonly string[]).includes(v as string)
    ? (v as Audience)
    : "press";
}

export interface SampleRequestRow {
  id: string;
  created_at: string;
  name: string;
  email: string;
  organisation: string;
  web_or_instagram: string;
  addr_street: string;
  addr_postcode: string;
  addr_city: string;
  addr_country: string;
  note: string;
  source: string;
  maker: string;
  role: string;
  audience: string;
  wants_samples: boolean;
  wants_press_evening: boolean;
  attended: boolean;
  status: string;
  reviewed_at: string | null;
}

export interface SampleRequest {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  organisation: string;
  webOrInstagram: string;
  addrStreet: string;
  addrPostcode: string;
  addrCity: string;
  addrCountry: string;
  note: string;
  source: string;
  maker: string;
  role: RequestRole | "";
  audience: Audience;
  wantsSamples: boolean;
  wantsPressEvening: boolean;
  attended: boolean;
  status: SampleRequestStatus;
  reviewedAt: string | null;
}

function toSampleRequest(row: SampleRequestRow): SampleRequest {
  return {
    id: String(row.id),
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    organisation: row.organisation,
    webOrInstagram: row.web_or_instagram,
    addrStreet: row.addr_street,
    addrPostcode: row.addr_postcode,
    addrCity: row.addr_city,
    addrCountry: row.addr_country,
    note: row.note,
    source: row.source,
    maker: row.maker,
    role: asRequestRole(row.role),
    audience: asAudience(row.audience),
    wantsSamples: row.wants_samples,
    wantsPressEvening: row.wants_press_evening,
    attended: row.attended,
    status: (row.status as SampleRequestStatus) ?? "new",
    reviewedAt: row.reviewed_at,
  };
}

export interface NewSampleRequest {
  name: string;
  email: string;
  organisation: string;
  webOrInstagram: string;
  addrStreet: string;
  addrPostcode: string;
  addrCity: string;
  addrCountry: string;
  note?: string;
  source?: string;
  maker?: string;
  role?: RequestRole | "";
  /** Door list. Defaults to 'press'; set 'trade' for confirmed buyers. */
  audience?: Audience;
  wantsSamples?: boolean;
  wantsPressEvening?: boolean;
  /** Manual admin entries land straight in an approved state; the public
   *  form omits this and gets the 'new' default. */
  status?: SampleRequestStatus;
}

export async function createSampleRequest(
  input: NewSampleRequest,
): Promise<SampleRequest> {
  const rows = (await sql`
    INSERT INTO sample_requests
      (name, email, organisation, web_or_instagram,
       addr_street, addr_postcode, addr_city, addr_country, note, source, maker,
       role, audience, wants_samples, wants_press_evening, status)
    VALUES
      (${input.name}, ${input.email}, ${input.organisation}, ${input.webOrInstagram},
       ${input.addrStreet}, ${input.addrPostcode}, ${input.addrCity},
       ${input.addrCountry}, ${input.note ?? ""}, ${input.source ?? "chilifest"},
       ${input.maker ?? ""}, ${input.role ?? ""}, ${input.audience ?? "press"},
       ${input.wantsSamples ?? false}, ${input.wantsPressEvening ?? false},
       ${input.status ?? "new"})
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, maker, role, audience, wants_samples, wants_press_evening,
              attended, status, reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return toSampleRequest(rows[0]);
}

export interface RequestFilter {
  wantsSamples?: boolean;
  wantsPressEvening?: boolean;
  /** Exact match on the `source` column, e.g. 'producer-contact'. */
  source?: string;
  /** Door list: 'press' or 'trade'. Omit for both. */
  audience?: Audience;
}

export async function getSampleRequests(
  status?: SampleRequestStatus,
  limit = 500,
  filter: RequestFilter = {},
): Promise<SampleRequest[]> {
  const clauses: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  if (status) {
    clauses.push(`status = $${i++}`);
    params.push(status);
  }
  if (filter.wantsSamples) {
    clauses.push(`wants_samples = $${i++}`);
    params.push(true);
  }
  if (filter.wantsPressEvening) {
    clauses.push(`wants_press_evening = $${i++}`);
    params.push(true);
  }
  if (filter.source) {
    clauses.push(`source = $${i++}`);
    params.push(filter.source);
  }
  if (filter.audience) {
    clauses.push(`audience = $${i++}`);
    params.push(filter.audience);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  params.push(limit);
  const text = `
    SELECT id, created_at::text AS created_at, name, email, organisation,
           web_or_instagram, addr_street, addr_postcode, addr_city,
           addr_country, note, source, maker, role, audience, wants_samples, wants_press_evening,
           attended, status, reviewed_at::text AS reviewed_at
    FROM sample_requests
    ${where}
    ORDER BY created_at DESC
    LIMIT $${i}
  `;
  const rows = (await sql.query(text, params)) as SampleRequestRow[];
  return rows.map(toSampleRequest);
}

export async function getSampleRequestCounts(
  filter: RequestFilter = {},
): Promise<Record<SampleRequestStatus, number>> {
  const clauses: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  if (filter.wantsSamples) {
    clauses.push(`wants_samples = $${i++}`);
    params.push(true);
  }
  if (filter.wantsPressEvening) {
    clauses.push(`wants_press_evening = $${i++}`);
    params.push(true);
  }
  if (filter.source) {
    clauses.push(`source = $${i++}`);
    params.push(filter.source);
  }
  if (filter.audience) {
    clauses.push(`audience = $${i++}`);
    params.push(filter.audience);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = (await sql.query(
    `SELECT status, count(*)::int AS n FROM sample_requests ${where} GROUP BY status`,
    params,
  )) as Array<{ status: string; n: number }>;
  const counts: Record<SampleRequestStatus, number> = {
    new: 0,
    approved: 0,
    shipped: 0,
    declined: 0,
  };
  for (const r of rows) {
    if ((SAMPLE_REQUEST_STATUSES as readonly string[]).includes(r.status)) {
      counts[r.status as SampleRequestStatus] = r.n;
    }
  }
  return counts;
}

export async function setSampleRequestStatus(
  id: string,
  status: SampleRequestStatus,
): Promise<void> {
  await sql`
    UPDATE sample_requests
    SET status = ${status}, reviewed_at = now()
    WHERE id = ${id}::bigint
  `;
}

export async function setSampleRequestAttended(
  id: string,
  attended: boolean,
): Promise<void> {
  await sql`
    UPDATE sample_requests
    SET attended = ${attended}
    WHERE id = ${id}::bigint
  `;
}
