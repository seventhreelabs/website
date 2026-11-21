import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { Section } from "@/components/ui/section";
import { anchorField, isLightTone, toneField } from "@/lib/cmssy/fields";
import { localizedHref } from "@/utils/localized-href";
import { AnalyzerForm } from "./AnalyzerForm";

export type ProcessAnalyzerContent = InferBlockContent<typeof processAnalyzerProps>;

export const processAnalyzerProps = {
  anchor: anchorField("analizator"),
  tone: toneField(),
  headingLevel: fields.select({
    label: "Poziom nagłówka",
    helperText: "H1, gdy analizator jest pierwszą sekcją strony.",
    options: ["H1", "H2"],
    defaultValue: "H2",
    tab: "Ustawienia",
  }),
  heading: fields.text({ label: "Nagłówek", required: true }),
  text: fields.textarea({ label: "Tekst" }),
  inputLabel: fields.text({ label: "Etykieta pola opisu", defaultValue: "Opisz swój proces" }),
  placeholder: fields.textarea({
    label: "Podpowiedź w polu",
    helperText: "Przykładowy opis widoczny w pustym polu.",
  }),
  privacyNote: fields.textarea({
    label: "Uwaga pod polem",
    helperText: "Np. żeby nie wpisywać danych osobowych i kto przetwarza opis.",
  }),
  submitLabel: fields.text({ label: "Przycisk: tekst", defaultValue: "Sprawdź" }),
  loadingLabel: fields.text({ label: "Przycisk w trakcie analizy", defaultValue: "Analizuję…" }),

  verdictYes: fields.text({ label: "Werdykt: da się", tab: "Wynik", defaultValue: "Da się zautomatyzować" }),
  verdictPartial: fields.text({ label: "Werdykt: częściowo", tab: "Wynik", defaultValue: "Częściowo do automatyzacji" }),
  verdictNo: fields.text({ label: "Werdykt: raczej nie", tab: "Wynik", defaultValue: "Raczej nie warto" }),
  stepsHeading: fields.text({ label: "Nagłówek kroków", tab: "Wynik", defaultValue: "Co i jak zautomatyzować" }),
  timeSavedLabel: fields.text({ label: "Etykieta oszczędności", tab: "Wynik", defaultValue: "Szacowana oszczędność" }),
  servicesHeading: fields.text({ label: "Nagłówek usług", tab: "Wynik", defaultValue: "Jak możemy pomóc" }),
  ctaLabel: fields.text({ label: "Przycisk: tekst", tab: "Wynik", defaultValue: "Umów bezpłatną konsultację" }),
  ctaHref: fields.link({ label: "Przycisk: adres", tab: "Wynik" }),
  disclaimer: fields.textarea({
    label: "Dopisek pod wynikiem",
    tab: "Wynik",
    helperText: "Np. że to wstępna ocena AI, a szczegóły ustalamy na rozmowie.",
  }),
  resetLabel: fields.text({ label: "Link: nowa analiza", tab: "Wynik", defaultValue: "Opisz inny proces" }),

  services: fields.repeater({
    label: "Usługi do polecania",
    tab: "Usługi",
    helperText: "AI wybiera z tej listy najwyżej 2 pasujące do opisu. Opis usługi czyta też model.",
    itemLabel: "Usługa",
    addButtonLabel: "Dodaj usługę",
    collapsible: true,
    maxItems: 8,
    itemSchema: {
      name: fields.text({ label: "Nazwa", required: true }),
      description: fields.textarea({ label: "Opis" }),
      href: fields.link({ label: "Adres", helperText: "Opcjonalny link do opisu usługi." }),
      linkLabel: fields.text({ label: "Tekst linku", defaultValue: "Więcej" }),
    },
  }),

  sendLabel: fields.text({ label: "Przycisk: wyślij analizę", tab: "Wyślij", defaultValue: "Wyślij nam tę analizę" }),
  sendText: fields.textarea({
    label: "Tekst nad formularzem",
    tab: "Wyślij",
    helperText: "Np. że opis i wynik trafią do nas razem z danymi kontaktowymi.",
  }),
  form: fields.form({
    label: "Formularz",
    tab: "Wyślij",
    helperText: "Formularz kontaktowy z Form Buildera. Pusty: bez przycisku wysyłki.",
  }),
  messageField: fields.text({
    label: "Pole na treść analizy",
    tab: "Wyślij",
    helperText: "Nazwa pola formularza, do którego wpisujemy opis i wynik. Ukrywamy je.",
    defaultValue: "message",
  }),

  offTopicMessage: fields.textarea({ label: "Opis spoza tematu", tab: "Komunikaty" }),
  limitMessage: fields.textarea({ label: "Limit wyczerpany", tab: "Komunikaty" }),
  captchaMessage: fields.textarea({ label: "Weryfikacja nieudana", tab: "Komunikaty" }),
  errorMessage: fields.textarea({ label: "Błąd", tab: "Komunikaty" }),
  tooShortMessage: fields.text({
    label: "Za krótki opis",
    tab: "Komunikaty",
    defaultValue: "Opisz proces nieco dokładniej.",
  }),
};

/** "Describe your process" tool: an AI verdict on what to automate and how, then a way to us. */
export default function ProcessAnalyzer({ content, context }: BlockProps<typeof processAnalyzerProps>) {
  const Heading = content.headingLevel === "H1" ? "h1" : "h2";
  const form = content.form ? context?.forms?.[content.form] : undefined;
  // links resolved here: the client form only gets the locale code
  const href = (value?: string) => (value ? localizedHref(value, context?.locale) : value);
  const resolved = {
    ...content,
    ctaHref: href(content.ctaHref),
    services: content.services?.map((service) => ({ ...service, href: href(service.href) })),
  };

  return (
    <Section light={isLightTone(content.tone)}
      anchor={content.anchor}
      className="bg-panel text-white"
      innerClassName="grid gap-10 lg:grid-cols-2 lg:gap-18"
    >
      <div className="min-w-0">
        <Heading className="m-0 text-header2-clamp font-semibold tracking-heading text-balance">
          {content.heading}
        </Heading>
        {content.text ? <p className="mt-6 mb-0 max-w-[30em] text-medium-clamp">{content.text}</p> : null}
      </div>
      <AnalyzerForm content={resolved} form={form} locale={context?.locale.current ?? "pl"} />
    </Section>
  );
}
