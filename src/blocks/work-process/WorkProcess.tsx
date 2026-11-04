import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";
import { WorkProcessView } from "./WorkProcessView";

export const workProcessProps = {
  anchor: anchorField("proces"),
  heading: fields.text({ label: "Nagłówek", required: true }),
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
    },
  }),
};

export type WorkProcessContent = InferBlockContent<typeof workProcessProps>;

export default function WorkProcess({
  content,
  context,
}: BlockProps<typeof workProcessProps>) {
  return (
    <Section anchor={content.anchor}>
      <SectionHeading className="mb-8 md:mb-10">{content.heading}</SectionHeading>
      <WorkProcessView
        locale={context?.locale?.current}
        phases={content.phases ?? []}
        resultLabel={content.resultLabel}
      />
    </Section>
  );
}
