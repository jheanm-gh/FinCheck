import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/**
 * Minimal gate for the adviser area.
 *
 * This is a shared passphrase, not real authentication. It is adequate for a single
 * adviser looking at her own enquiries, and it is NOT adequate the moment a second
 * person needs access, or if the dashboard ever shows more than contact details.
 *
 * Replace with Supabase Auth before this holds live client data. The RLS policies in
 * supabase/migrations already expect a JWT with role='adviser'.
 */
const COOKIE = 'climeo_adviser';

const digest = (s: string) => createHash('sha256').update(s).digest();

export function verifyPassphrase(input: string): boolean {
  const expected = process.env.ADVISER_PASSPHRASE;
  if (!expected || expected.length < 12) return false;
  // Constant-time: hashing first makes both sides equal length.
  return timingSafeEqual(digest(input), digest(expected));
}

export function sessionToken(): string {
  const secret = process.env.ADVISER_PASSPHRASE ?? '';
  return createHash('sha256').update(`climeo:${secret}`).digest('hex');
}

export async function isAuthenticated(): Promise<boolean> {
  if (!process.env.ADVISER_PASSPHRASE) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken()));
  } catch {
    return false;
  }
}

export const COOKIE_NAME = COOKIE;
