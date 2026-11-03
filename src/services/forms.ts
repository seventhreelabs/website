"use server";

import { cmssyClient } from "@/lib/cmssy/client";
import { SubmitSiteFormDocument } from "@/lib/graphql/generated/graphql";

/** Submit a Form Builder form. `website` is the honeypot field. */
export async function submitForm(
  formId: string,
  data: Record<string, string>,
  website: string,
) {
  const result = await cmssyClient.queryScoped(SubmitSiteFormDocument, {
    formId,
    input: { data, website },
  });
  return result.public.form.submit;
}
