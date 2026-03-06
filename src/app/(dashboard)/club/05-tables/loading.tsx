import type { ReactElement } from "react";

export default function ClubTablesLoading(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#C9973A]/20 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_100%)] p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-8 w-44 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-[#2A2F4A]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`tables-kpi-loading-${index}`} className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
            <div className="h-3 w-28 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-4 h-9 w-16 animate-pulse rounded bg-[#2A2F4A]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-xl border border-white/5 bg-[#1A1D24] p-4">
          <div className="h-[520px] animate-pulse rounded bg-[#0A0F2E]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-[#2A2F4A]" />
          ))}
        </div>
      </div>
    </div>
  );
}
