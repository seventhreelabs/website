import { defineBlock } from "@cmssy/react";
import Services, { servicesProps } from "./Services";

export const servicesBlock = defineBlock({
  type: "services",
  label: "Usługi",
  category: "Sekcje",
  description: "Numerowana siatka usług z krótkim opisem.",
  component: Services,
  props: servicesProps,
});
