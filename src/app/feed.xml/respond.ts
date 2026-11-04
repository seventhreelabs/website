import { localizedPath } from "@cmssy/core/internal";
import { mediaUrl } from "@cmssy/react";
import { siteLocales } from "@/lib/cmssy/locales";
import { postSlug } from "@/lib/posts";
import { siteUrl } from "@/lib/site-url";
import { pageMeta } from "@/services/pages";
import { posts } from "@/services/posts";
import { siteBranding } from "@/services/site";
import { ui } from "@/utils/ui-strings";

const cache = { revalidate: 3600 };

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS 2.0 of the blog in `requested` when that language is enabled, else the default one. */
export async function respondFeed(requested?: string): Promise<Response> {
  const locales = await siteLocales();
  const locale = requested && locales.locales.includes(requested) ? requested : locales.defaultLocale;
  const origin = siteUrl();
  const [all, branding, home] = await Promise.all([posts(locale, cache), siteBranding(cache), pageMeta("/", locale, cache)]);
  const name = branding?.brandName ?? "SevenThreeLabs";
  const link = (slug: string) => `${origin}${localizedPath(slug, locale, locales.defaultLocale)}`;
  const items = all
    .map((p) => {
      const cover = mediaUrl(p.cover);
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${link(postSlug(p.slug))}</link>
      <guid isPermaLink="true">${link(postSlug(p.slug))}</guid>
      <pubDate>${new Date(`${p.publishedAt}T08:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(p.excerpt)}</description>${p.author ? `\n      <dc:creator>${escape(p.author)}</dc:creator>` : ""}${cover ? `\n      <enclosure url="${escape(cover)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(name)} - ${ui(locale).blog}</title>
    <link>${link("/blog")}</link>
    <atom:link href="${origin}${localizedPath("/feed.xml", locale, locales.defaultLocale)}" rel="self" type="application/rss+xml" />
    <description>${escape(home?.description ?? "")}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "content-language": locale } });
}
