import { defineBlock } from "@cmssy/react";
import NotFound, { notFoundProps } from "./NotFound";

export const notFoundBlock = defineBlock({
  type: "not-found",
  label: "Strona błędu",
  category: "Strony",
  description: "Kod, nagłówek, tekst i przycisk powrotu. Dla strony 404 wskazanej w Ustawienia -> Strona.",
  component: NotFound,
  props: notFoundProps,
});
