import { defineBlock } from "@cmssy/react";
import ConnectionDiagram, { connectionDiagramProps } from "./ConnectionDiagram";

export const connectionDiagramBlock = defineBlock({
  type: "connection-diagram",
  label: "Schemat połączeń",
  category: "Sekcje",
  description: "Animowany schemat etapów połączonych linią.",
  component: ConnectionDiagram,
  props: connectionDiagramProps,
});
