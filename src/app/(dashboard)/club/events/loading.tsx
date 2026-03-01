// Component: ClubEventsLoading
// Reference: component.gallery/components/progress-bar
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: loading skeleton for club events list

import type { ReactElement } from "react";

export default function ClubEventsLoading(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        <div className="h-4 w-28 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-9 w-56 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-[#2A2F4A]" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`events-loading-${index}`} className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-6">
            <div className="h-8 w-44 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-3 h-4 w-52 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-4 h-7 w-full animate-pulse rounded bg-[#0A0F2E]" />
            <div className="mt-4 h-16 w-full animate-pulse rounded bg-[#0A0F2E]" />
          </div>
        ))}
      </div>
    </div>
  );
}
