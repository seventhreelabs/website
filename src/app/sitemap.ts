import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { publishedPages } from "@/services/pages";

// Rendered per request: the page list comes from the tagged cmssy fetch cache,
// which the revalidate webhook refreshes. A prerendered route kept serving the
// stale list after a page was unpublished.
export const dynamic = "force-dynamic";

const cache = { revalidate: 3600 };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const pages = await publishedPages(cache);

  return pages.map((page) => ({
    url: `${origin}${page.slug === "/" ? "" : page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: page.slug === "/" ? "weekly" : "monthly",
    priority: page.slug === "/" ? 1 : 0.5,
  }));
}
