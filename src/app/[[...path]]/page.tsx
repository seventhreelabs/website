import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { mediaUrl } from "@cmssy/react";
import { localizedPath, splitLocaleFromPath } from "@cmssy/core/internal";
import { createCmssyPage, CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { CmssyEditor } from "@/cmssy/editor";
import { EditableLayout } from "@/cmssy/editable-layout";
import { PostArticle } from "@/components/blog/post-article";
import { postSlug } from "@/lib/posts";
import { buildAppContext } from "@/services/app-context";
import { publishedBlocks } from "@/services/markdown";
import { post, postIndex } from "@/services/posts";
import { pageMeta, publishedPaths } from "@/services/pages";
import { siteLocales } from "@/lib/cmssy/locales";
import { markdownPath, siteUrl, slugFromPath } from "@/lib/site-url";
import { jsonLd, postStructuredData, structuredData } from "@/utils/structured-data";
import { ui } from "@/utils/ui-strings";
import { ogLocale } from "@/utils/ui-strings";
import { siteBranding } from "@/services/site";

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;
export const dynamicParams = true;

const cache = { revalidate };

export async function generateStaticParams() {
  const [pages, posts, locales] = await Promise.all([publishedPaths(), postIndex(cache), siteLocales()]);
  const postParams = posts.flatMap((p) =>
    p.locales.map((locale) => ({
      path: localizedPath(postSlug(p.slug), locale, locales.defaultLocale).split("/").filter(Boolean),
    })),
  );
  return [...pages, ...postParams];
}

const CmssyPage = createCmssyPage(cmssy, blocks, {
  editor: CmssyEditor,
  cache,
  appContext: ({ page, locale }) => buildAppContext(page.slug ?? "/", locale, cache),
});

/** `["blog", slug]` after the language prefix - a post from the `post` model, not a cmssy page. */
function postSlugFromPath(pagePath: string[] | undefined): string | null {
  return pagePath?.length === 2 && pagePath[0] === "blog" ? pagePath[1] : null;
}

const feedTypes = (locale: string, defaultLocale: string) => ({
  "application/rss+xml": localizedPath("/feed.xml", locale, defaultLocale),
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { path } = await props.params;
  const locales = await siteLocales();
  const { locale, path: pagePath } = splitLocaleFromPath(path, locales);
  const postId = postSlugFromPath(pagePath);
  if (postId) return postMetadata(postId, locale);

  const slug = slugFromPath(pagePath);
  const [meta, branding] = await Promise.all([
    pageMeta(slug, locale, cache),
    siteBranding(cache),
  ]);
  if (!meta) return {};

  const title = meta.title || branding?.brandName || undefined;
  const ogImage = branding?.ogImageUrl ?? undefined;
  const url = localizedPath(slug, locale, locales.defaultLocale);
  const languages = Object.fromEntries(
    locales.locales.map((code) => [code, localizedPath(slug, code, locales.defaultLocale)]),
  );

  return {
    title,
    description: meta.description || undefined,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": languages[locales.defaultLocale] },
      types: { "text/markdown": markdownPath(slug, url), ...feedTypes(locale, locales.defaultLocale) },
    },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: locales.locales.filter((code) => code !== locale).map(ogLocale),
      url,
      siteName: branding?.brandName ?? undefined,
      title,
      description: meta.description || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

async function postMetadata(postId: string, locale: string): Promise<Metadata> {
  const [found, branding, locales] = await Promise.all([post(postId, locale, cache), siteBranding(cache), siteLocales()]);
  if (!found) return {};
  const slug = postSlug(postId);
  const url = localizedPath(slug, locale, locales.defaultLocale);
  const available = locales.locales.filter((code) => code === locales.defaultLocale || found.inEnglish);
  const languages = Object.fromEntries(available.map((code) => [code, localizedPath(slug, code, locales.defaultLocale)]));
  const title = found.seoTitle || found.title;
  const description = found.seoDescription || found.excerpt;
  const cover = mediaUrl(found.cover) ?? branding?.ogImageUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": languages[locales.defaultLocale] },
      types: { "text/markdown": markdownPath(slug, url), ...feedTypes(locale, locales.defaultLocale) },
    },
    openGraph: {
      type: "article",
      locale: ogLocale(locale),
      alternateLocale: available.filter((code) => code !== locale).map(ogLocale),
      url,
      siteName: branding?.brandName ?? undefined,
      title,
      description,
      publishedTime: found.publishedAt,
      modifiedTime: found.updatedOn ?? found.publishedAt,
      authors: found.author ? [found.author] : undefined,
      tags: found.tags,
      images: cover ? [{ url: cover }] : undefined,
    },
  };
}

/** schema.org graph for a post page. */
async function PostStructuredData({ postId, locale }: { postId: string; locale: string }) {
  const [found, branding, locales] = await Promise.all([post(postId, locale, cache), siteBranding(cache), siteLocales()]);
  if (!found) return null;
  const origin = siteUrl();
  const data = postStructuredData({
    origin,
    url: `${origin}${localizedPath(postSlug(postId), locale, locales.defaultLocale)}`,
    blogUrl: `${origin}${localizedPath("/blog", locale, locales.defaultLocale)}`,
    blogName: ui(locale).blog,
    locale,
    siteName: branding?.brandName ?? "SevenThreeLabs",
    logoUrl: branding?.logoUrl,
    post: found,
    coverUrl: mediaUrl(found.cover),
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

/** schema.org graph for the published page - skipped in preview. */
async function StructuredData({ path }: { path: string[] | undefined }) {
  const locales = await siteLocales();
  const { locale, path: pagePath } = splitLocaleFromPath(path, locales);
  const slug = slugFromPath(pagePath);
  const [blocks, meta, branding] = await Promise.all([
    publishedBlocks(slug, locale, cache),
    pageMeta(slug, locale, cache),
    siteBranding(cache),
  ]);
  if (!blocks || !meta) return null;
  const origin = siteUrl();
  const data = structuredData({
    origin,
    url: `${origin}${localizedPath(slug, locale, locales.defaultLocale)}`,
    locale,
    siteName: branding?.brandName ?? "SevenThreeLabs",
    logoUrl: branding?.logoUrl,
    title: meta.title,
    description: meta.description,
    slug,
    blocks,
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}

export default async function Page(props: PageProps) {
  const { path } = await props.params;
  const { isEnabled: preview } = await draftMode();
  const locales = await siteLocales();
  const { locale, path: pagePath } = splitLocaleFromPath(path, locales);
  const postId = postSlugFromPath(pagePath);
  const context = await buildAppContext(postId ? postSlug(postId) : slugFromPath(pagePath), locale, cache);
  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      path={path ?? []}
      editMode={false}
      preview={preview}
      editable={EditableLayout}
      appContext={context}
      cache={cache}
    />
  );

  if (postId) {
    const found = await post(postId, locale, cache);
    if (!found) notFound();
    return (
      <>
        {slot("header")}
        <main>
          <PostArticle post={found} locale={locale} blogHref={localizedPath("/blog", locale, locales.defaultLocale)} />
        </main>
        {slot("footer")}
        <PostStructuredData postId={postId} locale={locale} />
      </>
    );
  }

  return (
    <>
      {slot("header")}
      <main>
        <CmssyPage {...props} />
      </main>
      {preview ? null : <StructuredData path={path} />}
      {slot("footer")}
    </>
  );
}
