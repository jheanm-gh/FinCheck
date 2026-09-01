/** UTM capture (§25). Read-only from the URL; nothing is stored client-side. */
export interface Utm {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function readUtm(search: string): Utm {
  const p = new URLSearchParams(search);
  const pick = (k: string) => p.get(k)?.slice(0, 80) || undefined;
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
  };
}
