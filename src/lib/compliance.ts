import { adviser, compliance, PLACEHOLDER, type Placeholder } from '@/config/adviser';

const adviserName = adviser.name;

export function isPlaceholder(v: unknown): v is Placeholder {
  return v === PLACEHOLDER;
}

/**
 * Renders a compliance value, or a loud visible marker if it has not been supplied.
 *
 * Deliberately NOT silent. A missing FSP number that renders as an empty string is
 * how a site ships with a regulatory gap nobody noticed.
 */
export function complianceText(v: unknown, label: string): string {
  return isPlaceholder(v) ? `[${label} — PENDING COMPLIANCE INPUT]` : String(v);
}

/**
 * Disclosure sentence, phrased for the confirmed capacity.
 * A representative and an FSP require materially different wording.
 */
export function disclosureSentence(): string {
  const entity = complianceText(compliance.licensedEntity, 'LICENSED ENTITY');
  const fsp = complianceText(compliance.fspNumber, 'FSP NUMBER');
  return compliance.capacity === 'representative'
    ? `${adviserName} provides financial advice as an appointed representative of ${entity}, FSP ${fsp}. She does not hold a financial services licence in her own name.`
    : `${adviserName} provides financial advice through ${entity}, FSP ${fsp}.`;
}

/** Everything still outstanding before this site may lawfully go live. */
export function outstandingComplianceItems(): string[] {
  const missing: string[] = [];
  if (isPlaceholder(compliance.fspNumber)) missing.push('Approval to display the FSP licence number');
  if (isPlaceholder(compliance.licensedEntity)) missing.push('Licensed entity legal name');
  if (isPlaceholder(compliance.responsibleParty)) missing.push('POPIA responsible party');
  if (isPlaceholder(compliance.informationOfficer)) missing.push('POPIA Information Officer');
  if (!compliance.advertisingApproved) missing.push('FAIS advertising approval by a key individual');
  return missing;
}

export function isLaunchReady(): boolean {
  return outstandingComplianceItems().length === 0;
}
