import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export const caseDemoProps = {
  anchor: anchorField("przyklad"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst obok nagłówka" }),
  tag: fields.text({ label: "Etykieta karty", tab: "Karta", helperText: "np. „Demo · faktury kosztowe”." }),
  title: fields.text({ label: "Tytuł karty", tab: "Karta", required: true }),
  description: fields.textarea({ label: "Opis", tab: "Karta" }),
  facts: fields.repeater({
    label: "Fakty",
    tab: "Karta",
    itemLabel: "Fakt",
    addButtonLabel: "Dodaj fakt",
    maxItems: 4,
    itemSchema: {
      label: fields.text({ label: "Nazwa", required: true, helperText: "np. „Wejście”." }),
      value: fields.text({ label: "Wartość", required: true, helperText: "np. „PDF / e-mail”." }),
    },
  }),
  steps: fields.repeater({
    label: "Kroki przepływu",
    tab: "Przepływ",
    itemLabel: "Krok",
    addButtonLabel: "Dodaj krok",
    minItems: 2,
    maxItems: 6,
    itemSchema: {
      text: fields.text({ label: "Opis", required: true }),
      label: fields.text({ label: "Etykieta", helperText: "np. „Agent”, „Reguły”, „Człowiek”." }),
    },
  }),
  stepsNote: fields.text({
    label: "Podpis pod przepływem",
    tab: "Przepływ",
    helperText: "np. „Wizualizacja przykładowego przepływu”.",
  }),
};

export type CaseDemoContent = InferBlockContent<typeof caseDemoProps>;

// first card pulled left, last pushed right: the flow reads as a diagonal
const SHIFT = (index: number, count: number) =>
  index === 0 ? "sm:-translate-x-4.5" : index === count - 1 ? "sm:translate-x-4.5" : "";

/** One sample process: copy with facts on the left, a stepped flow on the right. */
export default function CaseDemo({ content }: BlockProps<typeof caseDemoProps>) {
  const facts = content.facts ?? [];
  const steps = content.steps ?? [];

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor}>
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <div className="grid border border-line bg-card lg:grid-cols-2">
        <div className="min-w-0 px-6 py-7 md:px-10.5 md:py-10">
          {content.tag ? (
            <span className="inline-block bg-amber-tint px-2.5 py-1.5 font-mono text-micro tracking-wider text-amber uppercase">
              {content.tag}
            </span>
          ) : null}
          <h3 className="mt-5 mb-3 text-header3-clamp font-semibold tracking-heading">{content.title}</h3>
          {content.description ? (
            <p className="m-0 max-w-[28em] text-small text-mute">{content.description}</p>
          ) : null}
          {facts.length ? (
            <dl className="mt-7.5 mb-0 grid grid-cols-2 gap-5 border-t border-line pt-4.5">
              {facts.map((fact, index) => (
                <div key={index} className="min-w-0">
                  <dt className="mb-1.5 font-mono text-micro tracking-wider text-mute uppercase">{fact.label}</dt>
                  <dd className="m-0 text-caption font-bold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {steps.length ? (
          <div className="relative row-start-1 flex min-h-72 items-center justify-center overflow-hidden bg-soft px-6 pt-8 pb-14 md:min-h-87.5 md:px-8.5 lg:row-start-auto">
            <ol className="m-0 w-full max-w-90 list-none p-0">
              {steps.map((step, index) => (
                <li key={index} className={SHIFT(index, steps.length)}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="ml-7 block h-2.5 w-px bg-edge" />
                  ) : null}
                  <div className="flex items-center justify-between gap-4 border border-edge bg-lift px-4 py-3.5 text-label font-bold shadow-step">
                    <span className="min-w-0">{step.text}</span>
                    <span className="shrink-0 font-mono text-micro font-normal text-mute uppercase">
                      {String(index + 1).padStart(2, "0")}
                      {step.label ? ` / ${step.label}` : null}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            {content.stepsNote ? (
              <p className="absolute bottom-4 left-5 m-0 font-mono text-micro tracking-wider text-mute uppercase">
                {content.stepsNote}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
