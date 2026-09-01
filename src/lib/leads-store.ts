import type { StoredLead } from './leads';

/**
 * Read side of the lead store.
 *
 * Returns `null` when no database is configured, which is the current state and is
 * deliberate: nothing writes to Supabase until the POPIA responsible party is settled
 * (see supabase/migrations/0001_init.sql). The dashboard renders an honest empty state
 * rather than pretending to be connected.
 */
export interface LeadRow extends StoredLead {
  status: string;
}

export function isStoreConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function listLeads(): Promise<LeadRow[] | null> {
  if (!isStoreConfigured()) return null;

  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc&limit=200`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      cache: 'no-store',
    },
  );
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
  return res.json();
}
