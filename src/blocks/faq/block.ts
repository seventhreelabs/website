import { defineBlock } from "@cmssy/react";
import Faq, { faqProps } from "./Faq";

export const faqBlock = defineBlock({
  type: "faq",
  label: "Pytania",
  category: "Sekcje",
  description: "Rozwijana lista pytań i odpowiedzi.",
  component: Faq,
  props: faqProps,
});
