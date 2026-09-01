# Climeo

Financial health check and lead generation for **Harika van der Merwe**, Sanlam Financial
Adviser at Concept Wealth Hennopspark, Pretoria.

Next.js 16 · TypeScript · Tailwind 4 · Zod · Vitest. Deploys to `climeo.dev` on Vercel.

## Not cleared for launch

This site must not accept real submissions until the items in `src/config/adviser.ts`
are resolved. They render as a visible red block in the footer until then.

The blocking question is **not** the FSP number. Harika appears on a Sanlam BlueStar
practice site, which normally means she advises as a *representative under Sanlam's FSP
licence* rather than as an FSP in her own right. If so:

- The FAIS General Code requires a key individual to approve advertising before
  publication, and the FSP to keep a record of it. This site is advertising.
- Tied and BlueStar advisers are usually restricted by contract from running
  independently branded client-facing sites with their own lead capture.
- POPIA needs a named responsible party for data collected here. That is a legal
  entity, and it has not been established which one.

Confirm all three with Concept Wealth's key individual before going further.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # 20 unit tests
npm run typecheck
npm run build
```

Builds use `--webpack`. Turbopack currently breaks on `@tailwindcss/postcss`
(`Missing field 'negated' on ScannerOptions.sources`). Revisit when Tailwind ships a fix.

## Structure

```
src/config/adviser.ts    every fact about Harika + compliance placeholders
src/lib/compliance.ts    makes unresolved placeholders loudly visible
src/lib/check.ts         12 questions, 4 pillars, scoring
src/lib/calculators.ts   calculator framework + 3 calculators
src/lib/leads.ts         lead schema + POPIA consent model
src/lib/delivery.ts      swappable lead destination
```

## Design decisions

**The check asks no figures.** Sanlam already gives Harika a Financial Check that
collects numbers. Duplicating it would be worse, and would put household financial data
in a database we cannot yet name a responsible party for. Twelve recognition questions
instead: no rands, no ID number, no balances.

**Bands, not scores.** Output is one of four bands, never a score out of 100, and the
method is shown to the user. There is no validated methodology behind it and the site
does not pretend otherwise.

**The indicator ramp is one hue.** Not red-amber-green. Traffic lights imply clinical
precision this tool does not have, and sell through alarm.

**Consent is split in two.** POPIA s69 restricts *unsolicited* electronic marketing.
Someone asking to be contacted has solicited that reply; adding them to a mailing list
has not. Marketing consent is separate, never pre-ticked, and the exact wording agreed
to is stored with a version stamp.

## Lead delivery

Destination was undecided at build time, so `src/lib/delivery.ts` is an adapter.
Default `log` needs no credentials. See `.env.example`.

Nothing writes to a database yet, deliberately, pending the POPIA question above.

## Content decisions worth preserving

**The education centre is her podcast, not articles.** §21 asked for ten written
articles. Harika already publishes *Meer as net geld / More than just money.* Writing
finance articles under her name would duplicate her own content and Sanlam's blog, and
would put unreviewed financial content on a site advertising a licensed representative.
`src/content/podcast.ts` carries real titles, dates and durations only — no invented
episode summaries. The `pillar` mappings are editorial guesses from titles and need
her correction.

**Lead magnets are questions, not advice.** A checklist saying "keep six months of
expenses saved" is financial advice published without an advice process. A checklist
saying "ask how many months your savings would cover" is an agenda. All three guides in
`src/content/guides.ts` are framed as questions for exactly this reason.

**Campaign pages are noindex.** They are ad destinations, not organic search targets,
and indexing them competes with the pages that should rank.

## Not built yet

Seven more lead magnets, Protect/Prepare/Grow/Plan hub pages, analytics event wiring,
and Afrikaans localisation. The podcast is bilingual and the site is English-only — for
a Pretoria practice that is a real gap, not a nice-to-have.
