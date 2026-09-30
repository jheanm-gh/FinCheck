import { describe, it, expect } from 'vitest';
import { isLaunchReady, outstandingComplianceItems } from '../src/lib/compliance';
import robots from '../src/app/robots';

describe('launch gate', () => {
  it('is not launch ready while compliance items are outstanding', () => {
    expect(outstandingComplianceItems().length).toBeGreaterThan(0);
    expect(isLaunchReady()).toBe(false);
  });

  it('blocks every crawler while not launch ready', () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(r.sitemap).toBeUndefined();
  });

  it('no longer lists any FAIS item, since the site advertises no financial service', () => {
    const joined = outstandingComplianceItems().join(' ');
    expect(joined).not.toMatch(/FAIS/);
    expect(joined).not.toMatch(/FSP/);
  });
});
