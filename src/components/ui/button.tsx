import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "outline";

const BASE =
  "inline-flex min-h-14 items-center justify-center rounded-full px-7 text-center font-bold";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-amber text-ink hover:opacity-90",
  outline: "border border-white text-white hover:opacity-80",
};

type ButtonProps = { variant?: Variant } & (
  | ({ href: string } & ComponentPropsWithoutRef<"a">)
  | ({ href?: undefined } & ComponentPropsWithoutRef<"button">)
);

/** Pill call-to-action. Renders a link when `href` is given, a button otherwise. */
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (props.href !== undefined) {
    return <a className={classes} {...props} />;
  }
  return <button type="button" className={classes} {...props} />;
}
