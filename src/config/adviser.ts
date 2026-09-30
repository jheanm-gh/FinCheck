/**
 * SINGLE SOURCE OF TRUTH for identity, contact and compliance wording.
 *
 * ── POSITIONING ───────────────────────────────────────────────────────────
 * This site is an INFORMATION RESOURCE, not financial services advertising.
 *
 * That is a deliberate position, and it is what resolves the FAIS conflict that
 * previously blocked launch: no financial service is advertised here, so no FSP
 * disclosure is required, so the institution need not be named.
 *
 * The position has to stay true in substance, not just in wording. What keeps it true:
 *   - No product or product category is named, recommended or implied anywhere.
 *   - The health check collects no figures and outputs bands, never scores or targets.
 *   - Calculators show their assumptions and map to no product.
 *   - Topic pages explain an area; they do not target an audience or capture on-page.
 *   - The contact form is a general enquiry, not a qualification by product need.
 *   - Harika's professional role appears as biographical fact on /about only. It is
 *     not used as site positioning — not in navigation, page titles, metadata or the
 *     homepage hero.
 *
 * Anything that reintroduces product framing or need-based qualification breaks the
 * position and puts the FAIS question back on the table.
 *
 * ── INSTITUTIONAL SEPARATION ──────────────────────────────────────────────
 * The key individual approved an independent site on condition that all mention of
 * and links to Sanlam be removed. Concept Wealth's name and links were subsequently
 * confirmed as permitted.
 */

export const PLACEHOLDER = Symbol('needs-compliance-input');
export type Placeholder = typeof PLACEHOLDER;

export const adviser = {
  name: 'Harika van der Merwe',

  /**
   * Biographical, used on /about only. Was 'Sanlam Financial Adviser'.
   * Deliberately NOT used in nav, titles, metadata or the hero — stating a profession
   * is fact; leading with it is positioning.
   */
  role: 'Financial Adviser',

  /** Permitted by the KI. Sanlam is not. */
  practice: 'Concept Wealth Hennopspark',

  city: 'Pretoria',
  province: 'Gauteng',
  country: 'South Africa',

  /** Her own words. The citation to the institution-hosted source has been removed. */
  positioning:
    'I am dedicated to helping businesses and individuals build long term financial ' +
    'confidence through tailor made wealth planning, risk management and investment strategies.',

  phoneDisplay: '083 331 6235',
  phoneE164: '+27833316235',
  whatsapp: 'https://wa.me/27833316235',
  email: 'harika.vandermerwe@conceptwealth.co.za',

  /**
   * INTENTIONALLY OMITTED, not pending. The practice link carries visitors to it, and
   * the address on file reads "Cnr Sanlam & Alkantrand Road" — the street name alone
   * would put the word on the site.
   */
  practiceAddress: null,

  /**
   * Her own channels plus the practice's own domain.
   * The practice profile hosted on sanlamadvice.co.za is a Sanlam URL and stays out.
   */
  links: {
    linkedin: 'https://www.linkedin.com/in/harika-van-der-merwe-a46690254',
    facebook: 'https://www.facebook.com/share/1EZwKsmDHm/',
    podcast: 'https://open.spotify.com/show/033OI8ClChie4avziJnMMY',
    practice: 'https://www.conceptwealth.co.za',
  },

  /**
   * Local path. Put the file at public/harika.jpg and set photoApproved to true.
   * Do NOT take it from LinkedIn: their terms prohibit automated retrieval and a
   * profile photo is often the photographer's copyright, not the subject's.
   * Until approved, /about renders a designed placeholder rather than a broken image.
   */
  photoUrl: '/harika.jpg',
  photoApproved: false,
} as const;

export const compliance = {
  /**
   * Retained for accuracy, but no FSP disclosure is rendered anywhere on the site:
   * under the information-only position none is required. If the site is ever
   * repositioned to advertise advice, the disclosure becomes mandatory and the
   * institution would have to be named — see openQuestions.
   */
  capacity: 'representative' as 'fsp' | 'representative',

  /** POPIA. Still required before any real submission is accepted. */
  responsibleParty: PLACEHOLDER as Placeholder,
  informationOfficer: PLACEHOLDER as Placeholder,
} as const;

export const openQuestions = [
  'CONFIRM: does compliance accept the information-only position? Nothing on the ' +
    'site advertises or recommends a financial product or service, so no FAIS ' +
    'disclosure is rendered. Worth a written confirmation even though the KI has ' +
    'already approved an independent site.',
  'Who is the POPIA responsible party and Information Officer for data collected here?',
  'Does conceptwealth.co.za itself lead with "authorised by Sanlam"? If so, linking ' +
    'there may reintroduce what was removed.',
  'Photo: supply a file Harika owns and may use commercially.',
  'Where should enquiries actually go? They currently reach server logs only.',
] as const;

export const disclaimers = {
  tool:
    'This tool gives an indicative estimate based only on the figures and assumptions ' +
    'you entered. It is general information for educational purposes, not financial ' +
    'advice and not a recommendation to buy any financial product.',

  check:
    'This check is a general orientation, not a diagnosis. It does not consider your ' +
    'full circumstances and is not financial advice. A proper advice process looks at ' +
    'far more than a short questionnaire can.',

  noProduct:
    'No product is recommended or implied here. Whether anything is suitable for you ' +
    'depends on your circumstances and needs a full advice process.',

  /** The core positioning statement. Names no institution. */
  noService:
    'This website provides general financial information. No financial service is ' +
    'offered here, no financial advice is given, and no financial product is sold, ' +
    'recommended or promoted.',

  independence:
    'This is an independent personal website. It is not operated by, and does not ' +
    'represent, any financial institution or product provider.',
} as const;

export const site = {
  name: 'More Than Just Money',
  nameLines: ['More Than', 'Just Money'] as const,
  nameFull: 'Meer as net geld / More than just money.',
  domain: 'https://climeo.dev',
  tagline: 'Know where you stand.',
  description:
    'Plain-language financial information: a short check of where things stand, ' +
    'calculators that show their assumptions, and a podcast in Afrikaans and English.',
} as const;
