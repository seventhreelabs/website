import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export const workProcessProps = {
  anchor: anchorField("proces"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst pod nagłówkiem" }),
  resultLabel: fields.text({
    label: "Nagłówek efektu etapu",
    defaultValue: "Co dostajesz",
  }),
  phases: fields.repeater({
    label: "Etapy",
    itemLabel: "Etap",
    addButtonLabel: "Dodaj etap",
    collapsible: true,
    minItems: 2,
    maxItems: 6,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Opis" }),
      result: fields.textarea({ label: "Efekt etapu" }),
      tag: fields.text({
        label: "Dopisek",
        helperText: "Krótka linia po prawej, np. „30 min · bezpłatnie”.",
      }),
    },
  }),
};

export type WorkProcessContent = InferBlockContent<typeof workProcessProps>;

/** Heading on the left, numbered phases as ruled rows on the right. */
export default function WorkProcess({ content }: BlockProps<typeof workProcessProps>) {
  const phases = content.phases ?? [];

  return (
    <Section light={isLightTone(content.tone)}
      anchor={content.anchor}
      innerClassName="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-25"
    >
      <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
        <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} stacked className="" />
      </div>
      <ol className="m-0 list-none border-t border-line p-0">
        {phases.map((phase, index) => (
          <li
            key={index}
            className="grid grid-cols-[1.75rem_1fr] items-start gap-x-4 gap-y-2 border-b border-line py-5.5 sm:grid-cols-[2.8rem_1fr_auto]"
          >
            <span className="font-mono text-micro text-amber">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <h3 className="m-0 mb-1.5 text-body font-bold">{phase.title}</h3>
              {phase.text ? <p className="m-0 text-small text-mute">{phase.text}</p> : null}
              {phase.result ? (
                <p className="mt-2 mb-0 text-small">
                  {content.resultLabel ? <strong className="font-bold">{content.resultLabel}: </strong> : null}
                  <span className="text-mute">{phase.result}</span>
                </p>
              ) : null}
            </div>
            {phase.tag ? (
              <small className="col-start-2 font-mono text-micro text-mute uppercase sm:col-start-auto sm:text-right">
                {phase.tag}
              </small>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
