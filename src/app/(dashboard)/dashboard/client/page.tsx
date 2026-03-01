// Component: ClientDashboardPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: client landing in dashboard namespace

import type { ReactElement } from "react";

export default function ClientDashboardPage(): ReactElement {
  return (
    <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Client</p>
      <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Dashboard Client</h1>
    </section>
  );
}
