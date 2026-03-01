"use client";

// Component: RefreshButton
// Reference: component.gallery/components/text-input
// Inspired by: Atlassian Design System pattern
// NightTable usage: refresh triggers on club dashboard screens

import { useRouter } from "next/navigation";

import type { ReactElement } from "react";

type RefreshButtonProps = {
  /** Optional utility classes for composition. */
  className?: string;
};

export default function RefreshButton({ className }: RefreshButtonProps): ReactElement {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`nt-btn nt-btn-secondary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] ${className ?? ""}`.trim()}
      onClick={() => router.refresh()}
      aria-label="Rafraîchir le dashboard"
    >
      Rafraîchir
    </button>
  );
}
