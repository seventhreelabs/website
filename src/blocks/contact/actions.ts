"use server";

import {
  createCmssyClient,
  typedOperation,
  type CmssyFormSubmitResponse,
} from "@cmssy/react";
import { cmssy } from "@/cmssy.config";

const SUBMIT_FORM = typedOperation<
  { public: { form: { submit: CmssyFormSubmitResponse } } },
  {
    formId: string;
    input: { data: Record<string, string>; website?: string };
  }
>(`mutation SubmitForm($formId: ID!, $input: SubmitFormInput!) {
  public {
    form {
      submit(formId: $formId, input: $input) {
        success message submissionId redirectUrl
      }
    }
  }
}`);

const client = createCmssyClient(cmssy);

export async function submitForm(
  formId: string,
  data: Record<string, string>,
  website: string,
) {
  const result = await client.queryScoped(SUBMIT_FORM, {
    formId,
    input: { data, website },
  });
  return result.public.form.submit;
}
