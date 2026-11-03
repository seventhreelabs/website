import { Fragment } from "react";
import { fields, type BlockProps } from "@cmssy/react";
import { anchorField } from "../shared/fields";

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
    <section
      id={content.anchor || undefined}
      className="stl-grid scroll-mt-4 text-white"
    >
      <div className="mx-auto max-w-[80rem] px-5 py-16 md:px-8 md:py-26">
        <h2 className="m-0 max-w-[16em] text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          {content.heading}
        </h2>
        {content.text ? (
          <p className="mt-5 mb-10 max-w-[34em] text-lg md:mb-14 md:text-xl">
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
                <h3 className="m-0 mb-3 text-xl font-bold">{node.title}</h3>
                <ul className="m-0 list-none p-0 font-mono text-sm leading-loose">
                  {(node.items ?? []).map((item, itemIndex) => (
                    <li key={itemIndex}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
