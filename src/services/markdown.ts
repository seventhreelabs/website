import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import { getBlockContentForLanguage, localizedPath } from "@cmssy/core/internal";
import { cmssy } from "@/cmssy.config";
import { blockMarkdown } from "@/cmssy/markdown";
import { cmssyClient } from "@/lib/cmssy/client";
import { siteLocales } from "@/lib/cmssy/locales";
import { PublicPageDocument } from "@/lib/graphql/generated/graphql";
import { markdownPath, siteUrl } from "@/lib/site-url";
import { pageMeta, publishedPages } from "@/services/pages";
import { siteBranding } from "@/services/site";
import { paragraphs, type MarkdownContext } from "@/utils/markdown";
import { ui } from "@/utils/ui-strings";

export type LocalizedBlock = { type: string; content: Record<string, unknown> };

/**
 * A page's published blocks with content folded to one language (cmssy's own
 * fallback order). Null when the page is missing or unpublished.
 */
export async function publishedBlocks(
  slug: string,
  locale: string,
  cache?: CmssyDataCacheOptions,
): Promise<LocalizedBlock[] | null> {
  const [data, locales] = await Promise.all([
    cmssyClient.query(
      PublicPageDocument,
      { workspaceSlug: cmssy.workspaceSlug, slug },
      { public: true, retry: {}, ...(cache ? { fetch: cmssyCachedFetch(cache) } : {}) },
    ),
    siteLocales(),
  ]);
  const page = data.public.page.get;
  if (!page || !page.publishedBlocks.length) return null;

  return page.publishedBlocks.map((block) => ({
    type: block.type,
    content: getBlockContentForLanguage(block.content, locale, locales.defaultLocale, locales.locales),
  }));
}

function pageUrl(slug: string, locale: string, defaultLocale: string): string {
  return `${siteUrl()}${localizedPath(slug, locale, defaultLocale)}`;
}

function pageMarkdownUrl(slug: string, locale: string, defaultLocale: string): string {
  return `${siteUrl()}${markdownPath(slug, localizedPath(slug, locale, defaultLocale))}`;
}

/** Markdown of one page: a header line, then every block that has a renderer. */
export async function pageMarkdown(
  slug: string,
  locale: string,
  cache?: CmssyDataCacheOptions,
): Promise<string | null> {
  const [blocks, meta, locales] = await Promise.all([
    publishedBlocks(slug, locale, cache),
    pageMeta(slug, locale, cache),
    siteLocales(),
  ]);
  if (!blocks) return null;

  const origin = siteUrl();
  const t = ui(locale);
  const ctx: MarkdownContext = { locale, origin, pageUrl: pageUrl(slug, locale, locales.defaultLocale), t };
  const body = blocks
    .map((block) => blockMarkdown[block.type]?.(block.content as never, ctx) ?? "")
    .filter(Boolean)
    .join("\n\n");
  const alternates = locales.locales
    .filter((code) => code !== locale)
    .map((code) => `[${ui(code).languageName}](${pageMarkdownUrl(slug, code, locales.defaultLocale)})`)
    .join(", ");

  return paragraphs(
    `> ${t.mdNote} ${ctx.pageUrl}${alternates ? ` · ${alternates}` : ""} · ${origin}${localizedPath("/llms.txt", locale, locales.defaultLocale)}`,
    meta?.description && `*${meta.description}*`,
    body,
  );
}

/** The whole published site as one markdown document (llms-full.txt). */
export async function siteMarkdown(locale: string, cache?: CmssyDataCacheOptions): Promise<string> {
  const [pages, branding, locales] = await Promise.all([
    publishedPages(cache),
    siteBranding(cache),
    siteLocales(),
  ]);
  const sections = await Promise.all(
    pages.map(async (page) => {
      const [md, meta] = await Promise.all([pageMarkdown(page.slug, locale, cache), pageMeta(page.slug, locale, cache)]);
      return md && paragraphs(`# ${meta?.title ?? page.slug}`, `<${pageUrl(page.slug, locale, locales.defaultLocale)}>`, md);
    }),
  );
  return paragraphs(`# ${branding?.brandName ?? "SevenThreeLabs"}`, ...sections) + "\n";
}

/**
 * llms.txt (llmstxt.org): who we are, the page index, the markdown convention,
 * then the facts worth quoting - services and FAQ - lifted from the home page.
 */
export async function llmsIndex(locale: string, cache?: CmssyDataCacheOptions): Promise<string> {
  const [pages, branding, locales, home] = await Promise.all([
    publishedPages(cache),
    siteBranding(cache),
    siteLocales(),
    publishedBlocks("/", locale, cache),
  ]);
  const origin = siteUrl();
  const t = ui(locale);
  const name = branding?.brandName ?? "SevenThreeLabs";
  const metas = await Promise.all(pages.map((page) => pageMeta(page.slug, locale, cache)));
  const homeMeta = metas[pages.findIndex((p) => p.slug === "/")];
  const hero = home?.find((b) => b.type === "hero")?.content as { text?: string } | undefined;
  const ctx: MarkdownContext = { locale, origin, pageUrl: pageUrl("/", locale, locales.defaultLocale), t };
  const facts = (home ?? [])
    .filter((b) => ["services", "work-process", "faq", "contact"].includes(b.type))
    .map((b) => blockMarkdown[b.type]?.(b.content as never, ctx) ?? "")
    .filter(Boolean)
    .join("\n\n");

  return paragraphs(
    `# ${name}`,
    homeMeta?.description && `> ${homeMeta.description}`,
    hero?.text,
    `## ${t.mdPages}`,
    pages
      .map((page, i) => {
        const url = pageMarkdownUrl(page.slug, locale, locales.defaultLocale);
        const title = metas[i]?.title || name;
        const desc = metas[i]?.description;
        return `- [${title}](${url})${desc ? `: ${desc}` : ""}`;
      })
      .join("\n"),
    `## ${t.mdFormat}`,
    `${t.mdFormatNote} ${origin}${localizedPath("/llms-full.txt", locale, locales.defaultLocale)}`,
    locales.locales.length > 1 && `## ${t.mdLanguages}`,
    locales.locales
      .filter((code) => code !== locale)
      .map((code) => `- [${ui(code).languageName}](${origin}${localizedPath("/llms.txt", code, locales.defaultLocale)})`)
      .join("\n"),
    facts,
    `---\n${t.mdUpdated}: ${pages.map((p) => p.updatedAt).sort().at(-1)?.slice(0, 10) ?? ""}`,
  ) + "\n";
}
