import { cache as memo } from "react";
import { resolveSiteLocales } from "@cmssy/core/internal";
import { cmssy } from "@/cmssy.config";

export type SiteLocales = Awaited<ReturnType<typeof resolveSiteLocales>>;

/**
 * Enabled languages and the default one (cmssy Settings -> Site). The SDK
 * keeps a short-lived cache; this memoises per request on top.
 */
function fetchSiteLocales(): Promise<SiteLocales> {
  return resolveSiteLocales(cmssy);
}

export const siteLocales = memo(fetchSiteLocales);
