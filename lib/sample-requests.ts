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
  extra_emails: string[];
  completed_at: string | null;
  guest_of: string | null;
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
  extraEmails: string[];
  completedAt: string | null;
  /** For a guest row, the id of the requester who added them. Null otherwise. */
  guestOf: string | null;
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
    extraEmails: row.extra_emails ?? [],
    completedAt: row.completed_at,
    guestOf: row.guest_of ? String(row.guest_of) : null,
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
              attended, extra_emails, completed_at::text AS completed_at, guest_of,
              status, reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return toSampleRequest(rows[0]);
}

// ---- progressive-save request flow ----------------------------------------
// The public Chili Fest form saves as the visitor moves through it, so a lead is
// captured the moment they give name+email. startSampleRequest INSERTs the
// partial row and hands back an edit_token; patchSampleRequest applies later
// steps, gated on (id, edit_token) so one visitor can never touch another's row.

export interface StartedRequest {
  id: string;
  editToken: string;
}

const PATCHABLE = {
  role: "role",
  audience: "audience",
  wantsSamples: "wants_samples",
  wantsPressEvening: "wants_press_evening",
  addrStreet: "addr_street",
  addrPostcode: "addr_postcode",
  addrCity: "addr_city",
  addrCountry: "addr_country",
  webOrInstagram: "web_or_instagram",
  organisation: "organisation",
  note: "note",
  extraEmails: "extra_emails",
} as const;
export type PatchableField = keyof typeof PATCHABLE;
export type RequestPatch = Partial<Record<PatchableField, unknown>>;

export async function startSampleRequest(input: {
  name: string;
  email: string;
  source?: string;
  maker?: string;
}): Promise<StartedRequest> {
  const rows = (await sql`
    INSERT INTO sample_requests (name, email, source, maker, status)
    VALUES (${input.name}, ${input.email}, ${input.source ?? "chilifest"},
            ${input.maker ?? ""}, 'new')
    RETURNING id, edit_token
  `) as { id: string; edit_token: string }[];
  return { id: String(rows[0].id), editToken: rows[0].edit_token };
}

// Apply a whitelisted patch to one row, gated on the edit_token. Returns the
// number of rows changed (0 = bad id/token, so the caller can reject).
export async function patchSampleRequest(
  id: string,
  editToken: string,
  patch: RequestPatch,
): Promise<number> {
  const sets: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  for (const [key, col] of Object.entries(PATCHABLE)) {
    if (key in patch && patch[key as PatchableField] !== undefined) {
      sets.push(`${col} = $${i++}`);
      params.push(patch[key as PatchableField]);
    }
  }
  if (sets.length === 0) return 0;
  const idIdx = i++;
  const tokIdx = i++;
  params.push(id, editToken);
  // RETURNING id so the affected-row count is exact — a wrong id/token matches
  // nothing and yields [], which the caller treats as a rejected patch.
  const res = (await sql.query(
    `UPDATE sample_requests SET ${sets.join(", ")}
      WHERE id = $${idIdx}::bigint AND edit_token = $${tokIdx}::uuid
      RETURNING id`,
    params,
  )) as unknown[];
  return res.length;
}

