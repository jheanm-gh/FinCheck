import type { Metadata } from 'next';
import { adviser, compliance, site } from '@/config/adviser';
import { complianceText } from '@/lib/compliance';
import { CONSENT_WORDING } from '@/lib/leads';

export const metadata: Metadata = { title: 'Privacy & POPIA' };

export default function PrivacyPage() {
  return (
    <div className="wrap max-w-3xl py-16 sm:py-20">
      <h1>Privacy &amp; POPIA</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">
        How {site.name} handles your information under the Protection of Personal
        Information Act.
      </p>

      <h2 className="mt-14">Who is responsible for your information</h2>
      <p className="mt-4">
        The responsible party is{' '}
        {complianceText(compliance.responsibleParty, 'RESPONSIBLE PARTY')}. The
        Information Officer is{' '}
        {complianceText(compliance.informationOfficer, 'INFORMATION OFFICER')}.
      </p>

      <h2 className="mt-12">What the financial health check collects</h2>
      <p className="mt-4">
        Nothing, unless you choose to send it. The check asks no figures, no ID number and
        nothing about your accounts. Your answers stay in your browser. If you then submit
        the contact form, only your overall band is included, never your individual
        answers.
      </p>

      <h2 className="mt-12">What the contact form collects</h2>
      <p className="mt-4">
        Your name, email address, and optionally your mobile number, what is on your mind,
        how you would prefer to be contacted, and any message you write. That is the
        minimum needed for Harika to reply usefully.
      </p>

      <h2 className="mt-12">Consent, and why it is split in two</h2>
      <p className="mt-4">
        Asking Harika to contact you about your enquiry is separate from agreeing to
        receive marketing. They are two different permissions and we never bundle them.
      </p>
      <div className="surface mt-6 space-y-4 p-6">
        <p className="text-sm"><strong>Required:</strong> {CONSENT_WORDING.contact}</p>
        <p className="text-sm"><strong>Optional, never pre-ticked:</strong> {CONSENT_WORDING.marketing}</p>
      </div>
      <p className="mt-4">
        Under POPIA an untouched box is not consent. If you leave the second box alone,
        you will not be added to any marketing list, and any later call or message selling
        something would require that permission first.
      </p>
      <p className="mt-4">
        We keep a record of exactly which wording you agreed to and when, so that what you
        consented to is never a matter of memory.
      </p>

      <h2 className="mt-12">Withdrawing consent</h2>
      <p className="mt-4">
        You can withdraw marketing consent at any time by emailing{' '}
        <a href={`mailto:${adviser.email}`} className="underline">{adviser.email}</a>. Every
        marketing message will identify who sent it and how to stop it.
      </p>

      <h2 className="mt-12">Your rights</h2>
      <p className="mt-4">
        You may ask what information is held about you, ask for it to be corrected or
        deleted, object to its use, and complain to the Information Regulator.
      </p>

      <h2 className="mt-12">Sanlam&rsquo;s own policy</h2>
      <p className="mt-4">
        Where you deal with Sanlam directly, or follow a link from here into a Sanlam
        system, Sanlam&rsquo;s{' '}
        <a href={adviser.links.sanlamPrivacy} className="underline" rel="noopener">privacy policy</a>{' '}
        applies to that interaction rather than this one.
      </p>

      <div className="mt-14 rounded border-2 border-dashed border-[var(--color-clay)] p-6">
        <p className="text-sm font-semibold text-[var(--color-clay)]">Not yet legally complete</p>
        <p className="mt-2 text-sm text-[var(--color-clay)]">
          This page describes what the site actually does technically, which is accurate.
          It is not yet a valid privacy notice: the responsible party and Information
          Officer must be confirmed by {adviser.practice}, and the whole notice reviewed by
          whoever handles their POPIA compliance, before this site accepts real submissions.
        </p>
      </div>
    </div>
  );
}
