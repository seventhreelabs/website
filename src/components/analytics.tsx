import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

/** Container ids are public (they ship in the HTML); env overrides for another workspace. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TBG87F67";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;

/**
 * Consent Mode v2 defaults, set before any Google tag loads: every storage
 * type denied, so tags run cookieless until the consent banner (Cookiebot or
 * similar) calls gtag("consent", "update", ...) within `wait_for_update`.
 */
const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;

/**
 * Vercel Web Analytics and Speed Insights always (cookieless, no consent needed;
 * they only report on Vercel). Google Tag Manager always (GA4 and other tags
 * are configured inside the container); a direct GA4 tag only when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set and GA4 is not wired through GTM.
 * Nothing in draft mode, so editors' previews never count as visits.
 */
export function Analytics({ draft }: { draft: boolean }) {
  if (draft) return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />
      <GoogleTagManager gtmId={GTM_ID} />
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </>
  );
}
