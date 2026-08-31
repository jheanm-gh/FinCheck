import { compliance, PLACEHOLDER, type Placeholder } from '@/config/adviser';

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

/** Everything still outstanding before this site may lawfully go live. */
export function outstandingComplianceItems(): string[] {
  const missing: string[] = [];
  if (isPlaceholder(compliance.capacity)) missing.push('Adviser capacity (FSP vs representative)');
  if (isPlaceholder(compliance.fspNumber)) missing.push('FSP licence number');
  if (isPlaceholder(compliance.licensedEntity)) missing.push('Licensed entity legal name');
  if (isPlaceholder(compliance.responsibleParty)) missing.push('POPIA responsible party');
  if (isPlaceholder(compliance.informationOfficer)) missing.push('POPIA Information Officer');
  if (!compliance.advertisingApproved) missing.push('FAIS advertising approval by a key individual');
  return missing;
}

export function isLaunchReady(): boolean {
  return outstandingComplianceItems().length === 0;
}
