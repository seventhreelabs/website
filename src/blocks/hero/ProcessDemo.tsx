"use client";

import { useEffect, useState } from "react";

export type ProcessFlow = {
  label: string;
  steps?: { text: string; actor?: string }[];
};

export function ProcessDemo({
  flows,
  note,
}: {
  flows: ProcessFlow[];
  note?: string;
}) {
  const [picked, setPicked] = useState(0);
  const [active, setActive] = useState(0);
  const flow = flows[picked] ?? flows[0];
  const steps = flow?.steps ?? [];
  const count = steps.length;

  useEffect(() => {
    if (
      count < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = setInterval(
      () => setActive((current) => (current + 1) % count),
      1800,
    );
    return () => clearInterval(timer);
  }, [count]);

  if (!flow) return null;

  return (
    <div className="min-w-0 rounded-xl border border-edge bg-panel p-4 sm:p-6">
      <div
        role="group"
        aria-label="Przykładowy proces"
        className="flex flex-wrap gap-2"
      >
        {flows.map((item, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === picked}
            onClick={() => {
              setPicked(index);
              setActive(0);
            }}
            className={`min-h-11 rounded-full border border-white px-4 text-[0.9375rem] font-bold ${
              index === picked ? "bg-white text-panel" : "text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ol className="mt-5 flex list-none flex-col gap-1 p-0">
        {steps.map((step, index) => {
          const actor = step.actor ?? "Agent";

          return (
            <li
              key={index}
              className={`flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 rounded-lg px-3 py-3 sm:px-4 ${
                index === active ? "bg-[#2a2e35]" : ""
              } ${actor === "Człowiek" ? "text-amber" : "text-white"}`}
            >
              <span className="min-w-0 flex-[1_1_13rem] font-medium leading-snug">
                {step.text}
              </span>
              <span className="font-mono text-sm">{actor}</span>
            </li>
          );
        })}
      </ol>
      {note ? <p className="mt-4 mb-0 text-[0.9375rem] text-mute">{note}</p> : null}
    </div>
  );
}
