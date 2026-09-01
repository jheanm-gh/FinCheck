'use client';

import { useState } from 'react';
import { readUtm } from '@/lib/utm';
import { CONSENT_WORDING, LEAD_INTENTS } from '@/lib/leads';
import { adviser } from '@/config/adviser';

const INTENT_LABELS: Partial<Record<(typeof LEAD_INTENTS)[number], string>> = {
  family_protection: 'Protecting my family',
  income_replacement: 'Protecting my income',
  paying_off_bond: 'Paying off my bond or debt',
  investments: 'Starting or reviewing investments',
  financial_resilience: 'Building up savings',
  retirement: 'Preparing for retirement',
  education_planning: 'Planning for my children',
  review_existing_cover: 'Reviewing cover I already have',
  estate_legacy: 'Planning my estate',
  business_protection: 'Protecting my business',
  not_sure: 'I am not sure where to start',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function LeadForm({
  checkBand, source = 'site', campaign, intent, onSuccess,
}: {
  checkBand?: string; source?: string; campaign?: string;
  intent?: string; onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName: String(fd.get('firstName') ?? ''),
      surname: String(fd.get('surname') ?? ''),
      email: String(fd.get('email') ?? ''),
      mobile: String(fd.get('mobile') ?? ''),
      intent: (fd.get('intent') || intent || undefined) as string | undefined,
      preferredContact: String(fd.get('preferredContact') ?? 'email'),
      message: String(fd.get('message') ?? ''),
      contactConsent: fd.get('contactConsent') === 'on',
      marketingConsent: fd.get('marketingConsent') === 'on',
      website: String(fd.get('website') ?? ''),
      checkBand,
      source,
      campaign,
      ...(typeof window !== 'undefined' ? readUtm(window.location.search) : {}),
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      onSuccess?.();
    } catch {
      setError('We could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="surface p-8" role="status">
        <h3>Your details are with Harika</h3>
        <p className="measure mt-3">
          She will be in touch. If you would rather not wait, reach her on{' '}
          <a href={adviser.whatsapp} className="underline" rel="noopener">WhatsApp</a> or{' '}
          <a href={`tel:${adviser.phoneE164}`} className="underline">{adviser.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const field = 'mt-1.5 w-full rounded border bg-[var(--color-mist)] px-4 py-3 text-base';

  return (
    <form onSubmit={onSubmit} className="surface p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium">First name</label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className={field} />
        </div>
        <div>
          <label htmlFor="surname" className="text-sm font-medium">
            Surname <span className="text-[var(--color-quill)]">(optional)</span>
          </label>
          <input id="surname" name="surname" autoComplete="family-name" className={field} />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" inputMode="email" className={field} />
        </div>
        <div>
          <label htmlFor="mobile" className="text-sm font-medium">
            Mobile <span className="text-[var(--color-quill)]">(optional)</span>
          </label>
          <input id="mobile" name="mobile" type="tel" autoComplete="tel" inputMode="tel" className={field} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="intent" className="text-sm font-medium">What is on your mind?</label>
        <select id="intent" name="intent" className={field} defaultValue="">
          <option value="">Select one</option>
          {Object.entries(INTENT_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="preferredContact" className="text-sm font-medium">How should she reach you?</label>
        <select id="preferredContact" name="preferredContact" className={field} defaultValue="email">
          <option value="email">Email</option>
          <option value="phone">Phone call</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="text-sm font-medium">
          Anything you want her to know <span className="text-[var(--color-quill)]">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} className={field} />
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 space-y-4 border-t pt-6">
        <label className="flex cursor-pointer gap-3 text-sm">
          <input type="checkbox" name="contactConsent" required className="mt-1 h-4 w-4 shrink-0" />
          <span>{CONSENT_WORDING.contact}</span>
        </label>

        {/* Never pre-ticked: under POPIA, silence cannot mean consent. */}
        <label className="flex cursor-pointer gap-3 text-sm">
          <input type="checkbox" name="marketingConsent" className="mt-1 h-4 w-4 shrink-0" />
          <span className="text-[var(--color-quill)]">{CONSENT_WORDING.marketing}</span>
        </label>
      </div>

      {error && (
        <p className="mt-5 text-sm font-medium text-[var(--color-clay)]" role="alert">{error}</p>
      )}

      <button type="submit" disabled={status === 'sending'} className="btn btn-primary mt-7 w-full sm:w-auto">
        {status === 'sending' ? 'Sending…' : 'Send my details'}
      </button>

      <p className="legal mt-5">
        Only what you typed above is sent. Your check answers are not included, only the
        overall band, and only if you did the check.
      </p>
    </form>
  );
}
