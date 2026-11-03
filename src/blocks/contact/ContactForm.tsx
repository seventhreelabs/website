"use client";

import { useState, type FormEvent } from "react";
import {
  isFormFieldRequired,
  visibleFormFields,
  type CmssyFormDefinition,
  type CmssyFormField,
} from "@cmssy/react";
import { submitForm } from "./actions";

const CONTROL =
  "box-border w-full rounded-lg border border-rim bg-pitch px-4 py-3 font-[inherit] text-white";

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

type LocalizedText = string | Record<string, string> | null | undefined;

function localize(text: LocalizedText, locale: string) {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale] ?? Object.values(text)[0] ?? "";
}

type Status = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export function ContactForm({
  form,
  locale,
}: {
  form: CmssyFormDefinition;
  locale: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      form.fields.map((field) => [field.name, field.defaultValue ?? ""]),
    ),
  );
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
    .filter((field) => SUPPORTED.has(field.fieldType))
    .sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={send} className="flex min-w-0 flex-col gap-5">
      {fields.map((field) => {
        const id = `contact-${field.name}`;
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
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
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
      <button
        type="submit"
        disabled={status.kind === "sending"}
        className="min-h-13 rounded-full bg-amber px-7 font-bold text-ink hover:opacity-90 disabled:opacity-60 sm:self-start"
      >
        {localize(settings.submitButtonLabel, locale)}
      </button>
    </form>
  );
}
