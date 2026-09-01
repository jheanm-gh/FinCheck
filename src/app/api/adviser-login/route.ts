import { NextResponse } from 'next/server';
import { verifyPassphrase, sessionToken, COOKIE_NAME } from '@/lib/adviser-auth';

const attempts = new Map<string, { n: number; resetAt: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const rec = attempts.get(ip);

  if (rec && now < rec.resetAt && rec.n >= 5) {
    return NextResponse.json({ error: 'Too many attempts.' }, { status: 429 });
  }

  const { passphrase } = await req.json().catch(() => ({ passphrase: '' }));

  if (!verifyPassphrase(String(passphrase ?? ''))) {
    attempts.set(ip, {
      n: rec && now < rec.resetAt ? rec.n + 1 : 1,
      resetAt: rec && now < rec.resetAt ? rec.resetAt : now + 900_000,
    });
    return NextResponse.json({ error: 'Rejected' }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/adviser',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
