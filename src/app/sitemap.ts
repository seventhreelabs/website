import type { MetadataRoute } from "next";
import { localizedPath } from "@cmssy/core/internal";
import { siteLocales } from "@/lib/cmssy/locales";
import { siteUrl } from "@/lib/site-url";
import { postSlug } from "@/lib/posts";
import { publishedPages } from "@/services/pages";
import { postIndex } from "@/services/posts";

// Rendered per request: the page list comes from the tagged cmssy fetch cache,
// which the revalidate webhook refreshes. A prerendered route kept serving the
// stale list after a page was unpublished.
export const dynamic = "force-dynamic";

const cache = { revalidate: 3600 };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const [pages, posts, locales] = await Promise.all([publishedPages(cache), postIndex(cache), siteLocales()]);
  const url = (slug: string, locale: string) =>
    `${origin}${localizedPath(slug, locale, locales.defaultLocale)}`;

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((p) =>
    p.locales.map((locale) => ({
      url: url(postSlug(p.slug), locale),
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(p.locales.map((code) => [code, url(postSlug(p.slug), code)])),
      },
    })),
  );

  const pageEntries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    locales.locales.map((locale) => ({
      url: url(page.slug, locale),
      lastModified: new Date(page.updatedAt),
      changeFrequency: page.slug === "/" ? "weekly" : "monthly",
      priority: page.slug === "/" ? 1 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.locales.map((code) => [code, url(page.slug, code)]),
        ),
      },
    })),
  );

  return [...pageEntries, ...postEntries];
}
