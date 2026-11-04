import { cache as memo } from "react";
import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import type { CmssyLocalizedValue } from "@cmssy/react";
import { cmssy } from "@/cmssy.config";
import type { SiteBranding } from "@/lib/cmssy/branding";
import { cmssyClient } from "@/lib/cmssy/client";
import {
  PublicSiteConfigDocument,
  type PublicSiteConfigQuery,
} from "@/lib/graphql/generated/graphql";
import { localize } from "@/utils/localize";

type SiteConfig = NonNullable<PublicSiteConfigQuery["public"]["siteConfig"]>;

/**
 * The workspace's site config (languages, branding, 404 page). Memoised per
 * request; with `cache` it joins the cmssy content cache.
 */
async function fetchSiteConfig(
  cache?: CmssyDataCacheOptions,
): Promise<SiteConfig | null> {
  const data = await cmssyClient.query(
    PublicSiteConfigDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    {
      public: true,
      retry: {},
      ...(cache ? { fetch: cmssyCachedFetch(cache) } : {}),
    },
  );
  return data.public.siteConfig;
}

export const siteConfig = memo(fetchSiteConfig);

/** Branding (logo, brand name - the latter falling back to the site name). */
export async function siteBranding(
  cache?: CmssyDataCacheOptions,
): Promise<SiteBranding | null> {
  const site = await siteConfig(cache);
  if (!site?.branding) return null;
  const siteName = localize(
    site.siteName as CmssyLocalizedValue | undefined,
    site.defaultLanguage,
  );
  return { ...site.branding, brandName: site.branding.brandName || siteName || null };
}
