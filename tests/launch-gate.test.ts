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

  it('still lists the FSP approval as outstanding', () => {
    expect(outstandingComplianceItems()).toContain(
      'FAIS advertising approval by a key individual',
    );
  });
});
