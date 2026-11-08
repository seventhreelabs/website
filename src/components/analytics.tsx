import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Consent Mode v2 defaults, set before gtag loads: every storage type denied,
 * so GA4 runs cookieless until a consent banner calls gtag("consent", "update", ...).
 */
const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;

/**
 * Vercel Web Analytics and Speed Insights always (cookieless, no consent needed;
 * they only report on Vercel). GA4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Nothing in draft mode, so editors' previews never count as visits.
 */
export function Analytics({ draft }: { draft: boolean }) {
  if (draft) return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      {GA_ID ? (
        <>
          <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />
          <GoogleAnalytics gaId={GA_ID} />
        </>
      ) : null}
    </>
  );
}
