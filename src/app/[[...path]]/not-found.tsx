import { headers } from "next/headers";
import { CMSSY_LOCALE_HEADER } from "@cmssy/core";
import { localizedPath } from "@cmssy/core/internal";
import { CmssyServerPage } from "@cmssy/react";
import { CmssyLayoutSlot } from "@cmssy/next/server";
import type { CmssyRegion } from "@cmssy/next";
import { cmssy, type layout } from "@/cmssy.config";
import { blocks } from "@/cmssy/blocks";
import { EditableLayout } from "@/cmssy/editable-layout";
import NotFoundBlock from "@/blocks/not-found/NotFound";
import { BRANDING_CONTEXT_KEY } from "@/lib/cmssy/branding";
import { siteLocales } from "@/lib/cmssy/locales";
import { notFoundPage } from "@/services/pages";
import { siteBranding } from "@/services/site";
import { ui } from "@/utils/ui-strings";

const cache = { revalidate: 3600 };

/**
 * Rendered when cmssy has no published page for the path. The body is the 404
 * page picked in cmssy (Settings -> Site) in the request's language (the proxy
 * puts it in a header); header and footer come from the home page's layout.
 * Without a 404 page in cmssy a fixed fallback shows.
 */
export default async function NotFound() {
  const [page, branding, locales, requestHeaders] = await Promise.all([
    notFoundPage(cache),
    siteBranding(cache),
    siteLocales(),
    headers(),
  ]);
  const requested = requestHeaders.get(CMSSY_LOCALE_HEADER);
  const locale =
    requested && locales.locales.includes(requested) ? requested : locales.defaultLocale;
  const path = locale === locales.defaultLocale ? [] : [locale];
  const appContext = { [BRANDING_CONTEXT_KEY]: branding };
  const t = ui(locale);
  const slot = (region: CmssyRegion<typeof layout>) => (
    <CmssyLayoutSlot
      config={cmssy}
      blocks={blocks}
      region={region}
      path={path}
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
            defaultLocale={locales.defaultLocale}
            enabledLocales={locales.locales}
            config={cmssy}
            appContext={appContext}
          />
        ) : (
          <NotFoundBlock
            content={{
              code: "404",
              heading: t.notFoundHeading,
              text: t.notFoundText,
              ctaLabel: t.notFoundCta,
              ctaHref: localizedPath("/", locale, locales.defaultLocale),
            }}
          />
        )}
      </main>
      {slot("footer")}
    </>
  );
}
