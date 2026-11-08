"use client";

import { useEffect, useRef, useState } from "react";
import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps } from "@cmssy/react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const links = content.links ?? [];
  // logo and brand name come from cmssy Settings -> Branding, not from block fields
  const branding = readBranding(context?.app);
  const locale = context?.locale;
  const t = ui(locale?.current);
  // internal links get the language prefix; anchors and external hrefs pass through
  const href = (value: string) => (locale ? localizeHref(value, locale) : value);

  useEffect(() => {
    if (!open) return;
    const page = document.documentElement;
    const menuButton = menuButtonRef.current;
    dialogRef.current?.showModal();
    dialogRef.current?.focus();
    page.style.overflow = "hidden";
    // the modal is phone-only: leaving that width must not keep the page inert
    const desktop = window.matchMedia("(min-width: 48rem)");
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
      imageClassName="h-4 min-[360px]:h-5 md:h-7"
      textClassName="text-header4-clamp"
      priority
    />
  );
  const languages = locale ? (
    <LanguageSwitcher locale={locale} slug={context?.page?.slug ?? "/"} label={t.languageNav} />
  ) : null;
  const hasCta = Boolean(content.ctaLabel && content.ctaHref);

  return (
    <header className="bg-black text-white">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4 md:gap-x-8 md:px-8 md:py-6">
        {logo}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={open}
          aria-controls={open ? "site-menu" : undefined}
          aria-label={t.menuOpen}
          onClick={() => setOpen(true)}
          className="-mr-2 grid size-11 place-items-center md:hidden"
        >
          <span aria-hidden="true" className="flex h-4 w-6 flex-col justify-between">
            <span className="h-0.5 bg-white" />
            <span className="h-0.5 bg-white" />
            <span className="h-0.5 bg-white" />
          </span>
        </button>
        <nav aria-label={t.mainNav} className="hidden items-center gap-7 text-small font-medium md:flex">
          {links.map((link, index) => (
            <a key={index} href={href(link.href)} className="py-3 hover:opacity-80">
              {link.label}
            </a>
          ))}
          {hasCta ? (
            <a
              href={href(content.ctaHref!)}
              className="rounded-full border border-white px-5 py-3 text-center hover:opacity-80"
            >
              {content.ctaLabel}
            </a>
          ) : null}
          {languages}
        </nav>
      </div>
      {open ? (
        <dialog
          ref={dialogRef}
          id="site-menu"
          aria-label={t.mainNav}
          tabIndex={-1}
          onClose={close}
          className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-y-auto bg-black text-white outline-none open:flex md:hidden"
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
                <span className="absolute top-[11px] left-0 h-0.5 w-6 rotate-45 bg-white" />
                <span className="absolute top-[11px] left-0 h-0.5 w-6 -rotate-45 bg-white" />
              </span>
            </button>
          </div>
          <nav aria-label={t.mainNav} className="flex flex-1 flex-col px-5 pt-6 pb-8">
            {links.map((link, index) => (
              <a key={index} href={href(link.href)} onClick={close} className="py-3 text-header3-clamp font-medium">
                {link.label}
              </a>
            ))}
            <div className="mt-auto flex flex-col gap-4 pt-8">
              {hasCta ? (
                <Button href={href(content.ctaHref!)} onClick={close} className="w-full">
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
