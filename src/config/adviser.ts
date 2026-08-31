/**
 * SINGLE SOURCE OF TRUTH for adviser identity, contact and compliance wording.
 *
 * Every value is marked with its provenance:
 *   VERIFIED    - taken from Harika's official Sanlam adviser profile (see sourceUrl)
 *   PLACEHOLDER - MUST be supplied/approved by Concept Wealth or Sanlam compliance
 *                 before this site goes live. Nothing here is invented.
 *
 * Fabricating FSP numbers, licence wording, qualifications or approvals is not
 * acceptable. Placeholders render visibly in non-production builds so they cannot
 * be shipped by accident (see src/lib/compliance.ts).
 */

export const PLACEHOLDER = Symbol('needs-compliance-input');
export type Placeholder = typeof PLACEHOLDER;

export const adviser = {
  // ---- VERIFIED: identity -------------------------------------------------
  name: 'Harika van der Merwe',
  role: 'Sanlam Financial Adviser',
  practice: 'Concept Wealth Hennopspark',
  city: 'Pretoria',
  province: 'Gauteng',
  country: 'South Africa',

  /** VERIFIED: her own words from the official profile. Used once, on /about. */
  positioning:
    'I am dedicated to helping businesses and individuals build long term financial ' +
    'confidence through tailor made wealth planning, risk management and investment strategies.',

  // ---- VERIFIED: contact --------------------------------------------------
  phoneDisplay: '083 331 6235',
  phoneE164: '+27833316235',
  whatsapp: 'https://wa.me/27833316235',
  email: 'harika.vandermerwe@conceptwealth.com',

  /**
   * VERIFIED but AMBIGUOUS: the practice footer lists jdhenry@conceptwealth.co.za
   * (.co.za) while Harika's own address is @conceptwealth.com (.com). Confirm which
   * domain is correct before enabling any outbound mail from this site.
   */
  practiceEmail: 'jdhenry@conceptwealth.co.za',
  practiceAddress:
    'Sanlynn Building, Cnr Sanlam & Alkantrand Road, Lynnwood Manor, Pretoria, 0081',

  // ---- VERIFIED: official links -------------------------------------------
  links: {
    sanlamProfile:
      'https://www.sanlamadvice.co.za/bluestar/conceptwealth-hennopspark/adviser/harika-van-der-merwe/88842552158368',
    conceptWealth: 'https://www.sanlamadvice.co.za/bluestar/conceptwealth-hennopspark',
    linkedin: 'https://www.linkedin.com/in/harika-van-der-merwe-a46690254/',
    sanlamPrivacy: 'https://www.sanlam.com/sanlams-privacy-policy.php',
    sanlamTerms: 'https://www.sanlam.com/terms-of-use.php',
  },

  /**
   * VERIFIED: hosted on Sanlam's CDN. Do NOT hotlink in production without
   * permission — download, get sign-off, and serve from /public instead.
   */
  photoUrl: 'https://www.sanlamadvice.co.za/intermediary-images/8693',
  photoApproved: false,

  sourceUrl:
    'https://www.sanlamadvice.co.za/bluestar/conceptwealth-hennopspark/adviser/harika-van-der-merwe/88842552158368',
} as const;

/**
 * COMPLIANCE BLOCK — every value here is a placeholder.
 *
 * Harika appears on a Sanlam BlueStar practice site, which normally means she acts
 * as a REPRESENTATIVE under Sanlam's FSP licence rather than as an FSP in her own
 * right. That distinction changes the required disclosure wording materially, so it
 * must be confirmed rather than guessed.
 */
export const compliance = {
  /** Is she an authorised FSP, or a representative under one? Determines wording. */
  capacity: PLACEHOLDER as Placeholder, // 'fsp' | 'representative'

  /** FSP licence number of the licensed entity. NEVER invent this. */
  fspNumber: PLACEHOLDER as Placeholder,

  /** Full legal name of the licensed entity she represents. */
  licensedEntity: PLACEHOLDER as Placeholder,

  /** POPIA responsible party — the legal entity accountable for data collected here. */
  responsibleParty: PLACEHOLDER as Placeholder,

  /** POPIA Information Officer name + contact, as registered with the Regulator. */
  informationOfficer: PLACEHOLDER as Placeholder,

  /**
   * Product-supplier disclosure required by the FAIS General Code.
   * Sanlam's own footer line, reproduced verbatim from the official profile, is the
   * closest verified wording available. It describes Sanlam Life, NOT this website,
   * so it cannot stand alone as this site's disclosure.
   */
  sanlamEntityLine:
    'Sanlam Life Insurance Limited is a licensed Life Insurer, authorised Financial ' +
    'Services Provider and registered Credit Provider (NCRCP43).',

  /**
   * Did a Sanlam/Concept Wealth key individual approve this site as advertising?
   * The FAIS General Code requires pre-publication approval and a retained record.
   * Ship-blocking: leave false until written approval exists.
   */
  advertisingApproved: false,
} as const;

/** Non-negotiable wording shown on every tool output. Safe to ship as-is. */
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
} as const;

export const site = {
  name: 'Climeo',
  domain: 'https://climeo.dev',
  tagline: 'Know where you stand.',
  description:
    'A short, plain-language check of where your finances stand — and a direct line to ' +
    `${adviser.name}, ${adviser.role} at ${adviser.practice} in ${adviser.city}.`,
} as const;
