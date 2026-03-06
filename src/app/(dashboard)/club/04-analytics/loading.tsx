import type { ReactElement } from "react";

export default function ClubAnalyticsLoading(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_100%)] p-4 md:p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-8 w-44 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[#2A2F4A]" />
      </div>
      <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`metric-skeleton-${index}`} className="rounded-xl border border-white/5 bg-[#1A1D24] p-4">
            <div className="h-3 w-36 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-3 h-9 w-44 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-3 h-5 w-16 animate-pulse rounded bg-[#2A2F4A]" />
          </div>
        ))}
      </section>
      <div className="rounded-xl border border-white/5 bg-[#1A1D24] p-4">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-[#2A2F4A]" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`table1-skeleton-${index}`} className="mb-2 h-10 w-full animate-pulse rounded bg-[#2A2F4A]" />
        ))}
      </div>
      <div className="rounded-xl border border-white/5 bg-[#1A1D24] p-4">
        <div className="mb-3 h-5 w-44 animate-pulse rounded bg-[#2A2F4A]" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`table2-skeleton-${index}`} className="mb-2 h-10 w-full animate-pulse rounded bg-[#2A2F4A]" />
        ))}
      </div>
    </div>
  );
}
