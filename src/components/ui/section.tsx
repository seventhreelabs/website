import type { ReactNode } from "react";
import { Container } from "./container";

type SectionProps = {
  /** Fragment id the header menu links to. */
  anchor?: string;
  /** Classes for the full-width wrapper (backgrounds, borders). */
  className?: string;
  /** Classes for the inner column (grids). */
  innerClassName?: string;
  /** Inverted, light palette (`.tone-light` in globals.css). */
  light?: boolean;
  children: ReactNode;
};

/** Full-width section with the standard vertical rhythm and a centered column. */
export function Section({
  anchor,
  className = "",
  innerClassName = "",
  light = false,
  children,
}: SectionProps) {
  return (
    <section id={anchor || undefined} className={`scroll-mt-4 ${light ? "tone-light" : ""} ${className}`}>
      <Container className={`py-18 md:py-25 ${innerClassName}`}>
        {children}
      </Container>
    </section>
  );
}

export function SectionHeading({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={`m-0 text-header2-clamp font-semibold tracking-heading text-balance ${className}`}
    >
      {children}
    </h2>
  );
}

/** Small mono line above a heading, e.g. "01 / Co usprawniamy". */
export function Kicker({
  className = "text-amber",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p className={`m-0 font-mono text-micro tracking-kicker uppercase ${className}`}>
      {children}
    </p>
  );
}

type SectionHeadProps = {
  kicker?: string;
  heading: ReactNode;
  text?: string;
  /** Stacked: text under the heading instead of the right column. */
  stacked?: boolean;
  className?: string;
};

/** Kicker + heading on the left, intro text bottom-aligned on the right (stacked on phones). */
export function SectionHead({
  kicker,
  heading,
  text,
  stacked = false,
  className = "mb-10",
}: SectionHeadProps) {
  return (
    <div
      className={`grid gap-5 ${stacked ? "" : "md:grid-cols-2 md:items-end md:gap-10"} ${className}`}
    >
      <div className="min-w-0">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <SectionHeading className={kicker ? "mt-3.5" : ""}>{heading}</SectionHeading>
      </div>
      {text ? (
        <p className={`m-0 max-w-[28em] text-medium-clamp text-mute ${stacked ? "mt-1" : "md:mb-1"}`}>
          {text}
        </p>
      ) : null}
    </div>
  );
}
