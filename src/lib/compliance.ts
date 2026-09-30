import { compliance, PLACEHOLDER, type Placeholder } from '@/config/adviser';

export function isPlaceholder(v: unknown): v is Placeholder {
  return v === PLACEHOLDER;
}

/**
 * Renders a compliance value, or a loud visible marker if it has not been supplied.
 * Deliberately not silent: a missing value that renders as an empty string is how a
 * site ships with a gap nobody noticed.
 */
export function complianceText(v: unknown, label: string): string {
  return isPlaceholder(v) ? `[${label} — PENDING COMPLIANCE INPUT]` : String(v);
}

/**
 * What still blocks launch.
 *
 * The FAIS disclosure items are gone: under the information-only position no financial
 * service is advertised, so no FSP disclosure is required. What remains is POPIA,
 * which applies to anyone collecting personal information regardless of positioning.
 */
export function outstandingComplianceItems(): string[] {
  const missing: string[] = [];
  if (isPlaceholder(compliance.responsibleParty)) missing.push('POPIA responsible party');
  if (isPlaceholder(compliance.informationOfficer)) missing.push('POPIA Information Officer');
  return missing;
}

export function isLaunchReady(): boolean {
  return outstandingComplianceItems().length === 0;
}
