// Component: CheckoutPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: server page for selected table checkout context

import { notFound } from "next/navigation";
import CheckoutClient from "./checkoutClient";
import { createClient } from "@/lib/supabase/server";

import type { ReactElement } from "react";

type CheckoutPageProps = {
  searchParams: Promise<{
    eventId?: string;
    tableId?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps): Promise<ReactElement> {
  const { eventId, tableId } = await searchParams;

  if (!eventId || !tableId) {
    notFound();
  }

  const supabase = await createClient();
  const { data: selectedTable, error } = await supabase
    .from("event_tables")
    .select(
      `
        id,
        status,
        dynamic_price,
        occupancy_rate,
        event:events (
          id,
          title,
          date,
          start_time
        ),
        table:tables (
          id,
          name,
          capacity,
          zone,
          base_price
        )
      `
    )
    .eq("id", tableId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error || !selectedTable || selectedTable.status !== "available") {
    notFound();
  }

  const event = Array.isArray(selectedTable.event) ? selectedTable.event[0] : selectedTable.event;
  const table = Array.isArray(selectedTable.table) ? selectedTable.table[0] : selectedTable.table;

  if (!event || !table) {
    notFound();
  }

  const baseAmount = selectedTable.dynamic_price ?? table.base_price;
  const prepaymentAmount = Math.round(baseAmount * 0.4);
  const eventDate = `${event.date}T${event.start_time}`;

  return (
    <main className="min-h-screen bg-[#0A0F2E] px-4 py-8 md:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_320px]">
        <CheckoutClient
          event={{
            id: event.id,
            name: event.title,
            eventDate,
          }}
          table={{
            eventTableId: selectedTable.id,
            name: table.name,
            capacity: table.capacity,
            zone: table.zone,
            dynamicPrice: baseAmount,
            occupancyRate: selectedTable.occupancy_rate,
          }}
          prepaymentAmount={prepaymentAmount}
        />
      </div>
    </main>
  );
}
