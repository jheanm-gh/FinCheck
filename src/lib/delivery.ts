import type { StoredLead } from './leads';
import { adviser } from '@/config/adviser';

/**
 * Lead delivery adapter.
 *
 * Destination was still undecided at build time, so this is deliberately swappable.
 * Set LEAD_DELIVERY to choose. Default 'log' works with no credentials at all, which
 * means the site deploys and functions before any inbox or CRM decision is made.
 *
 *   log    - server log only (default; fine for staging)
 *   resend - email to the adviser via Resend
 *   webhook- POST to LEAD_WEBHOOK_URL (Zapier, Make, Sheets, a CRM)
 *
 * Nothing here writes to a database yet. Storing household financial data needs the
 * POPIA responsible party settled first (see src/config/adviser.ts).
 */
export async function deliverLead(lead: StoredLead): Promise<void> {
  const mode = process.env.LEAD_DELIVERY ?? 'log';

  if (mode === 'resend') {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_TO_EMAIL ?? adviser.email;
    if (!key) throw new Error('RESEND_API_KEY missing');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? 'More Than Just Money <onboarding@resend.dev>',
        to: [to],
        subject: `New enquiry — ${lead.firstName} ${lead.surname ?? ''}`.trim(),
        text: formatLead(lead),
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return;
  }

  if (mode === 'webhook') {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) throw new Error('LEAD_WEBHOOK_URL missing');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return;
  }

  console.info('[lead received]\n' + formatLead(lead));
}

function formatLead(l: StoredLead): string {
  return [
    `Name:       ${l.firstName} ${l.surname ?? ''}`.trim(),
    `Email:      ${l.email}`,
    `Mobile:     ${l.mobile || '—'}`,
    `Prefers:    ${l.preferredContact}`,
    `Intent:     ${l.intent ?? '—'}`,
    `Check band: ${l.checkBand ?? '—'}`,
    `Source:     ${l.source}${l.campaign ? ` / ${l.campaign}` : ''}`,
    '',
    `Message:    ${l.message || '—'}`,
    '',
    '--- Consent record (POPIA) ---',
    `Version:    ${l.consent.version}`,
    `Contact:    agreed ${l.consent.contactAgreedAt}`,
    `Marketing:  ${l.consent.marketingAgreedAt ? `agreed ${l.consent.marketingAgreedAt}` : 'NOT GIVEN — do not send marketing'}`,
  ].join('\n');
}
