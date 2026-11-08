import { defineBlock } from "@cmssy/react";
import OfferGrid, { offerGridProps } from "./OfferGrid";

export const offerGridBlock = defineBlock({
  type: "offer-grid",
  label: "Budujemy też",
  category: "Sekcje",
  description: "Siatka pozycji oferty poza automatyzacją: aplikacje, strony, konsulting, szkolenia.",
  component: OfferGrid,
  props: offerGridProps,
});
