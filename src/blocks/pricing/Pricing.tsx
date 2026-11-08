import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section, SectionHeading } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";

export type PricingContent = InferBlockContent<typeof pricingProps>;

export const pricingProps = {
  anchor: anchorField("cennik"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  terms: fields.repeater({
    label: "Warunki",
    helperText: "Krótkie etykiety nad etapami, np. „Ceny netto, doliczamy 23% VAT”.",
    itemLabel: "Warunek",
    addButtonLabel: "Dodaj warunek",
    maxItems: 4,
    itemSchema: { text: fields.text({ label: "Tekst", required: true }) },
  }),
  stages: fields.repeater({
    label: "Etapy i ceny",
    tab: "Etapy",
    itemLabel: "Etap",
    addButtonLabel: "Dodaj etap",
    collapsible: true,
    minItems: 2,
    maxItems: 6,
    itemSchema: {
      title: fields.text({ label: "Etap", required: true }),
      text: fields.textarea({ label: "Co się dzieje" }),
      price: fields.text({ label: "Cena", helperText: "np. „bezpłatnie”, „2 900 zł”, „od 9 900 zł”." }),
      paid: fields.boolean({ label: "Etap płatny", helperText: "Wyróżnia numer i cenę." }),
    },
  }),
  stagesNotes: fields.repeater({
    label: "Dopiski pod etapami",
    tab: "Etapy",
    itemLabel: "Dopisek",
    addButtonLabel: "Dodaj dopisek",
    maxItems: 3,
    itemSchema: {
      title: fields.text({ label: "Tytuł", required: true }),
      text: fields.textarea({ label: "Treść" }),
    },
  }),
  plansHeading: fields.text({ label: "Nagłówek abonamentu", tab: "Abonament" }),
  plansText: fields.textarea({ label: "Tekst abonamentu", tab: "Abonament" }),
  plans: fields.repeater({
    label: "Pakiety",
    tab: "Abonament",
    itemLabel: "Pakiet",
    addButtonLabel: "Dodaj pakiet",
    collapsible: true,
    maxItems: 4,
    itemSchema: {
      name: fields.text({ label: "Nazwa", required: true }),
      tagline: fields.text({ label: "Podtytuł", helperText: "np. „działa i jest bezpiecznie”." }),
      price: fields.text({ label: "Cena", required: true }),
      period: fields.text({ label: "Okres", defaultValue: "netto / miesiąc" }),
      badge: fields.text({ label: "Odznaka", helperText: "np. „Polecany”. Opcjonalna." }),
      highlighted: fields.boolean({ label: "Wyróżnij" }),
      features: fields.repeater({
        label: "Co w pakiecie",
        itemLabel: "Pozycja",
        addButtonLabel: "Dodaj pozycję",
        itemSchema: { text: fields.text({ label: "Tekst", required: true }) },
      }),
    },
  }),
  plansNote: fields.textarea({
    label: "Dopisek pod pakietami",
    tab: "Abonament",
    helperText: "Okres minimalny, wypowiedzenie, godziny dostępności.",
  }),
  extras: fields.repeater({
    label: "Karty dodatkowe",
    tab: "Abonament",
    helperText: "np. stawka za prace poza zakresem, koszty narzędzi.",
    itemLabel: "Karta",
    addButtonLabel: "Dodaj kartę",
    maxItems: 3,
    itemSchema: {
      label: fields.text({ label: "Etykieta", helperText: "Mała linia nad tytułem, np. „Prace poza zakresem”." }),
      title: fields.text({ label: "Tytuł", required: true, helperText: "np. „220 zł netto / godz.”" }),
      text: fields.textarea({ label: "Treść" }),
    },
  }),
  disclaimer: fields.textarea({
    label: "Zastrzeżenie",
    tab: "Abonament",
    helperText: "Drobny tekst na końcu sekcji, np. że cennik ma charakter informacyjny.",
  }),
};

type Plan = NonNullable<PricingContent["plans"]>[number];

function PlanCard({ plan }: { plan: Plan }) {
  const hot = Boolean(plan.highlighted);
  return (
    <article
      className={`relative flex min-w-0 flex-col rounded-xl p-6 md:p-8 ${
        hot ? "bg-ink text-white" : "border border-line bg-white"
      }`}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-6 rounded-full bg-amber px-3 py-1 font-mono text-label font-bold text-ink uppercase">
          {plan.badge}
        </span>
      ) : null}
      <h4 className="m-0 text-header3-clamp font-medium tracking-[-0.02em]">{plan.name}</h4>
      {plan.tagline ? (
        <p className={`mt-1 mb-0 font-mono text-label uppercase ${hot ? "text-mute" : "text-rim"}`}>
          {plan.tagline}
        </p>
      ) : null}
      <p className="mt-6 mb-0 text-header2-clamp leading-none font-medium tracking-[-0.03em]">
        {plan.price}
      </p>
      {plan.period ? (
        <p className={`mt-1 mb-0 text-caption ${hot ? "text-mute" : "text-rim"}`}>{plan.period}</p>
      ) : null}
      <ul className={`mt-6 mb-0 list-none border-t p-0 pt-5 text-small ${hot ? "border-edge" : "border-line"}`}>
        {(plan.features ?? []).map((f, i) => (
          <li key={i} className="flex gap-3 py-1.5">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-amber" />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Pricing: stages with prices, maintenance plans, extras and the fine print. */
export default function Pricing({ content }: BlockProps<typeof pricingProps>) {
  const stages = content.stages ?? [];
  const plans = content.plans ?? [];
  const stagesNotes = content.stagesNotes ?? [];
  const extras = content.extras ?? [];

  return (
    <Section anchor={content.anchor}>
      <SectionHeading className="max-w-[14em]">{content.heading}</SectionHeading>
      {content.text ? (
        <p className="mt-5 mb-0 max-w-[34em] text-medium-clamp">{content.text}</p>
      ) : null}
      {(content.terms ?? []).length ? (
        <ul className="mt-6 flex list-none flex-wrap gap-2 p-0 font-mono text-label">
          {(content.terms ?? []).map((t, i) => (
            <li key={i} className="rounded border border-line px-3 py-1.5">
              {t.text}
            </li>
          ))}
        </ul>
      ) : null}

      <ol className="mt-10 mb-0 list-none border-t border-ink p-0 md:mt-14">
        {stages.map((stage, index) => (
          <li
            key={index}
            className="grid gap-x-6 gap-y-2 border-b border-line py-5 md:grid-cols-[3rem_1fr_2fr_auto] md:items-baseline md:py-6"
          >
            <span className={`font-mono text-label ${stage.paid ? "text-amber" : "text-rim"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="m-0 text-header4-clamp font-medium">{stage.title}</h3>
            <p className="m-0 max-w-[36em] text-small text-rim md:text-body md:text-ink">{stage.text}</p>
            <p
              className={`m-0 md:text-right ${
                stage.paid ? "text-header4-clamp font-medium" : "font-mono text-label text-rim"
              }`}
            >
              {stage.price}
            </p>
          </li>
        ))}
      </ol>
      {stagesNotes.length ? (
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl bg-edge md:grid-cols-2">
          {stagesNotes.map((note, i) => (
            <div key={i} className="bg-panel p-6 text-white md:p-8">
              <h3 className="m-0 text-header4-clamp font-medium">{note.title}</h3>
              {note.text ? <p className="mt-2 mb-0 text-small text-mute">{note.text}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {plans.length ? (
        <div className="mt-16 md:mt-24">
          {content.plansHeading ? (
            <h3 className="m-0 max-w-[16em] text-header3-clamp font-medium tracking-[-0.02em]">
              {content.plansHeading}
            </h3>
          ) : null}
          {content.plansText ? (
            <p className="mt-3 mb-0 max-w-[34em]">{content.plansText}</p>
          ) : null}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((plan, i) => (
              <PlanCard key={i} plan={plan} />
            ))}
          </div>
          {content.plansNote ? (
            <p className="mt-5 mb-0 max-w-[48em] text-caption text-rim">{content.plansNote}</p>
          ) : null}
        </div>
      ) : null}

      {extras.length ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {extras.map((card, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-6 md:p-8">
              {card.label ? (
                <p className="m-0 font-mono text-label text-rim uppercase">{card.label}</p>
              ) : null}
              <p className="mt-2 mb-0 text-header3-clamp font-medium tracking-[-0.02em]">{card.title}</p>
              {card.text ? <p className="mt-2 mb-0 text-small">{card.text}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {content.disclaimer ? (
        <p className="mt-8 mb-0 max-w-[48em] text-caption text-rim">{content.disclaimer}</p>
      ) : null}
    </Section>
  );
}
