import type { Metadata } from 'next';
import { isAuthenticated } from '@/lib/adviser-auth';
import { listLeads, isStoreConfigured } from '@/lib/leads-store';
import { AdviserLogin } from '@/components/AdviserLogin';

export const metadata: Metadata = { title: 'Leads', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  new: 'New', contacted: 'Contacted', meeting_booked: 'Meeting booked',
  follow_up: 'Follow-up', converted: 'Converted',
  not_suitable: 'Not suitable', closed: 'Closed',
};

export default async function LeadsPage() {
  if (!(await isAuthenticated())) {
    return (
      <div className="wrap max-w-md py-20">
        <h1>Adviser area</h1>
        <AdviserLogin />
      </div>
    );
  }

  let leads = null;
  let error: string | null = null;
  try {
    leads = await listLeads();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Could not load leads';
  }

  return (
    <div className="wrap py-16">
      <h1>Leads</h1>

      {!isStoreConfigured() && (
        <div className="surface mt-8 border-2 border-dashed border-[var(--color-clay)] p-6">
          <p className="font-semibold text-[var(--color-clay)]">No database connected</p>
          <p className="mt-2 text-sm text-[var(--color-clay)]">
            Nothing is being stored. Enquiries currently go straight to whatever{' '}
            <code>LEAD_DELIVERY</code> is set to and are not retained by this site.
            The schema is written and waiting in <code>supabase/migrations/</code>, but
            applying it needs the POPIA responsible party settled first.
          </p>
        </div>
      )}

      {error && <p className="mt-8 text-[var(--color-clay)]" role="alert">{error}</p>}

      {leads && leads.length === 0 && (
        <p className="mt-8 text-[var(--color-bark)]">No enquiries yet.</p>
      )}

      {leads && leads.length > 0 && (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead className="border-b">
              <tr className="text-[var(--color-quill)]">
                <th scope="col" className="py-3 pr-4 font-medium">Received</th>
                <th scope="col" className="py-3 pr-4 font-medium">Name</th>
                <th scope="col" className="py-3 pr-4 font-medium">Contact</th>
                <th scope="col" className="py-3 pr-4 font-medium">Intent</th>
                <th scope="col" className="py-3 pr-4 font-medium">Band</th>
                <th scope="col" className="py-3 pr-4 font-medium">Source</th>
                <th scope="col" className="py-3 pr-4 font-medium">Marketing</th>
                <th scope="col" className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {new Date(l.receivedAt).toLocaleDateString('en-ZA')}
                  </td>
                  <td className="py-3 pr-4">{l.firstName} {l.surname}</td>
                  <td className="py-3 pr-4">
                    <a href={`mailto:${l.email}`} className="underline">{l.email}</a>
                    {l.mobile && <div className="text-[var(--color-quill)]">{l.mobile}</div>}
                  </td>
                  <td className="py-3 pr-4">{l.intent ?? '—'}</td>
                  <td className="py-3 pr-4">{l.checkBand ?? '—'}</td>
                  <td className="py-3 pr-4">{l.source}</td>
                  <td className="py-3 pr-4">
                    {l.consent?.marketingAgreedAt
                      ? <span className="text-[var(--color-band-4)]">Yes</span>
                      : <span className="text-[var(--color-clay)]">No — do not market</span>}
                  </td>
                  <td className="py-3">{STATUS_LABEL[l.status] ?? l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="legal mt-10">
        This page shows personal information. Do not leave it open on a shared screen.
      </p>
    </div>
  );
}