// Mark a row complete (visitor finished the flow) and stamp audience from role.
// Gated on edit_token; returns the finished row for the notification email.
export async function completeSampleRequest(
  id: string,
  editToken: string,
): Promise<SampleRequest | null> {
  const rows = (await sql`
    UPDATE sample_requests
       SET completed_at = COALESCE(completed_at, now()),
           audience = CASE WHEN role = 'trade' THEN 'trade' ELSE 'press' END
     WHERE id = ${id}::bigint AND edit_token = ${editToken}::uuid
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, maker, role, audience, wants_samples,
              wants_press_evening, attended, extra_emails,
              completed_at::text AS completed_at, guest_of, status,
              reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return rows.length ? toSampleRequest(rows[0]) : null;
}

export interface GuestResult {
  parent: SampleRequest;
  emails: string[];
}

// Industry-pass guests. Stores the emails on the parent (quick summary) AND
// materialises one linked door-list row per guest, inheriting the requester's
// role/audience. Gated on the parent's edit_token. Idempotent: replaces any
// prior guest rows. Returns null when the (id, token) pair is invalid.
export async function addPassGuests(
  parentId: string,
  editToken: string,
  emails: string[],
): Promise<GuestResult | null> {
  const clean = [
    ...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean)),
  ].slice(0, 5);

  const parents = (await sql`
    UPDATE sample_requests SET extra_emails = ${clean}
     WHERE id = ${parentId}::bigint AND edit_token = ${editToken}::uuid
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, maker, role, audience, wants_samples,
              wants_press_evening, attended, extra_emails,
              completed_at::text AS completed_at, guest_of, status,
              reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  if (!parents.length) return null;
  const parent = toSampleRequest(parents[0]);

  // Replace any prior guest rows for this parent, then insert the current set.
  await sql`DELETE FROM sample_requests WHERE guest_of = ${parentId}::bigint`;
  for (const email of clean) {
    await sql`
      INSERT INTO sample_requests
        (name, email, source, maker, role, audience,
         wants_press_evening, note, guest_of, completed_at, status)
      VALUES ('', ${email}, ${parent.source}, ${parent.maker},
              ${parent.role}, ${parent.audience}, true,
              ${`Guest of ${parent.name}`}, ${parentId}::bigint, now(), 'new')
    `;
  }
  return { parent, emails: clean };
}

// Shipping address added on the success screen (samples path). Patches the
// addr_* fields gated on edit_token and returns the row so the caller can
// notify — the completion email fired before the address existed.
export async function setShippingAddress(
  id: string,
  editToken: string,
  addr: { street: string; postcode: string; city: string; country: string },
): Promise<SampleRequest | null> {
  const rows = (await sql`
    UPDATE sample_requests
       SET addr_street = ${addr.street}, addr_postcode = ${addr.postcode},
           addr_city = ${addr.city}, addr_country = ${addr.country}
     WHERE id = ${id}::bigint AND edit_token = ${editToken}::uuid
    RETURNING id, created_at::text AS created_at, name, email, organisation,
              web_or_instagram, addr_street, addr_postcode, addr_city,
              addr_country, note, source, maker, role, audience, wants_samples,
              wants_press_evening, attended, extra_emails,
              completed_at::text AS completed_at, guest_of, status,
              reviewed_at::text AS reviewed_at
  `) as SampleRequestRow[];
  return rows.length ? toSampleRequest(rows[0]) : null;
}

export interface RequestFilter {
  wantsSamples?: boolean;
  wantsPressEvening?: boolean;
  /** Exact match on the `source` column, e.g. 'producer-contact'. */
  source?: string;
  /** Door list: 'press' or 'trade'. Omit for both. */
  audience?: Audience;
  /** true = finished the flow (completed_at set); false = partial lead
   *  (name+email only, still to be chased). Omit for both. */
  completed?: boolean;
}

// Shared WHERE builder for the two request queries below. Appends to an existing
// clause/param list so the parameter indices stay in sync with the caller.
function pushRequestFilter(
  filter: RequestFilter,
  clauses: string[],
  params: unknown[],
  next: () => number,
): void {
  if (filter.wantsSamples) {
    clauses.push(`wants_samples = $${next()}`);
    params.push(true);
  }
  if (filter.wantsPressEvening) {
    clauses.push(`wants_press_evening = $${next()}`);
    params.push(true);
  }
  if (filter.source) {
    clauses.push(`source = $${next()}`);
    params.push(filter.source);
  }
  if (filter.audience) {
    clauses.push(`audience = $${next()}`);
    params.push(filter.audience);
  }
  if (filter.completed !== undefined) {
    clauses.push(
      filter.completed ? "completed_at IS NOT NULL" : "completed_at IS NULL",
    );
  }
}

export async function getSampleRequests(
  status?: SampleRequestStatus,
  limit = 500,
  filter: RequestFilter = {},
): Promise<SampleRequest[]> {
  const clauses: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  const next = () => i++;
  if (status) {
    clauses.push(`status = $${next()}`);
    params.push(status);
  }
  pushRequestFilter(filter, clauses, params, next);
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  params.push(limit);
  const text = `
    SELECT id, created_at::text AS created_at, name, email, organisation,
           web_or_instagram, addr_street, addr_postcode, addr_city,
           addr_country, note, source, maker, role, audience, wants_samples, wants_press_evening,
           attended, extra_emails, completed_at::text AS completed_at, guest_of,
           status, reviewed_at::text AS reviewed_at
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
  pushRequestFilter(filter, clauses, params, () => i++);
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
