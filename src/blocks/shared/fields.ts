import { fields } from "@cmssy/react";

export const anchorField = (defaultValue: string) =>
  fields.text({
    label: "Kotwica sekcji",
    helperText: "Identyfikator bez #, używany w linkach menu, np. kontakt.",
    defaultValue,
    tab: "Ustawienia",
  });
