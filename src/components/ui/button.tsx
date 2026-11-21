import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "outline" | "dark" | "text";

const BASE =
  "inline-flex min-h-13 items-center justify-center gap-3 text-center text-caption font-extrabold transition";

const VARIANTS: Record<Variant, string> = {
  primary:
    "rounded-xs border border-amber bg-amber px-5 text-pitch hover:-translate-y-0.5 hover:border-amber-bright hover:bg-amber-bright",
  outline: "rounded-xs border border-ink px-5 text-ink hover:border-amber hover:text-amber",
  dark: "rounded-xs border border-pitch bg-pitch px-5 text-ink hover:-translate-y-0.5",
  text: "px-2 text-ink hover:text-amber",
};

type ButtonProps = {
  variant?: Variant;
  /** Mono arrow after the label, e.g. "↗" or "↓". */
  arrow?: string;
} & (
  | ({ href: string } & ComponentPropsWithoutRef<"a">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

/** Square call-to-action. Renders a link when `href` is given, a button otherwise. */
export function Button({ variant = "primary", arrow, className = "", children, ...props }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  const body = (
    <>
      {children}
      {arrow ? (
        <span aria-hidden="true" className="font-mono text-body font-normal">
          {arrow}
        </span>
      ) : null}
    </>
  );
  if (props.href !== undefined) {
    return (
      <a className={classes} {...props}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {body}
    </button>
  );
}
