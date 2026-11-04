import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import { getBlockContentForLanguage, localizedPath } from "@cmssy/core/internal";
import { cmssy } from "@/cmssy.config";
import { blockMarkdown } from "@/cmssy/markdown";
import { cmssyClient } from "@/lib/cmssy/client";
import { siteLocales } from "@/lib/cmssy/locales";
import { PublicPageDocument } from "@/lib/graphql/generated/graphql";
import { markdownPath, siteUrl } from "@/lib/site-url";
import { buildAppContext } from "@/services/app-context";
import { pageMeta, publishedPages } from "@/services/pages";
import { post as fetchPost, posts as fetchPosts } from "@/services/posts";
import type { Post } from "@/lib/posts";
import { postSlug } from "@/lib/posts";
import { htmlToMarkdown } from "@/utils/html-to-markdown";
import { tagLabel } from "@/utils/post-tags";
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

async function markdownContext(slug: string, locale: string, cache?: CmssyDataCacheOptions): Promise<MarkdownContext> {
  const [locales, app] = await Promise.all([siteLocales(), buildAppContext(slug, locale, cache)]);
  return {
    locale,
    origin: siteUrl(),
    pageUrl: pageUrl(slug, locale, locales.defaultLocale),
    t: ui(locale),
    app,
    postUrl: (postId) => pageUrl(postSlug(postId), locale, locales.defaultLocale),
  };
}

/** One post as markdown: title, date and author, lead, body, tags. */
function postBody(p: Post, ctx: MarkdownContext): string {
  const meta = [p.publishedAt, p.author && `${ctx.t.author}: ${p.author}`].filter(Boolean).join(" · ");
  return paragraphs(
    `# ${p.title}`,
    meta,
    p.excerpt && `*${p.excerpt}*`,
    htmlToMarkdown(p.body),
    p.tags.length > 0 && `**${ctx.t.tags}:** ${p.tags.map((tag) => tagLabel(tag, ctx.locale)).join(", ")}`,
    p.updatedOn && `${ctx.t.mdUpdated}: ${p.updatedOn}`,
  );
}

/** Markdown of one blog post; null when missing or not yet in `locale`. */
export async function postMarkdown(slug: string, locale: string, cache?: CmssyDataCacheOptions): Promise<string | null> {
  const [found, locales] = await Promise.all([fetchPost(slug, locale, cache), siteLocales()]);
  if (!found) return null;
  const ctx = await markdownContext(postSlug(slug), locale, cache);
  const alternates = locales.locales
    .filter((code) => code !== locale && (code === locales.defaultLocale || found.inEnglish))
    .map((code) => `[${ui(code).languageName}](${pageMarkdownUrl(postSlug(slug), code, locales.defaultLocale)})`)
    .join(", ");
  return paragraphs(
    `> ${ctx.t.mdNote} ${ctx.pageUrl}${alternates ? ` · ${alternates}` : ""} · ${ctx.origin}${localizedPath("/llms.txt", locale, locales.defaultLocale)}`,
    postBody(found, ctx),
  );
}

/** Markdown of one page: a header line, then every block that has a renderer. */
export async function pageMarkdown(
  slug: string,
  locale: string,
  cache?: CmssyDataCacheOptions,
): Promise<string | null> {
  const postMatch = slug.match(/^\/blog\/([^/]+)$/);
  if (postMatch) return postMarkdown(postMatch[1], locale, cache);

  const [blocks, meta, locales, ctx] = await Promise.all([
    publishedBlocks(slug, locale, cache),
    pageMeta(slug, locale, cache),
    siteLocales(),
    markdownContext(slug, locale, cache),
  ]);
  if (!blocks) return null;

  const origin = siteUrl();
  const t = ui(locale);
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
  const all = await fetchPosts(locale, cache);
  const ctx = await markdownContext("/blog", locale, cache);
  const postSections = all.map((p) => paragraphs(`<${ctx.postUrl(p.slug)}>`, postBody(p, ctx)));
  return paragraphs(`# ${branding?.brandName ?? "SevenThreeLabs"}`, ...sections, ...postSections) + "\n";
}

/**
 * llms.txt (llmstxt.org): who we are, the page index, the markdown convention,
 * then the facts worth quoting - services and FAQ - lifted from the home page.
 */
export async function llmsIndex(locale: string, cache?: CmssyDataCacheOptions): Promise<string> {
  const [pages, branding, locales, home, all] = await Promise.all([
    publishedPages(cache),
    siteBranding(cache),
    siteLocales(),
    publishedBlocks("/", locale, cache),
    fetchPosts(locale, cache),
  ]);
  const origin = siteUrl();
  const t = ui(locale);
  const name = branding?.brandName ?? "SevenThreeLabs";
  const metas = await Promise.all(pages.map((page) => pageMeta(page.slug, locale, cache)));
  const homeMeta = metas[pages.findIndex((p) => p.slug === "/")];
  const hero = home?.find((b) => b.type === "hero")?.content as { text?: string } | undefined;
  const ctx = await markdownContext("/", locale, cache);
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
    all.length > 0 && `## ${t.blog}`,
    all
      .map((p) => `- [${p.title}](${pageMarkdownUrl(postSlug(p.slug), locale, locales.defaultLocale)}) (${p.publishedAt}): ${p.excerpt}`)
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
