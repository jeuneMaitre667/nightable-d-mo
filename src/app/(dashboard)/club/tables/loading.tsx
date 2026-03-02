// Component: ClubTablesLoading
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon loading state pattern
// NightTable usage: loading fallback for club tables dashboard

import { TablesSkeleton } from "./TablesSkeleton";

import type { ReactElement } from "react";

export default function ClubTablesLoading(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-9 w-60 animate-pulse rounded bg-[#2A2F4A]" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
          <div className="h-[520px] animate-pulse rounded bg-[#0A0F2E]" />
        </div>

        <TablesSkeleton rows={7} />
      </div>
    </div>
  );
}