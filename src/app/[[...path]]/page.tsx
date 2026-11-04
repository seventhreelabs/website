import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { localizedPath, splitLocaleFromPath } from "@cmssy/core/internal";
import { createCmssyPage, CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { CmssyEditor } from "@/cmssy/editor";
import { EditableLayout } from "@/cmssy/editable-layout";
import { publishedBlocks } from "@/services/markdown";
import { pageMeta, publishedPaths } from "@/services/pages";
import { siteLocales } from "@/lib/cmssy/locales";
import { markdownPath, siteUrl, slugFromPath } from "@/lib/site-url";
import { jsonLd, structuredData } from "@/utils/structured-data";
import { ogLocale } from "@/utils/ui-strings";
import { siteBranding } from "@/services/site";
import { BRANDING_CONTEXT_KEY } from "@/lib/cmssy/branding";

type PageProps = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;
export const dynamicParams = true;

const cache = { revalidate };

export function generateStaticParams() {
  return publishedPaths();
}

const appContext = async () => ({
  [BRANDING_CONTEXT_KEY]: await siteBranding(cache),
});

const CmssyPage = createCmssyPage(cmssy, blocks, {
  editor: CmssyEditor,
  cache,
  appContext,
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { path } = await props.params;
  const locales = await siteLocales();
  const { locale, path: pagePath } = splitLocaleFromPath(path, locales);
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
      types: { "text/markdown": markdownPath(slug, url) },
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
  const context = await appContext();
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
