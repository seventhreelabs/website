import { cache as memo } from "react";
import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import type { CmssyLocalizedValue } from "@cmssy/react";
import { cmssy } from "@/cmssy.config";
import { cmssyClient } from "@/lib/cmssy/client";
import type { SiteBranding } from "@/lib/cmssy/branding";
import { PublicSiteConfigDocument } from "@/lib/graphql/generated/graphql";
import { localize } from "@/utils/localize";

/**
 * Workspace branding (logo, brand name - the latter falling back to the site
 * name). Memoised per request; with `cache`
 * it joins the cmssy content cache, so the revalidate webhook refreshes it.
 */
async function fetchBranding(
  cache?: CmssyDataCacheOptions,
): Promise<SiteBranding | null> {
  const data = await cmssyClient.query(
    PublicSiteConfigDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    {
      public: true,
      retry: {},
      ...(cache ? { fetch: cmssyCachedFetch(cache) } : {}),
    },
  );
  const site = data.public.siteConfig;
  if (!site?.branding) return null;
  // brand name falls back to the workspace's site name (Settings -> Site)
  const siteName = localize(
    site.siteName as CmssyLocalizedValue | undefined,
    site.defaultLanguage,
  );
  return { ...site.branding, brandName: site.branding.brandName || siteName || null };
}

export const siteBranding = memo(fetchBranding);
