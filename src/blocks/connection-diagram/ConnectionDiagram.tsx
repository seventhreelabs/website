import { Fragment } from "react";
import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHead } from "@/components/ui/section";
import { anchorField, kickerField, isLightTone, toneField } from "@/lib/cmssy/fields";

export type ConnectionDiagramContent = InferBlockContent<typeof connectionDiagramProps>;

export const connectionDiagramProps = {
  anchor: anchorField("polaczenia"),
  tone: toneField(),
  kicker: kickerField(),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  nodes: fields.repeater({
    label: "Etapy schematu",
    itemLabel: "Etap",
    addButtonLabel: "Dodaj etap",
    collapsible: true,
    minItems: 2,
    maxItems: 5,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      tone: fields.select({
        label: "Kolor",
        options: ["Ciemny", "Jasny", "Akcent"],
        defaultValue: "Ciemny",
      }),
      items: fields.repeater({
        label: "Pozycje",
        itemLabel: "Pozycja",
        addButtonLabel: "Dodaj pozycję",
        itemSchema: {
          text: fields.text({ label: "Tekst", required: true }),
        },
      }),
    },
  }),
};

const TONES = {
  Ciemny: "border border-edge bg-panel",
  Jasny: "border border-edge bg-lift shadow-step",
  Akcent: "bg-amber text-pitch",
};

export default function ConnectionDiagram({
  content,
}: BlockProps<typeof connectionDiagramProps>) {
  const nodes = content.nodes ?? [];

  return (
    <Section light={isLightTone(content.tone)} anchor={content.anchor} className="stl-grid">
      <SectionHead kicker={content.kicker} heading={content.heading} text={content.text} />
      <div className="flex flex-col lg:flex-row">
        {nodes.map((node, index) => (
          <Fragment key={index}>
            {index > 0 ? (
              <div
                aria-hidden="true"
                className="stl-pipe ml-7 h-8 w-0.5 shrink-0 lg:ml-0 lg:h-0.5 lg:w-10 lg:self-center"
              />
            ) : null}
            <div
              className={`min-w-0 flex-1 p-6 ${TONES[node.tone ?? "Ciemny"]}`}
            >
              <h3 className="m-0 mb-3 text-header4-clamp font-bold tracking-title">{node.title}</h3>
              <ul className="m-0 list-none p-0 font-mono text-label leading-loose">
                {(node.items ?? []).map((item, itemIndex) => (
                  <li key={itemIndex}>{item.text}</li>
                ))}
              </ul>
            </div>
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
