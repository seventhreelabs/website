import { createCmssyClient } from "@cmssy/react";
import { cmssy } from "@/cmssy.config";

/** One delivery-API client for the whole app. Only `services/` should import it. */
export const cmssyClient = createCmssyClient(cmssy);
