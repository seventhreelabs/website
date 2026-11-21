import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export type OfferGridContent = InferBlockContent<typeof offerGridProps>;

export const offerGridProps = {
  anchor: anchorField("aplikacje"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  items: fields.repeater({
    label: "Pozycje",
    itemLabel: "Pozycja",
    addButtonLabel: "Dodaj pozycję",
    collapsible: true,
    minItems: 2,
    maxItems: 8,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Opis" }),
      tag: fields.text({
        label: "Etykieta",
        helperText: "Krótki dopisek pod opisem, np. „Domyślnie na Cmssy”. Opcjonalny.",
      }),
    },
  }),
  note: fields.textarea({
    label: "Dopisek pod siatką",
    helperText: "Jedno zdanie, np. kiedy wybieramy inne narzędzie. Opcjonalny.",
  }),
};

/** Bordered grid of what the studio builds beyond automation: apps, sites, consulting, training. */
export default function OfferGrid({ content }: BlockProps<typeof offerGridProps>) {
  const items = content.items ?? [];

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor}>
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <ul className="m-0 grid list-none gap-px border border-line bg-line p-0 md:grid-cols-2">
        {items.map((item, index) => (
          <li key={index} className="flex min-w-0 flex-col bg-card p-6 md:p-8">
            <h3 className="m-0 text-header4-clamp font-bold tracking-title">
              {item.title}
            </h3>
            {item.text ? <p className="mt-2 mb-0 max-w-[30em] text-small text-mute">{item.text}</p> : null}
            {item.tag ? (
              <span className="mt-auto pt-5">
                <span className="inline-block bg-amber-tint px-2.5 py-1.5 font-mono text-micro tracking-wider text-amber uppercase">{item.tag}</span>
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {content.note ? <p className="mt-6 mb-0 max-w-[40em] text-caption text-mute">{content.note}</p> : null}
    </Section>
  );
}
