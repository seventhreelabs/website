import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

/** Container ids are public (they ship in the HTML); env overrides for another workspace. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-TBG87F67";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;

const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;

/**
 * Consent Mode v2 defaults: every storage type denied, so Google tags run
 * cookieless until the banner calls gtag("consent", "update", ...) within
 * `wait_for_update`. Rendered first in <head>, before Cookiebot (which may
 * restore a saved choice as soon as it loads) and before any tag.
 */
export function ConsentDefaults() {
  return <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS }} />;
}

/** The standard GTM snippet (gtm.start event + async gtm.js). */
const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

/**
 * Vercel Web Analytics and Speed Insights always (cookieless, no consent needed;
 * they only report on Vercel). Google Tag Manager always (GA4 and other tags
 * are configured inside the container), loaded after window onload: gtm.js is
 * 180 KB and on mobile it competed with fonts and the cookie banner (the LCP
 * element) for bandwidth; a direct GA4 tag only when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set and GA4 is not wired through GTM.
 * Consent defaults come from <ConsentDefaults /> in the layout's <head>.
 * Nothing in draft mode, so editors' previews never count as visits.
 */
export function Analytics({ draft }: { draft: boolean }) {
  if (draft) return null;
  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
      <Script id="gtm" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </>
  );
}
