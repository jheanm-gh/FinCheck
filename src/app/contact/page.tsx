import type { Metadata } from 'next';
import { adviser } from '@/config/adviser';
import { LeadForm } from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${adviser.name}, ${adviser.role} at ${adviser.practice}.`,
};

export default function ContactPage() {
  return (
    <div className="wrap max-w-3xl py-16 sm:py-20">
      <h1>Talk to Harika</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">
        Send your details and she will come back to you. Or reach her directly, whichever
        you prefer.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href={`tel:${adviser.phoneE164}`} className="btn btn-secondary">Call {adviser.phoneDisplay}</a>
        <a href={adviser.whatsapp} className="btn btn-secondary" rel="noopener">WhatsApp</a>
        <a href={`mailto:${adviser.email}`} className="btn btn-secondary">Email</a>
      </div>

      <div className="mt-12"><LeadForm source="contact" /></div>
    </div>
  );
}
