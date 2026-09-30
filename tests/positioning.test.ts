import { describe, it, expect } from 'vitest';
import { adviser, compliance, disclaimers } from '../src/config/adviser';
import { outstandingComplianceItems, isLaunchReady } from '../src/lib/compliance';
import robots from '../src/app/robots';
import { TOPICS } from '../src/content/topics';

describe('institutional separation', () => {
  it('exposes no Sanlam-hosted links', () => {
    for (const u of Object.values(adviser.links)) {
      expect(u).not.toMatch(/sanlam/i);
    }
  });

  it('permits the practice own domain', () => {
    expect(adviser.links.practice).toMatch(/conceptwealth\.co\.za/);
  });

  it('does not lead with a professional title', () => {
    // Biographical on /about is fine; positioning is not.
    expect(adviser.role).not.toMatch(/sanlam/i);
  });

  it('serves the photo locally, never from an institutional CDN', () => {
    expect(adviser.photoUrl.startsWith('/')).toBe(true);
  });

  it('omits the street address entirely', () => {
    expect(adviser.practiceAddress).toBeNull();
  });
});

describe('information-only positioning', () => {
  it('states plainly that no financial service is offered', () => {
    expect(disclaimers.noService).toMatch(/no financial service is\s+offered/i);
    expect(disclaimers.noService).toMatch(/no financial advice is given/i);
  });

  it('renders no FSP disclosure, because none is required', () => {
    expect(compliance).not.toHaveProperty('fspNumber');
    expect(compliance).not.toHaveProperty('licensedEntity');
  });

  it('carries no audience targeting or lead intent on topic pages', () => {
    for (const t of TOPICS) {
      expect(t).not.toHaveProperty('audience');
      expect(t).not.toHaveProperty('leadIntent');
    }
  });
});

describe('launch gate', () => {
  it('still blocks on POPIA, which positioning does not resolve', () => {
    const items = outstandingComplianceItems();
    expect(items).toContain('POPIA responsible party');
    expect(items).toContain('POPIA Information Officer');
    expect(isLaunchReady()).toBe(false);
  });

  it('blocks every crawler while not launch ready', () => {
    expect(robots().rules).toEqual({ userAgent: '*', disallow: '/' });
  });
});
