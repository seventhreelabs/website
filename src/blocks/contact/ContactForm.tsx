"use client";

import { useState, type FormEvent } from "react";
import {
  isFormFieldRequired,
  visibleFormFields,
  type CmssyFormDefinition,
  type CmssyFormField,
} from "@cmssy/react";
import { Button } from "@/components/ui/button";
import { submitForm } from "@/services/forms";
import { localize } from "@/utils/localize";

const CONTROL =
  "box-border w-full rounded-xs border border-edge bg-paper px-4 py-3 font-[inherit] text-ink focus:border-amber";

const INPUT_TYPES: Partial<Record<CmssyFormField["fieldType"], string>> = {
  email: "email",
  phone: "tel",
  url: "url",
  number: "number",
  date: "date",
  datetime: "datetime-local",
};

const SUPPORTED = new Set<CmssyFormField["fieldType"]>([
  "text",
  "email",
  "phone",
  "url",
  "number",
  "date",
  "datetime",
  "textarea",
  "select",
]);

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm({
  form,
  locale,
  prefill,
  idPrefix = "contact",
}: {
  form: CmssyFormDefinition;
  locale: string;
  /** Values set by the page, not the visitor; their fields are not rendered. */
  prefill?: Record<string, string>;
  /** Keeps element ids unique when two forms share a page. */
  idPrefix?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...Object.fromEntries(
      form.fields.map((field) => [field.name, field.defaultValue ?? ""]),
    ),
    ...prefill,
  }));
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { settings } = form;
  const errorMessage = localize(settings.errorMessage, locale);

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ kind: "sending" });
    try {
      const result = await submitForm(form.id, values, website);
      if (!result.success) {
        setStatus({ kind: "error", message: result.message || errorMessage });
        return;
      }
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      setStatus({
        kind: "sent",
        message: localize(settings.successMessage, locale) || result.message,
      });
    } catch {
      setStatus({ kind: "error", message: errorMessage });
    }
  };

  if (status.kind === "sent") {
    return (
      <p role="status" className="m-0 self-center text-medium-clamp">
        {status.message}
      </p>
    );
  }

  const fields = visibleFormFields(form.fields, values)
    .filter((field) => SUPPORTED.has(field.fieldType) && !(prefill && field.name in prefill))
    .sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={send} className="flex min-w-0 flex-col gap-5">
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const shared = {
          id,
          name: field.name,
          required: isFormFieldRequired(field, values),
          value: values[field.name] ?? "",
          placeholder: localize(field.placeholder, locale) || undefined,
          onChange: (event: { target: { value: string } }) =>
            setValues((current) => ({
              ...current,
              [field.name]: event.target.value,
            })),
        };

        return (
          <div key={field.id} className="flex flex-col gap-2">
            <label htmlFor={id} className="text-small font-bold">
              {localize(field.label, locale)}
            </label>
            {field.fieldType === "textarea" ? (
              <textarea {...shared} rows={5} className={`${CONTROL} resize-y`} />
            ) : field.fieldType === "select" ? (
              <select {...shared} className={`${CONTROL} min-h-13`}>
                <option value="" />
                {field.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {localize(option.label, locale)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...shared}
                type={INPUT_TYPES[field.fieldType] ?? "text"}
                className={`${CONTROL} min-h-13`}
              />
            )}
            {field.helpText ? (
              <p className="m-0 text-caption text-mute">
                {localize(field.helpText, locale)}
              </p>
            ) : null}
          </div>
        );
      })}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${idPrefix}-website`}>Website</label>
        <input
          id={`${idPrefix}-website`}
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      {status.kind === "error" ? (
        <p role="alert" className="m-0 text-amber">
          {status.message}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={status.kind === "sending"}
        className="disabled:opacity-60 sm:self-start"
      >
        {localize(settings.submitButtonLabel, locale)}
      </Button>
    </form>
  );
}
