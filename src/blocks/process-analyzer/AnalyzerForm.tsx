"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import type { CmssyFormDefinition } from "@cmssy/react";
import { ContactForm } from "@/blocks/contact/ContactForm";
import { Button } from "@/components/ui/button";
import { analyzeProcess } from "@/services/analyzer";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  analysisAsText,
  type AnalyzerError,
  type ProcessAnalysis,
} from "@/utils/process-analysis";
import type { ProcessAnalyzerContent } from "./ProcessAnalyzer";

// Cloudflare's always-pass test key outside production builds.
const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  (process.env.NODE_ENV === "production" ? "" : "1x00000000000000000000AA");

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
    dataLayer?: Record<string, unknown>[];
  }
}

const CONTROL =
  "box-border w-full border border-rim bg-pitch px-4 py-3 font-[inherit] text-white";

const track = (event: string, extra: Record<string, unknown> = {}) =>
  window.dataLayer?.push({ event, ...extra });

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "error"; error: AnalyzerError | "tooShort" }
  | { kind: "done"; analysis: ProcessAnalysis };

export function AnalyzerForm({
  content,
  form,
  locale,
}: {
  content: ProcessAnalyzerContent;
  form?: CmssyFormDefinition;
  locale: string;
}) {
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [scriptReady, setScriptReady] = useState(false);
  const widgetEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const services = content.services ?? [];

  const mountWidget = useCallback(() => {
    if (!SITE_KEY || !widgetEl.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(widgetEl.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      appearance: "interaction-only",
      language: locale,
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [locale]);

  useEffect(() => {
    if (scriptReady) mountWidget();
  }, [scriptReady, mountWidget, state.kind]);

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    },
    [],
  );

  const resetWidget = () => {
    setToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = description.trim();
    if (text.length < DESCRIPTION_MIN) {
      setState({ kind: "error", error: "tooShort" });
      return;
    }
    setState({ kind: "sending" });
    track("analyzer_submit");
    try {
      const result = await analyzeProcess({
        description: text,
        services: services.map((s) => ({ name: s.name, description: s.description })),
        locale,
        turnstileToken: token,
        website,
      });
      if (result.ok) {
        // The widget unmounts with the form; a new analysis mounts a fresh one.
        widgetId.current = null;
        setToken("");
        setState({ kind: "done", analysis: result.analysis });
        track("analyzer_result", { verdict: result.analysis.verdict });
      } else {
        resetWidget();
        setState({ kind: "error", error: result.error });
        track("analyzer_error", { reason: result.error });
      }
    } catch {
      resetWidget();
      setState({ kind: "error", error: "unavailable" });
    }
  };

  const messages: Record<AnalyzerError | "tooShort", string | null | undefined> = {
    tooShort: content.tooShortMessage,
    invalid: content.tooShortMessage,
    captcha: content.captchaMessage,
    limited: content.limitMessage,
    offTopic: content.offTopicMessage,
    unavailable: content.errorMessage,
  };

  const script = SITE_KEY ? (
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onReady={() => setScriptReady(true)}
    />
  ) : null;

  if (state.kind === "done") {
    return (
      <>
        {script}
        <AnalysisResult
          analysis={state.analysis}
          content={content}
          description={description.trim()}
          form={form}
          locale={locale}
          onReset={() => setState({ kind: "idle" })}
        />
      </>
    );
  }

  const sending = state.kind === "sending";

  return (
    <form onSubmit={submit} noValidate className="flex min-w-0 flex-col gap-3">
      {script}
      <label htmlFor="analyzer-description" className="text-small font-bold">
        {content.inputLabel}
      </label>
      <textarea
        id="analyzer-description"
        name="description"
        required
        rows={9}
        minLength={DESCRIPTION_MIN}
        maxLength={DESCRIPTION_MAX}
        value={description}
        placeholder={content.placeholder ?? undefined}
        onChange={(event) => setDescription(event.target.value)}
        className={`${CONTROL} resize-y`}
      />
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-caption text-mute">
        {content.privacyNote ? <p className="m-0 max-w-[36em]">{content.privacyNote}</p> : <span />}
        <span className="font-mono">
          {description.length}/{DESCRIPTION_MAX}
        </span>
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="analyzer-website">Website</label>
        <input
          id="analyzer-website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      <div ref={widgetEl} />
      {state.kind === "error" && messages[state.error] ? (
        <p role="alert" className="m-0 text-amber">
          {messages[state.error]}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={sending || !token}
        className="mt-2 disabled:opacity-60 sm:self-start"
      >
        {sending ? content.loadingLabel : content.submitLabel}
      </Button>
    </form>
  );
}

function AnalysisResult({
  analysis,
  content,
  description,
  form,
  locale,
  onReset,
}: {
  analysis: ProcessAnalysis;
  content: ProcessAnalyzerContent;
  description: string;
  form?: CmssyFormDefinition;
  locale: string;
  onReset: () => void;
}) {
  const [sendOpen, setSendOpen] = useState(false);
  const services = analysis.recommendedServices
    .map((index) => content.services?.[index])
    .filter((service) => service !== undefined);
  const verdictLabel = {
    yes: content.verdictYes,
    partial: content.verdictPartial,
    no: content.verdictNo,
  }[analysis.verdict];
  const messageField = content.messageField || "message";
  const canSend = form?.fields.some((field) => field.name === messageField);

  return (
    <div role="status" className="flex min-w-0 flex-col gap-8">
      <div>
        <span
          className={`inline-block px-4 py-1.5 font-mono text-label font-bold uppercase tracking-kicker ${
            analysis.verdict === "no" ? "border border-mute text-mute" : "bg-amber text-pitch"
          }`}
        >
          {verdictLabel}
        </span>
        <p className="mt-5 mb-0 text-large-clamp">{analysis.summary}</p>
      </div>

      {analysis.steps.length ? (
        <div>
          <h3 className="m-0 text-header4-clamp font-medium">{content.stepsHeading}</h3>
          <ol className="mt-4 mb-0 grid list-none gap-px border border-edge bg-edge p-0">
            {analysis.steps.map((step, index) => (
              <li key={index} className="flex gap-4 bg-panel p-5">
                <span className="font-mono text-label text-amber">{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <strong className="block font-bold">{step.title}</strong>
                  <span className="mt-1 block text-mute">{step.how}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {analysis.timeSaved ? (
        <p className="m-0">
          <span className="block font-mono text-label uppercase tracking-kicker text-mute">
            {content.timeSavedLabel}
          </span>
          <span className="mt-1 block text-header4-clamp font-medium">{analysis.timeSaved}</span>
        </p>
      ) : null}

      {services.length ? (
        <div>
          <h3 className="m-0 text-header4-clamp font-medium">{content.servicesHeading}</h3>
          <ul className="mt-4 mb-0 grid list-none gap-4 p-0 md:grid-cols-2">
            {services.map((service, index) => (
              <li key={index} className="flex flex-col border border-edge p-5">
                <strong className="font-bold">{service.name}</strong>
                {service.description ? <span className="mt-2 text-small text-mute">{service.description}</span> : null}
                {service.href ? (
                  <a href={service.href} className="mt-auto pt-4 font-bold text-amber underline">
                    {service.linkLabel || "→"}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {content.ctaLabel && content.ctaHref ? (
          <Button href={content.ctaHref} onClick={() => track("analyzer_cta")}>
            {content.ctaLabel}
          </Button>
        ) : null}
        {canSend && !sendOpen ? (
          <Button variant="outline" onClick={() => setSendOpen(true)}>
            {content.sendLabel}
          </Button>
        ) : null}
      </div>

      {canSend && sendOpen && form ? (
        <div className="flex flex-col gap-5 border-t border-edge pt-8">
          {content.sendText ? <p className="m-0 max-w-[36em]">{content.sendText}</p> : null}
          <ContactForm
            form={form}
            locale={locale}
            idPrefix="analyzer-send"
            prefill={{
              [messageField]: analysisAsText(
                description,
                analysis,
                services.map((service) => service.name),
              ),
            }}
          />
        </div>
      ) : null}

      {content.disclaimer ? <p className="m-0 text-caption text-mute">{content.disclaimer}</p> : null}
      <button
        type="button"
        onClick={onReset}
        className="self-start p-0 font-[inherit] text-small text-white underline"
      >
        {content.resetLabel}
      </button>
    </div>
  );
}
