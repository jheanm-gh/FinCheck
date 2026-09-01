import Link from 'next/link';
import { adviser, site } from '@/config/adviser';

const NAV = [
  { href: '/check', label: 'Financial health check' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About Harika' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="border-b bg-[var(--color-mist)]">
      <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-3 py-4">
        <Link
          href="/"
          aria-label={`${site.name} — home`}
          className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold leading-[1.05] tracking-tight"
        >
          {site.nameLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </Link>
        <p className="order-3 w-full text-sm text-[var(--color-quill)] sm:order-2 sm:w-auto sm:border-l sm:pl-8">
          {adviser.name} · {adviser.role}
        </p>
        <nav aria-label="Main" className="order-2 ml-auto sm:order-3">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-[var(--color-clay)] hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
