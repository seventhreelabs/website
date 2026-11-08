import { defineBlock } from "@cmssy/react";
import Pricing, { pricingProps } from "./Pricing";

export const pricingBlock = defineBlock({
  type: "pricing",
  label: "Cennik",
  category: "Sekcje",
  description: "Etapy z cenami, pakiety abonamentu, stawka za prace dodatkowe i zastrzeżenie.",
  component: Pricing,
  props: pricingProps,
});
