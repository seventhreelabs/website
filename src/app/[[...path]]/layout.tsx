import type { ReactNode } from "react";
import { resolveCmssyLocale } from "@cmssy/core";
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
  const locale = await resolveCmssyLocale(cmssy, path);

  return (
    <html lang={locale} className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
