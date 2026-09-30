import type { Metadata } from 'next';
import Link from 'next/link';
import { adviser, disclaimers, site } from '@/config/adviser';
import { SocialLinks } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'About Harika',
  description: `About ${adviser.name} and the podcast this site is named after.`,
};

export default function AboutPage() {
  return (
    <div className="wrap max-w-3xl py-16 sm:py-20">
      <h1>{adviser.name}</h1>
      <p className="mt-3 text-lg text-[var(--color-quill)]">
        {adviser.role} · {adviser.practice}
      </p>

      {/* Her own words, quoted once, from her official profile. */}
      <blockquote className="mt-10 border-l-2 border-[var(--color-band-3)] pl-6 font-[family-name:var(--font-display)] text-2xl leading-snug">
        {adviser.positioning}
      </blockquote>

      <h2 className="mt-16">What this site is</h2>
      <p className="mt-4">{disclaimers.noService}</p>
      <p className="mt-4">{disclaimers.independence}</p>
      <p className="mt-4">
        Professionally, Harika is a {adviser.role} at{' '}
        <a href={adviser.links.practice} className="underline" target="_blank" rel="noopener noreferrer">
          {adviser.practice}
        </a>{' '}
        in {adviser.city}. That work is separate from this site. Anything arranged
        through her practice follows its own process, with its own disclosures.
      </p>

      <h2 className="mt-16">Follow Harika</h2>
      <p className="mt-4 text-[var(--color-bark)]">
        She publishes a podcast and posts regularly. Worth a listen before you book
        anything.
      </p>
      <SocialLinks className="mt-6" />

      <h2 className="mt-16">Get in touch</h2>
      <p className="mt-4">
        Call <a href={`tel:${adviser.phoneE164}`} className="underline">{adviser.phoneDisplay}</a>,{' '}
        <a href={adviser.whatsapp} className="underline" rel="noopener">message on WhatsApp</a>, or email{' '}
        <a href={`mailto:${adviser.email}`} className="underline">{adviser.email}</a>.
      </p>
      <p className="mt-4 text-[var(--color-bark)]">{adviser.practiceAddress}</p>
      <Link href="/contact" className="btn btn-primary mt-8">Send your details</Link>
    </div>
  );
}
