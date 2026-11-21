import { fields } from "@cmssy/react";

export const anchorField = (defaultValue: string) =>
  fields.text({
    label: "Kotwica sekcji",
    helperText: "Identyfikator bez #, używany w linkach menu, np. kontakt.",
    defaultValue,
    tab: "Ustawienia",
  });

const TONES = ["Ciemne", "Jasne"] as const;

export const toneField = () =>
  fields.select({
    label: "Tło",
    helperText: "Jasne odwraca kolory sekcji, np. dla cennika. Najlepiej jedna, dwie jasne sekcje na stronie.",
    options: [...TONES],
    defaultValue: "Ciemne",
    tab: "Ustawienia",
  });

/** True when the editor picked the light background in `toneField`. */
export const isLightTone = (tone?: string | null) => tone === "Jasne";

export const kickerField = () =>
  fields.text({
    label: "Etykieta nad nagłówkiem",
    helperText: "Krótka linia, np. „02 / Co usprawniamy”. Opcjonalna.",
  });
