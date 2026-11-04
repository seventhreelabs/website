import { CmssyServerPage } from "@cmssy/react";
import { CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import NotFoundBlock from "@/blocks/not-found/NotFound";
import { BRANDING_CONTEXT_KEY } from "@/lib/cmssy/branding";
import { notFoundPage } from "@/services/pages";
import { siteBranding, siteConfig } from "@/services/site";

const cache = { revalidate: 3600 };

/**
 * Rendered when cmssy has no published page for the path. The body is the 404
 * page picked in cmssy (Settings -> Site); header and footer come from the home
 * page's layout. Without a 404 page in cmssy a fixed Polish fallback shows.
 */
export default async function NotFound() {
  const [site, page, branding] = await Promise.all([
    siteConfig(cache),
    notFoundPage(cache),
    siteBranding(cache),
  ]);
  const appContext = { [BRANDING_CONTEXT_KEY]: branding };
  const locale = site?.defaultLanguage ?? "pl";
  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      path={[]}
      editMode={false}
      editable={EditableLayout}
      appContext={appContext}
      cache={cache}
    />
  );

  return (
    <>
      {slot("header")}
      <main>
        {page ? (
          <CmssyServerPage
            page={page}
            blocks={blocks}
            locale={locale}
            defaultLocale={locale}
            enabledLocales={site?.enabledLanguages}
            config={cmssy}
            appContext={appContext}
          />
        ) : (
          <NotFoundBlock
            content={{
              code: "404",
              heading: "Tej strony nie ma",
              text: "Adres jest nieaktualny albo strona została przeniesiona.",
              ctaLabel: "Wróć na stronę główną",
              ctaHref: "/",
            }}
          />
        )}
      </main>
      {slot("footer")}
    </>
  );
}
