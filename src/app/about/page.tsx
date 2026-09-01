import type { Metadata } from 'next';
import Link from 'next/link';
import { adviser } from '@/config/adviser';
import { disclosureSentence } from '@/lib/compliance';
import { SocialLinks } from '@/components/SocialLinks';

export const metadata: Metadata = {
  title: 'About Harika',
  description: `${adviser.name} is a ${adviser.role} at ${adviser.practice} in ${adviser.city}.`,
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
      <p className="legal mt-3">
        From her <a href={adviser.links.sanlamProfile} className="underline" rel="noopener">official Sanlam adviser profile</a>.
      </p>

      <h2 className="mt-16">How advice works here</h2>
      <p className="mt-4">
        Climeo is Harika&rsquo;s own site. It is not operated by Sanlam and it is not
        Sanlam&rsquo;s corporate website. The tools here are educational: they help you
        work out what to ask, and nothing on this site is a recommendation.
      </p>
      <p className="mt-4">{disclosureSentence()}</p>
      <p className="mt-4">
        Before any advice is given you should receive a disclosure letter setting out what
        she may advise on, which product suppliers she represents, and how she is paid.
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
