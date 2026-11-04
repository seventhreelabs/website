"use client";

import { useState } from "react";
import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps } from "@cmssy/react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { readBranding } from "@/lib/cmssy/branding";
import { ui } from "@/utils/ui-strings";

export const siteHeaderProps = {
  links: fields.repeater({
    label: "Menu",
    itemLabel: "Link",
    addButtonLabel: "Dodaj link",
    collapsible: true,
    maxItems: 6,
    itemSchema: {
      label: fields.text({ label: "Tekst", required: true }),
      href: fields.link({ label: "Adres", required: true }),
    },
  }),
  ctaLabel: fields.text({ label: "Przycisk: tekst", tab: "Przycisk" }),
  ctaHref: fields.link({ label: "Przycisk: adres", tab: "Przycisk" }),
};

export default function SiteHeader({
  content,
  context,
}: BlockProps<typeof siteHeaderProps>) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = content.links ?? [];
  // logo and brand name come from cmssy Settings -> Branding, not from block fields
  const branding = readBranding(context?.app);
  const locale = context?.locale;
  const t = ui(locale?.current);
  // internal links get the language prefix; anchors and external hrefs pass through
  const href = (value: string) => (locale ? localizeHref(value, locale) : value);

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 md:px-8 md:py-6">
        <BrandLogo
          branding={branding}
          href={href("/")}
          imageClassName="h-5 md:h-7"
          textClassName="text-header4-clamp"
          priority
        />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen(!open)}
          className="min-h-11 rounded-full border border-white px-5 text-small font-bold md:hidden"
        >
          {open ? t.menuClose : t.menuOpen}
        </button>
        <nav
          id="site-menu"
          aria-label={t.mainNav}
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-3 text-small font-medium md:flex md:w-auto md:flex-row md:items-center md:gap-7 md:pb-0`}
        >
          {links.map((link, index) => (
            <a
              key={index}
              href={href(link.href)}
              onClick={close}
              className="py-3 hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
          {content.ctaLabel && content.ctaHref ? (
            <a
              href={href(content.ctaHref)}
              onClick={close}
              className="mt-2 rounded-full border border-white px-5 py-3 text-center hover:opacity-80 md:mt-0"
            >
              {content.ctaLabel}
            </a>
          ) : null}
          {locale ? (
            <LanguageSwitcher
              locale={locale}
              slug={context?.page?.slug ?? "/"}
              label={t.languageNav}
              className="mt-2 md:mt-0"
            />
          ) : null}
        </nav>
      </div>
    </header>
  );
}
