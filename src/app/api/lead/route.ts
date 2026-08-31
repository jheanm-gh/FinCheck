import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { leadSchema, buildStoredLead } from '@/lib/leads';
import { deliverLead } from '@/lib/delivery';

/** Crude in-memory rate limit. Replace with Upstash/KV when there is more than one instance. */
const hits = new Map<string, { n: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX = 5;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.resetAt) {
    hits.set(ip, { n: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Please wait a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Could not read that submission.' }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot filled: accept silently so bots do not learn anything.
    const rec = body as Record<string, unknown>;
    if (typeof rec?.website === 'string' && rec.website.length > 0) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' },
      { status: 400 },
    );
  }

  const lead = buildStoredLead(parsed.data, randomUUID());

  try {
    await deliverLead(lead);
  } catch (err) {
    console.error('[lead] delivery failed', { id: lead.id, err });
    return NextResponse.json({ error: 'We could not send that just now. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
