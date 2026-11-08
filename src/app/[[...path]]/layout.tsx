import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import { resolveCmssyLocale } from "@cmssy/core";
import { Analytics } from "@/components/analytics";
import { DraftBanner } from "@/components/ui/draft-banner";
import { ui } from "@/utils/ui-strings";
import { cmssy } from "@/cmssy.config";
import { SiteProviders } from "@/cmssy/site-providers";
import { siteUrl } from "@/lib/site-url";
import { siteBranding } from "@/services/site";
import type { Metadata } from "next";
import { jetbrainsMono, manrope } from "../fonts";
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
    description: "Automatyzujemy powtarzalną pracę w firmach z pomocą AI.",
    applicationName: brand,
    ...(draft ? { robots: { index: false, follow: false } } : {}),
    ...(branding?.faviconUrl ? { icons: { icon: branding.faviconUrl } } : {}),
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
  const t = ui(locale);

  return (
    <html lang={locale} className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        {draft ? <DraftBanner label={t.draftLabel} exitLabel={t.draftExit} path={`/${(path ?? []).join("/")}`} /> : null}
        <SiteProviders>{children}</SiteProviders>
        <Analytics draft={draft} />
      </body>
    </html>
  );
}
