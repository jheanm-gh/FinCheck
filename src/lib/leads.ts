import { z } from 'zod';

/**
 * POPIA consent model.
 *
 * The distinction that matters: section 69 restricts UNSOLICITED electronic direct
 * marketing. A person who fills in this form asking Harika to call them has solicited
 * that contact — replying to them is not direct marketing. Adding them to a newsletter
 * or calling them later with offers IS, and needs its own opt-in.
 *
 * So consent is split in two and never bundled:
 *
 *   contactConsent  - required. "Contact me about this enquiry." Transactional.
 *   marketingConsent - optional, defaults FALSE, never pre-ticked. Silence is not
 *                      consent, so an untouched checkbox must mean no.
 *
 * Note the Information Regulator treats telephone calls as electronic communication,
 * so a phone call selling something later needs marketingConsent too — not just email.
 *
 * CONSENT_WORDING is versioned and the exact string is stored with the lead. If you
 * later need to prove what somebody agreed to, "they ticked a box" is not evidence.
 * Bump the version whenever the wording changes.
 */
export const CONSENT_VERSION = '2026-08-31.1';

export const CONSENT_WORDING = {
  contact:
    'I would like Harika van der Merwe to contact me about this enquiry, using the ' +
    'details I have provided.',
  marketing:
    'Separately, I agree to receive occasional financial education and updates by ' +
    'email or WhatsApp. I can withdraw this at any time, and every message will say how.',
} as const;

export const LEAD_INTENTS = [
  'providing_for_children', 'paying_off_bond', 'income_replacement', 'covering_debts',
  'employer_benefit_uncertainty', 'review_existing_cover', 'life_change',
  'retirement', 'investments', 'education_planning', 'estate_legacy',
  'family_protection', 'business_protection', 'health_cover', 'gap_cover',
  'financial_resilience', 'not_sure',
] as const;

export type LeadIntent = (typeof LEAD_INTENTS)[number];

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, 'Please enter your first name').max(80),
  surname: z.string().trim().max(80).optional().or(z.literal('')),
  email: z.string().trim().email('Please enter a valid email address').max(160),
  mobile: z.string().trim().max(30).optional().or(z.literal('')),

  intent: z.enum(LEAD_INTENTS).optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  message: z.string().trim().max(1200).optional().or(z.literal('')),

  /** Band only — never the individual answers. Minimisation over completeness. */
  checkBand: z.enum(['attention', 'developing', 'ontrack', 'strong']).optional(),

  contactConsent: z.literal(true, {
    errorMap: () => ({ message: 'We need your permission to reply to you.' }),
  }),
  marketingConsent: z.boolean().default(false),

  source: z.string().max(60).default('site'),
  campaign: z.string().max(80).optional(),
  utmSource: z.string().max(80).optional(),
  utmMedium: z.string().max(80).optional(),
  utmCampaign: z.string().max(80).optional(),

  /** Honeypot. Bots fill it, humans never see it. */
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export interface StoredLead extends Omit<LeadInput, 'website'> {
  id: string;
  receivedAt: string;
  consent: {
    version: string;
    contactWording: string;
    contactAgreedAt: string;
    marketingWording: string | null;
    marketingAgreedAt: string | null;
  };
}

export function buildStoredLead(input: LeadInput, id: string, now = new Date()): StoredLead {
  const { website: _ignored, ...rest } = input;
  const iso = now.toISOString();
  return {
    ...rest,
    id,
    receivedAt: iso,
    consent: {
      version: CONSENT_VERSION,
      contactWording: CONSENT_WORDING.contact,
      contactAgreedAt: iso,
      marketingWording: input.marketingConsent ? CONSENT_WORDING.marketing : null,
      marketingAgreedAt: input.marketingConsent ? iso : null,
    },
  };
}
