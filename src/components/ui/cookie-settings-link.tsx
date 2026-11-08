"use client";

declare global {
  interface Window {
    Cookiebot?: { renew: () => void };
  }
}

/** Reopens the Cookiebot banner so a visitor can change or withdraw consent. */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.Cookiebot?.renew()} className={className}>
      {label}
    </button>
  );
}
