import type { CmssyDataCacheOptions } from "@cmssy/next/server";
import { BRANDING_CONTEXT_KEY } from "@/lib/cmssy/branding";
import { LATEST_POSTS_CONTEXT_KEY, POSTS_CONTEXT_KEY } from "@/lib/posts";
import { posts } from "@/services/posts";
import { siteBranding } from "@/services/site";

export const BLOG_SLUG = "/blog";
const LATEST = 3;

/**
 * Site-wide values every block may read from `context.app`: branding, the
 * latest posts, and on the blog page the full post list.
 */
export async function buildAppContext(
  slug: string,
  locale: string,
  cache?: CmssyDataCacheOptions,
  preview = false,
): Promise<Record<string, unknown>> {
  const [branding, latest, all] = await Promise.all([
    siteBranding(cache),
    posts(locale, cache, LATEST, preview),
    slug === BLOG_SLUG ? posts(locale, cache, undefined, preview) : Promise.resolve(undefined),
  ]);
  return {
    [BRANDING_CONTEXT_KEY]: branding,
    [LATEST_POSTS_CONTEXT_KEY]: latest,
    ...(all ? { [POSTS_CONTEXT_KEY]: all } : {}),
  };
}
