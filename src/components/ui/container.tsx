import type { ComponentPropsWithoutRef } from "react";

/** Centered content column with the site's horizontal gutters. */
export function Container({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`mx-auto max-w-content px-5 md:px-8 ${className}`} {...props} />
  );
}
