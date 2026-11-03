import { defineBlock } from "@cmssy/react";
import Contact, { contactProps } from "./Contact";

export const contactBlock = defineBlock({
  type: "contact",
  label: "Kontakt",
  category: "Sekcje",
  description: "Nagłówek, adres e-mail i formularz z Form Buildera Cmssy.",
  component: Contact,
  props: contactProps,
});
