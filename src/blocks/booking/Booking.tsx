import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export type BookingContent = InferBlockContent<typeof bookingProps>;

export const bookingProps = {
  anchor: anchorField("spotkanie"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  facts: fields.repeater({
    label: "Fakty o spotkaniu",
    helperText: "np. Czas: 15-30 min, Koszt: bezpłatnie, Gdzie: Google Meet.",
    itemLabel: "Fakt",
    addButtonLabel: "Dodaj fakt",
    maxItems: 4,
    itemSchema: {
      label: fields.text({ label: "Etykieta", required: true }),
      value: fields.text({ label: "Wartość", required: true }),
    },
  }),
  embedUrl: fields.url({
    label: "Adres kalendarza",
    tab: "Kalendarz",
    helperText:
      "Link do strony rezerwacji w Cal.com lub Calendly, np. https://cal.com/seventhreelabs/30min. Osadzamy go w ramce. Pusty: pokazujemy przycisk z mailem.",
  }),
  embedTitle: fields.text({
    label: "Tytuł ramki",
    tab: "Kalendarz",
    helperText: "Dla czytników ekranu.",
    defaultValue: "Kalendarz spotkań",
  }),
  email: fields.email({ label: "Adres e-mail", tab: "Kalendarz" }),
  fallbackLabel: fields.text({
    label: "Przycisk bez kalendarza",
    tab: "Kalendarz",
    helperText: "Tekst przycisku mailto, gdy kalendarz nie jest ustawiony.",
    defaultValue: "Napisz do nas",
  }),
  fallbackText: fields.textarea({
    label: "Tekst bez kalendarza",
    tab: "Kalendarz",
    helperText: "Zamiast ramki: co napisać w mailu, kiedy odpowiadamy.",
  }),
  prepareHeading: fields.text({ label: "Nagłówek listy", tab: "Przygotowanie" }),
  prepare: fields.repeater({
    label: "Co przygotować",
    tab: "Przygotowanie",
    itemLabel: "Punkt",
    addButtonLabel: "Dodaj punkt",
    maxItems: 6,
    itemSchema: {
      strong: fields.text({ label: "Wyróżnione", required: true, helperText: "np. „Jaki to proces”." }),
      text: fields.text({ label: "Reszta zdania", helperText: "np. „i kto go dziś wykonuje”." }),
    },
  }),
};

/** Booking page: facts, prep list and an embedded calendar (or a mail button). */
export default function Booking({ content }: BlockProps<typeof bookingProps>) {
  const facts = content.facts ?? [];
  const prepare = content.prepare ?? [];
  const embed = content.embedUrl?.trim();

  return (
    <Section
      anchor={content.anchor}
      className="stl-grid text-white"
      innerClassName="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-18"
    >
      <div className="min-w-0">
        <h1 className="m-0 text-header1-clamp font-medium tracking-[-0.03em] text-balance">
          {content.heading}
        </h1>
        {content.text ? (
          <p className="mt-6 mb-0 max-w-[30em] text-medium-clamp text-mute">{content.text}</p>
        ) : null}
        {facts.length ? (
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-edge pt-6 sm:grid-cols-3">
            {facts.map((fact, i) => (
              <div key={i} className="min-w-0">
                <dt className="font-mono text-label text-mute uppercase">{fact.label}</dt>
                <dd className="m-0 mt-1 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {prepare.length ? (
          <div className="mt-12">
            {content.prepareHeading ? (
              <h2 className="m-0 font-mono text-label text-mute uppercase">{content.prepareHeading}</h2>
            ) : null}
            <ol className="mt-4 mb-0 list-none border-t border-edge p-0">
              {prepare.map((item, i) => (
                <li key={i} className="flex gap-5 border-b border-edge py-4">
                  <span className="font-mono text-label text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <strong className="font-bold">{item.strong}</strong>
                    {item.text ? ` ${item.text}` : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
      <div className="min-w-0">
        {embed ? (
          <iframe
            src={embed}
            title={content.embedTitle || "Calendar"}
            loading="lazy"
            className="h-[44rem] w-full rounded-xl border-0 bg-white"
          />
        ) : (
          <div className="rounded-xl border border-edge bg-panel p-6 md:p-10">
            {content.fallbackText ? <p className="m-0 text-mute">{content.fallbackText}</p> : null}
            {content.email ? (
              <>
                <Button href={`mailto:${content.email}`} className="mt-6">
                  {content.fallbackLabel || content.email}
                </Button>
                <p className="mt-4 mb-0 font-mono text-label text-mute">{content.email}</p>
              </>
            ) : null}
          </div>
        )}
      </div>
    </Section>
  );
}
