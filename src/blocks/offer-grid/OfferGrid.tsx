import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export type OfferGridContent = InferBlockContent<typeof offerGridProps>;

export const offerGridProps = {
  anchor: anchorField("aplikacje"),
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

const LETTERS = "ABCDEFGH";

/** Bordered grid of what the studio builds beyond automation: apps, sites, consulting, training. */
export default function OfferGrid({ content }: BlockProps<typeof offerGridProps>) {
  const items = content.items ?? [];

  return (
    <Section anchor={content.anchor} className="border-y border-line bg-white">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-18">
        <SectionHeading className="max-w-[12em]">{content.heading}</SectionHeading>
        {content.text ? (
          <p className="m-0 max-w-[34em] self-end text-medium-clamp">{content.text}</p>
        ) : null}
      </div>
      <ul className="mt-10 grid list-none gap-px border border-line bg-line p-0 md:mt-14 md:grid-cols-2">
        {items.map((item, index) => (
          <li key={index} className="flex min-w-0 flex-col bg-white p-6 md:p-8">
            <span className="font-mono text-label text-rim">{LETTERS[index] ?? index + 1}</span>
            <h3 className="mt-3 mb-0 text-header3-clamp font-medium tracking-[-0.02em]">
              {item.title}
            </h3>
            {item.text ? <p className="mt-3 mb-0 max-w-[30em]">{item.text}</p> : null}
            {item.tag ? (
              <span className="mt-auto pt-5">
                <span className="inline-block rounded-full bg-soft px-3 py-1 font-mono text-label text-ink">{item.tag}</span>
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      {content.note ? <p className="mt-6 mb-0 max-w-[40em] text-caption text-rim">{content.note}</p> : null}
    </Section>
  );
}
