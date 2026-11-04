import { cache as memo } from "react";
import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import type { CmssyLocalizedValue } from "@cmssy/react";
import { cmssy } from "@/cmssy.config";
import { cmssyClient } from "@/lib/cmssy/client";
import {
  PublicPageMetaDocument,
  PublicPagesDocument,
  PublishedPagesDocument,
} from "@/lib/graphql/generated/graphql";
import { localize } from "@/utils/localize";

/** Published page paths for generateStaticParams. */
export async function publishedPaths(): Promise<{ path: string[] }[]> {
  const data = await cmssyClient.query(
    PublishedPagesDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    { public: true, retry: {} },
  );

  return data.public.page.list
    .filter((page) => page.publishedAt)
    .map((page) => ({ path: page.slug.split("/").filter(Boolean) }));
}

/**
 * Published pages with their last change - the sitemap. With `cache` the list
 * joins the cmssy content cache, so publishing a page refreshes it.
 */
export async function publishedPages(
  cache?: CmssyDataCacheOptions,
): Promise<{ slug: string; updatedAt: string }[]> {
  const data = await cmssyClient.query(
    PublicPagesDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    {
      public: true,
      retry: {},
      ...(cache ? { fetch: cmssyCachedFetch(cache) } : {}),
    },
  );

  return data.public.page.list
    .filter((page) => page.publishedAt)
    .map((page) => ({ slug: page.slug, updatedAt: page.updatedAt }));
}

export type PageMeta = { title: string; description: string };

/**
 * SEO title and description of one page (Settings -> SEO in the editor),
 * localized to `locale`. Null when the page does not exist.
 */
async function fetchPageMeta(
  slug: string,
  locale: string,
  cache?: CmssyDataCacheOptions,
): Promise<PageMeta | null> {
  const data = await cmssyClient.query(
    PublicPageMetaDocument,
    { workspaceSlug: cmssy.workspaceSlug, slug },
    {
      public: true,
      retry: {},
      ...(cache ? { fetch: cmssyCachedFetch(cache) } : {}),
    },
  );
  const page = data.public.page.get;
  if (!page) return null;
  const pick = (value: unknown) =>
    localize(value as CmssyLocalizedValue | undefined, locale);

  return {
    title: pick(page.seoTitle) || pick(page.displayName),
    description: pick(page.seoDescription),
  };
}

export const pageMeta = memo(fetchPageMeta);
