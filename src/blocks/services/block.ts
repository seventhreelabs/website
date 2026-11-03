import { defineBlock } from "@cmssy/react";
import Services, { servicesProps } from "./Services";

export const servicesBlock = defineBlock({
  type: "services",
  label: "Usługi",
  category: "Sekcje",
  description: "Siatka usług z ilustracją danych przy każdej pozycji.",
  component: Services,
  props: servicesProps,
});
