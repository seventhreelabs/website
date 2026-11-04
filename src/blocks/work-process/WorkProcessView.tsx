"use client";

import { useState } from "react";
import { ui } from "@/utils/ui-strings";
import type { WorkProcessContent } from "./WorkProcess";

type Phase = NonNullable<WorkProcessContent["phases"]>[number];

export function WorkProcessView({
  phases,
  resultLabel,
  locale,
}: {
  phases: Phase[];
  resultLabel?: string;
  locale?: string;
}) {
  const t = ui(locale);
  const [picked, setPicked] = useState(0);
  const phase = phases[picked] ?? phases[0];
  if (!phase) return null;

  return (
    <>
      <div
        role="group"
        aria-label={t.workflowSteps}
        className="grid grid-cols-2 gap-2 lg:grid-cols-4"
      >
        {phases.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === picked}
            onClick={() => setPicked(index)}
            className={`min-w-0 rounded-xl border border-ink p-4 text-left md:p-6 ${
              index === picked ? "bg-ink text-white" : ""
            }`}
          >
            <span className="block text-[2.5rem] leading-none font-medium">
              {index + 1}
            </span>
            <span className="mt-3 block text-small leading-snug font-bold md:mt-4 md:text-body">
              {item.title}
            </span>
          </button>
        ))}
      </div>
      <div
        aria-live="polite"
        className="mt-2 grid gap-6 rounded-xl border border-line bg-white p-6 md:p-10 lg:grid-cols-[2fr_1fr] lg:gap-16"
      >
        <div className="min-w-0">
          <h3 className="m-0 text-header3-clamp font-medium tracking-[-0.015em]">
            {phase.title}
          </h3>
          <p className="mt-3 mb-0 max-w-[34em]">{phase.text}</p>
        </div>
        {phase.result ? (
          <div className="min-w-0">
            <h4 className="m-0 text-small font-bold">{resultLabel}</h4>
            <p className="mt-2 mb-0">{phase.result}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
