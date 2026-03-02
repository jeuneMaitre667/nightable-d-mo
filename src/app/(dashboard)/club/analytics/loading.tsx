// Component: ClubAnalyticsLoading
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon loading pattern
// NightTable usage: loading state for analytics period dashboard

import type { ReactElement } from "react";

export default function ClubAnalyticsLoading(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <div className="h-6 w-40 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-[#2A2F4A]" />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`metric-skeleton-${index}`} className="rounded-[8px] border border-[#C9973A]/8 bg-[#12172B] p-4">
            <div className="h-3 w-36 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-3 h-9 w-44 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-3 h-5 w-16 animate-pulse rounded bg-[#2A2F4A]" />
          </div>
        ))}
      </section>

      <div className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-3">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-[#2A2F4A]" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`table1-skeleton-${index}`} className="mb-2 h-10 w-full animate-pulse rounded bg-[#2A2F4A]" />
        ))}
      </div>

      <div className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-3">
        <div className="mb-3 h-5 w-44 animate-pulse rounded bg-[#2A2F4A]" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`table2-skeleton-${index}`} className="mb-2 h-10 w-full animate-pulse rounded bg-[#2A2F4A]" />
        ))}
      </div>
    </div>
  );
}
