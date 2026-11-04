import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { resolveCmssyLocale } from "@cmssy/core";
import { createCmssyPage, CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { CmssyEditor } from "@/cmssy/editor";
import { EditableLayout } from "@/cmssy/editable-layout";
import { pageMeta, publishedPaths } from "@/services/pages";
import { slugFromPath } from "@/lib/site-url";
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
  const slug = slugFromPath(path);
  const locale = (await resolveCmssyLocale(cmssy, path)) ?? "pl";
  const [meta, branding] = await Promise.all([
    pageMeta(slug, locale, cache),
    siteBranding(cache),
  ]);
  if (!meta) return {};

  const title = meta.title || branding?.brandName || undefined;
  const ogImage = branding?.ogImageUrl ?? undefined;

  return {
    title,
    description: meta.description || undefined,
    alternates: { canonical: slug },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: slug,
      siteName: branding?.brandName ?? undefined,
      title,
      description: meta.description || undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
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
      {slot("footer")}
    </>
  );
}
