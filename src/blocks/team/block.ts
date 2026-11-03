import { defineBlock } from "@cmssy/react";
import Team, { teamProps } from "./Team";

export const teamBlock = defineBlock({
  type: "team",
  label: "Zespół",
  category: "Sekcje",
  description: "Osoby ze zdjęciem, rolą, opisem i linkiem do profilu.",
  component: Team,
  props: teamProps,
});
