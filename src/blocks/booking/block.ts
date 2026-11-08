import { defineBlock } from "@cmssy/react";
import Booking, { bookingProps } from "./Booking";

export const bookingBlock = defineBlock({
  type: "booking",
  label: "Umów spotkanie",
  category: "Strony",
  description: "Strona rezerwacji: fakty o rozmowie, lista „co przygotować” i osadzony kalendarz (Cal.com, Calendly) albo przycisk z mailem.",
  component: Booking,
  props: bookingProps,
});
