export const COOKIEBOT_ID = process.env.NEXT_PUBLIC_COOKIEBOT_ID || null;

/** Cookiebot's banner languages are upper-case culture codes (PL, EN). */
const culture = (locale: string) => locale.slice(0, 2).toUpperCase();

/**
 * Cookiebot CMP (consent.cookiebot.com), a plain <script defer> in the root
 * layout's <head>, right after <ConsentDefaults />. `defer`, not `async`:
 * React 19 hoists async scripts to the top of <head>, ahead of the inline
 * consent defaults (seen in production); a deferred one stays in place.
 * Manual blocking mode means it blocks nothing, it only updates
 * Google Consent Mode v2 once the visitor chooses. The denied defaults
 * come from <ConsentDefaults />, rendered just before this script, so
 * `data-consentmode-defaults` is off.
 * Manual blocking mode: Google tags run cookieless through consent mode and
 * Vercel's scripts set no cookies, so nothing needs auto-blocking.
 * Without NEXT_PUBLIC_COOKIEBOT_ID (local dev) there is no banner.
 */
export function CookieConsent({ locale }: { locale?: string }) {
  if (!COOKIEBOT_ID) return null;
  return (
    <script
      id="Cookiebot"
      defer
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={COOKIEBOT_ID}
      data-blockingmode="manual"
      data-consentmode-defaults="disabled"
      {...(locale ? { "data-culture": culture(locale) } : {})}
    />
  );
}
