import { fields, type BlockProps } from "@cmssy/react";
import { anchorField } from "../shared/fields";

export const servicesProps = {
  anchor: anchorField("zakres"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  items: fields.repeater({
    label: "Usługi",
    itemLabel: "Usługa",
    addButtonLabel: "Dodaj usługę",
    collapsible: true,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Opis" }),
      visual: fields.select({
        label: "Układ ilustracji",
        helperText:
          "Dokument: notatka i dane, na pełną szerokość. Lista: ciemna karta z wierszami. Etapy: pigułki.",
        options: ["Dokument", "Lista", "Etapy"],
        defaultValue: "Lista",
      }),
      noteTitle: fields.text({
        label: "Notatka: tytuł",
        helperText: "Tylko w układzie Dokument.",
      }),
      noteText: fields.textarea({
        label: "Notatka: treść",
        helperText: "Tylko w układzie Dokument.",
      }),
      rows: fields.repeater({
        label: "Wiersze ilustracji",
        itemLabel: "Wiersz",
        addButtonLabel: "Dodaj wiersz",
        itemSchema: {
          label: fields.text({ label: "Nazwa", required: true }),
          value: fields.text({ label: "Wartość" }),
          highlighted: fields.boolean({ label: "Wyróżnij" }),
        },
      }),
    },
  }),
};

type Row = { label: string; value?: string; highlighted?: boolean };

function DocumentVisual({
  title,
  text,
  rows,
}: {
  title?: string;
  text?: string;
  rows: Row[];
}) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      <div className="rounded-lg bg-soft p-5 text-caption leading-relaxed text-ink">
        {title ? <strong className="block">{title}</strong> : null}
        {text}
      </div>
      <dl className="m-0 rounded-lg bg-panel p-5 font-mono text-label leading-loose text-white">
        {rows.map((row, index) => (
          <div
            key={index}
            className={`flex flex-wrap gap-x-2 ${row.highlighted ? "text-amber" : ""}`}
          >
            <dt>{row.label}:</dt>
            <dd className="m-0">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ListVisual({ rows }: { rows: Row[] }) {
  return (
    <dl className="m-0 border-t border-edge pt-4 font-mono text-label leading-loose">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`flex flex-wrap justify-between gap-x-4 ${row.highlighted ? "text-amber" : ""}`}
        >
          <dt>{row.label}</dt>
          <dd className={`m-0 ${row.highlighted ? "" : "text-mute"}`}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StepsVisual({ rows }: { rows: Row[] }) {
  return (
    <ol className="m-0 flex list-none flex-wrap gap-2 border-t border-line p-0 pt-4 font-mono text-label">
      {rows.map((row, index) => (
        <li
          key={index}
          className={`rounded-full px-3 py-1.5 ${row.highlighted ? "bg-ink text-white" : "bg-soft"}`}
        >
          {row.label}
        </li>
      ))}
    </ol>
  );
}

export default function Services({
  content,
}: BlockProps<typeof servicesProps>) {
  const items = content.items ?? [];

  return (
    <section
      id={content.anchor || undefined}
      className="mx-auto max-w-content scroll-mt-4 px-5 py-16 md:px-8 md:py-26"
    >
      <h2 className="m-0 mb-8 text-header2-clamp font-medium tracking-[-0.03em] md:mb-12">
        {content.heading}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {items.map((item, index) => {
          const visual = item.visual ?? "Lista";
          const rows = item.rows ?? [];
          const wide = visual === "Dokument";
          const dark = visual === "Lista";

          return (
            <article
              key={index}
              className={`min-w-0 rounded-xl p-6 md:p-10 ${
                dark ? "bg-panel text-white" : "border border-line bg-white"
              } ${wide ? "grid items-center gap-6 md:col-span-2 lg:grid-cols-[1fr_2fr] lg:gap-14" : ""}`}
            >
              <div className="min-w-0">
                <h3 className="m-0 text-header3-clamp font-medium tracking-[-0.02em]">
                  {item.title}
                </h3>
                {item.text ? (
                  <p className={`mt-4 ${wide ? "mb-0" : "mb-7"} max-w-[32em]`}>
                    {item.text}
                  </p>
                ) : null}
              </div>
              {visual === "Dokument" ? (
                <DocumentVisual
                  title={item.noteTitle}
                  text={item.noteText}
                  rows={rows}
                />
              ) : null}
              {visual === "Lista" ? <ListVisual rows={rows} /> : null}
              {visual === "Etapy" ? <StepsVisual rows={rows} /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
