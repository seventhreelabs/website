import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import { resolveCmssyLocale } from "@cmssy/core";
import { Analytics, ConsentDefaults } from "@/components/analytics";
import { CookieConsent } from "@/components/cookie-consent";
import { DraftBanner } from "@/components/ui/draft-banner";
import { ui } from "@/utils/ui-strings";
import { cmssy } from "@/cmssy.config";
import { SiteProviders } from "@/cmssy/site-providers";
import { setRequestLocale } from "@/lib/cmssy/request-locale";
import { siteUrl } from "@/lib/site-url";
import { siteBranding } from "@/services/site";
import type { Metadata } from "next";
import { dmMono, manrope } from "../fonts";
import "../globals.css";

const cache = { revalidate: 3600 };

/**
 * Site-wide fallbacks - each page sets its own title, description and Open
 * Graph from cmssy. Drafts carry noindex here, so an unpublished page (which
 * has no metadata of its own yet) can never reach the index.
 */
export async function generateMetadata(): Promise<Metadata> {
  const [branding, { isEnabled: draft }] = await Promise.all([siteBranding(cache), draftMode()]);
  const brand = branding?.brandName ?? "SevenThreeLabs";
  const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return {
    metadataBase: new URL(siteUrl()),
    title: brand,
    description: "Wdrażamy AI w firmach i dzięki temu automatyzujemy powtarzalną pracę.",
    applicationName: brand,
    ...(draft ? { robots: { index: false, follow: false } } : {}),
    ...(verification ? { verification: { google: verification } } : {}),
  };
}

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ path?: string[] }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { path } = await params;
  const [locale, { isEnabled: draft }] = await Promise.all([resolveCmssyLocale(cmssy, path), draftMode()]);
  setRequestLocale(locale);
  const t = ui(locale);

  return (
    <html lang={locale} className={`${manrope.variable} ${dmMono.variable}`}>
      <head>
        <ConsentDefaults />
        <CookieConsent locale={locale} />
      </head>
      <body className="flex min-h-dvh flex-col">
        {draft ? <DraftBanner label={t.draftLabel} exitLabel={t.draftExit} path={`/${(path ?? []).join("/")}`} /> : null}
        <SiteProviders>{children}</SiteProviders>
        <Analytics draft={draft} />
      </body>
    </html>
  );
}
