import { Fragment } from "react";
import { fields, type BlockProps } from "@cmssy/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export const connectionDiagramProps = {
  anchor: anchorField("polaczenia"),
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
  Jasny: "bg-white text-ink",
  Akcent: "bg-amber text-ink",
};

export default function ConnectionDiagram({
  content,
}: BlockProps<typeof connectionDiagramProps>) {
  const nodes = content.nodes ?? [];

  return (
    <Section anchor={content.anchor} className="stl-grid text-white">
      <SectionHeading className="max-w-[16em]">{content.heading}</SectionHeading>
      {content.text ? (
        <p className="mt-5 mb-10 max-w-[34em] text-medium-clamp md:mb-14">
          {content.text}
        </p>
      ) : null}
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
              className={`min-w-0 flex-1 rounded-xl p-6 ${TONES[node.tone ?? "Ciemny"]}`}
            >
              <h3 className="m-0 mb-3 text-header4-clamp font-bold">{node.title}</h3>
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
