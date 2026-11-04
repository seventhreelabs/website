import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import { resolveCmssyLocale } from "@cmssy/core";
import { DraftBanner } from "@/components/ui/draft-banner";
import { ui } from "@/utils/ui-strings";
import { cmssy } from "@/cmssy.config";
import { SiteProviders } from "@/cmssy/site-providers";
import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import { jetbrainsMono, manrope } from "../fonts";
import "../globals.css";

/** Fallbacks only - each page sets its own title and description from cmssy SEO settings. */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "SevenThreeLabs",
  description: "Automatyzujemy powtarzalną pracę w firmach z pomocą AI.",
};

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
      </body>
    </html>
  );
}
