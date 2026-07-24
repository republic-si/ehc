import { sql } from "@/db/client";

// EHSA register-interest submissions from the public press hub (/ehsa).
// Table: interest_registrations (migration 20260724_ehsa_interest_registrations.sql).

export const INTEREST_ROLES = ["press", "influencer", "trade"] as const;
export type InterestRole = (typeof INTEREST_ROLES)[number];

export const INTEREST_ROLE_LABELS: Record<InterestRole, string> = {
  press: "Journalist / Editor",
  influencer: "Influencer / Creator",
  trade: "Trade / Buyer",
};

export function asInterestRole(v: unknown): InterestRole | "" {
  return (INTEREST_ROLES as readonly string[]).includes(v as string)
    ? (v as InterestRole)
    : "";
}

export interface CreateInterestInput {
  campaignSlug: string;
  name: string;
  email: string;
  role: InterestRole | "";
  organisation: string;
  note: string;
}

export async function createInterest(
  input: CreateInterestInput,
): Promise<{ id: string }> {
  const rows = await sql`
    INSERT INTO interest_registrations
      (campaign_slug, name, email, role, organisation, note)
    VALUES
      (${input.campaignSlug}, ${input.name}, ${input.email},
       ${input.role}, ${input.organisation}, ${input.note})
    RETURNING id
  `;
  return { id: String(rows[0].id) };
}
