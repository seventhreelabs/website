"use client";

import { useEffect, useRef, useState } from "react";
import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps } from "@cmssy/react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { readBranding } from "@/lib/cmssy/branding";
import { homeAnchor } from "@/utils/home-anchor";
import { ui } from "@/utils/ui-strings";

export const siteHeaderProps = {
  announcement: fields.text({
    label: "Pasek nad menu",
    helperText: "Jedno krótkie zdanie, np. „Nie zaczynamy od AI. Zaczynamy od problemu.”. Pusty: bez paska.",
  }),
  links: fields.repeater({
    label: "Menu",
    itemLabel: "Link",
    addButtonLabel: "Dodaj link",
    collapsible: true,
    maxItems: 7,
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const links = content.links ?? [];
  // logo and brand name come from cmssy Settings -> Branding, not from block fields
  const branding = readBranding(context?.app);
  const locale = context?.locale;
  const t = ui(locale?.current);
  // internal links get the language prefix; anchors and external hrefs pass through
  const href = (value: string) => (locale ? localizeHref(homeAnchor(value), locale) : homeAnchor(value));

  useEffect(() => {
    if (!open) return;
    const page = document.documentElement;
    const menuButton = menuButtonRef.current;
    dialogRef.current?.showModal();
    dialogRef.current?.focus();
    page.style.overflow = "hidden";
    // the modal is phone-only: leaving that width must not keep the page inert
    const desktop = window.matchMedia("(min-width: 80rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      page.style.overflow = "";
      desktop.removeEventListener("change", closeOnDesktop);
      menuButton?.focus({ preventScroll: true });
    };
  }, [open]);

  const logo = (
    <BrandLogo
      branding={branding}
      href={href("/")}
      imageClassName="h-4 min-[360px]:h-5 md:h-6"
      textClassName="text-header4-clamp"
      priority
    />
  );
  const languages = locale ? (
    <LanguageSwitcher locale={locale} slug={context?.page?.slug ?? "/"} label={t.languageNav} />
  ) : null;
  const hasCta = Boolean(content.ctaLabel && content.ctaHref);

  return (
    <header className="bg-paper text-ink">
      {content.announcement ? (
        <p className="m-0 flex min-h-8.5 items-center justify-center gap-2 bg-card px-4 py-2 text-center font-mono text-micro tracking-wider uppercase">
          <span aria-hidden="true" className="text-amber">●</span>
          {content.announcement}
        </p>
      ) : null}
      <div className="border-b border-line">
      <div className="mx-auto flex min-h-17 max-w-content items-center justify-between gap-x-4 px-5 py-3 md:min-h-20.5 md:gap-x-8 md:px-8">
        {logo}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? "site-menu" : undefined}
          aria-label={t.menuOpen}
          onClick={() => setOpen(true)}
          className="-mr-2 grid size-11 place-items-center xl:hidden"
        >
          <span aria-hidden="true" className="flex h-4 w-6 flex-col justify-between">
            <span className="h-0.5 bg-ink" />
            <span className="h-0.5 bg-ink" />
            <span className="h-0.5 bg-ink" />
          </span>
        </button>
        <nav aria-label={t.mainNav} className="hidden items-center gap-5 text-small font-bold whitespace-nowrap xl:flex">
          {links.map((link, index) => (
            <a key={index} href={href(link.href)} className="py-3 hover:text-amber">
              {link.label}
            </a>
          ))}
          {hasCta ? (
            <Button href={href(content.ctaHref!)} variant="outline" arrow="↗" className="min-h-11 text-label">
              {content.ctaLabel}
            </Button>
          ) : null}
          {languages}
        </nav>
      </div>
      </div>
      {open ? (
        <dialog
          ref={dialogRef}
          id="site-menu"
          aria-label={t.mainNav}
          tabIndex={-1}
          onClose={close}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-y-auto bg-paper text-ink outline-none open:flex xl:hidden"
        >
          <div className="flex items-center justify-between gap-x-4 px-5 py-4">
            {logo}
            <button
              type="button"
              aria-label={t.menuClose}
              onClick={close}
              className="-mr-2 grid size-11 place-items-center"
            >
              <span aria-hidden="true" className="relative block size-6">
                <span className="absolute top-[11px] left-0 h-0.5 w-6 rotate-45 bg-ink" />
                <span className="absolute top-[11px] left-0 h-0.5 w-6 -rotate-45 bg-ink" />
              </span>
            </button>
          </div>
          <nav aria-label={t.mainNav} className="flex flex-1 flex-col px-5 pt-6 pb-8">
            {links.map((link, index) => (
              <a key={index} href={href(link.href)} onClick={close} className="border-b border-line py-4 text-header3-clamp font-semibold tracking-title">
                {link.label}
              </a>
            ))}
            <div className="mt-auto flex flex-col gap-4 pt-8">
              {hasCta ? (
                <Button href={href(content.ctaHref!)} onClick={close} arrow="↗" className="w-full">
                  {content.ctaLabel}
                </Button>
              ) : null}
              {languages}
            </div>
          </nav>
        </dialog>
      ) : null}
    </header>
  );
}
