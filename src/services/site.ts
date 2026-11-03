import { cache as memo } from "react";
import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import { cmssy } from "@/cmssy.config";
import { cmssyClient } from "@/lib/cmssy/client";
import type { SiteBranding } from "@/lib/cmssy/branding";
import { PublicSiteConfigDocument } from "@/lib/graphql/generated/graphql";

/**
 * Workspace branding (logo, brand name). Memoised per request; with `cache`
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
  return data.public.siteConfig?.branding ?? null;
}

export const siteBranding = memo(fetchBranding);
