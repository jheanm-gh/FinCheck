import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap max-w-2xl py-24">
      <h1>That page isn&rsquo;t here</h1>
      <p className="mt-5 text-lg text-[var(--color-bark)]">
        The link may be out of date. The financial health check is the best place to start.
      </p>
      <Link href="/check" className="btn btn-primary mt-8">Take the financial health check</Link>
    </div>
  );
}
