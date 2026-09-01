'use client';

import { useState } from 'react';

export function AdviserLogin() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/adviser-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passphrase: String(fd.get('passphrase') ?? '') }),
    });
    if (res.ok) window.location.reload();
    else {
      setError('That passphrase was not accepted.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface mt-8 p-6">
      <label htmlFor="passphrase" className="text-sm font-medium">Passphrase</label>
      <input
        id="passphrase" name="passphrase" type="password" required autoComplete="current-password"
        className="mt-1.5 w-full rounded border bg-[var(--color-mist)] px-4 py-3"
      />
      {error && <p className="mt-3 text-sm text-[var(--color-clay)]" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary mt-5 w-full">
        {busy ? 'Checking…' : 'Continue'}
      </button>
      <p className="legal mt-4">
        A shared passphrase, not real authentication. Adequate for one adviser; replace
        with Supabase Auth before this holds live client data.
      </p>
    </form>
  );
}
