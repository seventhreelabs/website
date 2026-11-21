import { Fragment, type ReactNode } from "react";
import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroBackground } from "./HeroBackground";

export const heroProps = {
  eyebrow: fields.text({
    label: "Etykieta nad nagłówkiem",
    helperText: "np. „Automatyzacje dla małych zespołów”. Opcjonalna.",
  }),
  heading: fields.textarea({
    label: "Nagłówek",
    required: true,
    helperText: "Każda linia to osobny wiersz na dużym ekranie.",
  }),
  highlight: fields.text({
    label: "Wyróżnienie w nagłówku",
    helperText: "Fragment nagłówka na żółto, wpisany dokładnie jak w nagłówku, np. „Więcej czasu”.",
  }),
  text: fields.textarea({ label: "Tekst" }),
  actions: fields.repeater({
    label: "Przyciski",
    itemLabel: "Przycisk",
    addButtonLabel: "Dodaj przycisk",
    maxItems: 2,
    itemSchema: {
      label: fields.text({ label: "Tekst", required: true }),
      href: fields.link({ label: "Adres", required: true }),
      variant: fields.select({
        label: "Wariant",
        options: ["Główny", "Obrys", "Link"],
        defaultValue: "Główny",
      }),
    },
  }),
  note: fields.text({
    label: "Dopisek pod przyciskami",
    helperText: "Mała linia, np. „Gdańsk · rozmowa z osobami, które budują”.",
  }),
};

export type HeroContent = InferBlockContent<typeof heroProps>;

const VARIANTS = { Główny: "primary", Obrys: "outline", Link: "text" } as const;
const ARROWS = { Główny: "↗", Obrys: "↗", Link: undefined } as const;

/** Heading lines, with the highlighted fragment in amber. */
function headingLines(heading: string, highlight?: string): ReactNode {
  const lines = heading.split(/\r?\n/).filter((line) => line.trim());
  return lines.map((line, index) => {
    const at = highlight ? line.indexOf(highlight) : -1;
    const body =
      at < 0 || !highlight ? (
        line
      ) : (
        <>
          {line.slice(0, at)}
          <em className="text-amber not-italic">{highlight}</em>
          {line.slice(at + highlight.length)}
        </>
      );
    return (
      <Fragment key={index}>
        {index > 0 ? <br className="hidden sm:inline" /> : null}
        {index > 0 ? " " : null}
        {body}
      </Fragment>
    );
  });
}

export default function Hero({ content }: BlockProps<typeof heroProps>) {
  return (
    <section className="relative isolate overflow-hidden bg-paper">
      <HeroBackground />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-paper/85 via-paper/40 to-transparent"
      />
      <Container className="relative pt-12 pb-14 md:pt-21 md:pb-24">
        <div className="max-w-170">
          {content.eyebrow ? (
            <p className="m-0 flex items-center gap-2.5 font-mono text-micro tracking-kicker text-mute uppercase md:text-label">
              <span aria-hidden="true" className="h-0.5 w-6 shrink-0 bg-amber" />
              {content.eyebrow}
            </p>
          ) : null}
          <h1 className="mt-6 mb-6 text-display-clamp font-semibold tracking-display">
            {headingLines(content.heading, content.highlight)}
          </h1>
          {content.text ? (
            <p className="m-0 max-w-[27em] text-large-clamp text-mute">{content.text}</p>
          ) : null}
          {(content.actions ?? []).length ? (
            <div className="mt-7 flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              {(content.actions ?? []).map((action, index) => {
                const variant = action.variant ?? "Główny";
                return (
                  <Button
                    key={index}
                    href={action.href}
                    variant={VARIANTS[variant]}
                    arrow={ARROWS[variant]}
                    className={variant === "Link" ? "-ml-2 sm:ml-0" : ""}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          ) : null}
          {content.note ? (
            <p className="mt-6 mb-0 font-mono text-micro tracking-wider text-mute uppercase">
              {content.note}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
