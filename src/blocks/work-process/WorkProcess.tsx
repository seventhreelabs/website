import { fields, type BlockProps } from "@cmssy/react";
import { anchorField } from "../shared/fields";
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

export default function WorkProcess({
  content,
}: BlockProps<typeof workProcessProps>) {
  return (
    <section
      id={content.anchor || undefined}
      className="mx-auto max-w-content scroll-mt-4 px-5 py-16 md:px-8 md:py-26"
    >
      <h2 className="m-0 mb-8 text-header2-clamp font-medium tracking-[-0.03em] md:mb-10">
        {content.heading}
      </h2>
      <WorkProcessView
        phases={content.phases ?? []}
        resultLabel={content.resultLabel}
      />
    </section>
  );
}
