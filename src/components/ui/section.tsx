import type { ReactNode } from "react";
import { Container } from "./container";

type SectionProps = {
  /** Fragment id the header menu links to. */
  anchor?: string;
  /** Classes for the full-width wrapper (backgrounds, borders). */
  className?: string;
  /** Classes for the inner column (grids). */
  innerClassName?: string;
  children: ReactNode;
};

/** Full-width section with the standard vertical rhythm and a centered column. */
export function Section({
  anchor,
  className = "",
  innerClassName = "",
  children,
}: SectionProps) {
  return (
    <section id={anchor || undefined} className={`scroll-mt-4 ${className}`}>
      <Container className={`py-16 md:py-26 ${innerClassName}`}>
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
      className={`m-0 text-header2-clamp font-medium tracking-[-0.03em] ${className}`}
    >
      {children}
    </h2>
  );
}
