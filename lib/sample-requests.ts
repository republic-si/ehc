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
}

export async function createSampleRequest(
  input: NewSampleRequest,
): Promise<SampleRequest> {
  const rows = (await sql`
    INSERT INTO sample_requests
      (name, email, organisation, web_or_instagram,
       addr_street, addr_postcode, addr_city, addr_country, note, source)
    VALUES
      (${input.name}, ${input.email}, ${input.organisation}, ${input.webOrInstagram},
       ${input.addrStreet}, ${input.addrPostcode}, ${input.addrCity},
       ${input.addrCountry}, ${input.note ?? ""}, ${input.source ?? "chilifest"})
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, status,
              reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return toSampleRequest(rows[0]);
}

export async function getSampleRequests(
  status?: SampleRequestStatus,
  limit = 500,
): Promise<SampleRequest[]> {
  const where = status ? `WHERE status = $1` : "";
  const params: unknown[] = status ? [status, limit] : [limit];
  const limitPlaceholder = status ? "$2" : "$1";
  const text = `
    SELECT id, created_at::text AS created_at, name, email, organisation,
           web_or_instagram, addr_street, addr_postcode, addr_city,
           addr_country, note, source, status,
           reviewed_at::text AS reviewed_at
    FROM sample_requests
    ${where}
    ORDER BY created_at DESC
    LIMIT ${limitPlaceholder}
  `;
  const rows = (await sql.query(text, params)) as SampleRequestRow[];
  return rows.map(toSampleRequest);
}

export async function getSampleRequestCounts(): Promise<
  Record<SampleRequestStatus, number>
> {
  const rows = (await sql`
    SELECT status, count(*)::int AS n
    FROM sample_requests
    GROUP BY status
  `) as Array<{ status: string; n: number }>;
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
