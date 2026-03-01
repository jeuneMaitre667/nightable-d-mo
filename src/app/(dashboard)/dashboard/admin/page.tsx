// Component: AdminDashboardPage
// Reference: component.gallery/components/card
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: admin landing in dashboard namespace

import type { ReactElement } from "react";

export default function AdminDashboardPage(): ReactElement {
  return (
    <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Administration</p>
      <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Dashboard Admin</h1>
    </section>
  );
}
