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
       addr_street, addr_postcode, addr_city, addr_country, note, source,
       wants_samples, wants_press_evening, status)
    VALUES
      (${input.name}, ${input.email}, ${input.organisation}, ${input.webOrInstagram},
       ${input.addrStreet}, ${input.addrPostcode}, ${input.addrCity},
       ${input.addrCountry}, ${input.note ?? ""}, ${input.source ?? "chilifest"},
       ${input.wantsSamples ?? false}, ${input.wantsPressEvening ?? false},
       ${input.status ?? "new"})
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, wants_samples, wants_press_evening,
              attended, status, reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return toSampleRequest(rows[0]);
}

export interface RequestFilter {
  wantsSamples?: boolean;
  wantsPressEvening?: boolean;
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
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  params.push(limit);
  const text = `
    SELECT id, created_at::text AS created_at, name, email, organisation,
           web_or_instagram, addr_street, addr_postcode, addr_city,
           addr_country, note, source, wants_samples, wants_press_evening,
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
