"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FloorPlan from "@/components/floor-plan/FloorPlan";
import { calculateDynamicPrice } from "@/lib/utils";

import type { ReactElement } from "react";

type EventTable = {
  id: string;
  status: "available" | "reserved" | "occupied" | "disabled" | "sold_out";
  occupancy_rate: number;
  time_coefficient: number;
  occupancy_coefficient: number;
  notoriety_coefficient: number;
  dynamic_price: number | null;
  table: {
    id: string;
    name: string;
    zone: string | null;
    capacity: number;
    base_price: number;
    x_position: number | null;
    y_position: number | null;
    is_promo: boolean;
  };
};

type EventBookingClientProps = {
  eventId: string;
  eventDate: string;
  eventNotoriety: number;
  tables: EventTable[];
};

type FloorPlanStatus = "available" | "reserved" | "occupied" | "selected" | "promo" | "disabled" | "sold_out";

type FloorPlanTableRow = {
  id: string;
  name: string;
  capacity: number;
  base_price: number;
  zone: string | null;
  position_x: number | null;
  position_y: number | null;
  status: FloorPlanStatus;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function daysUntilEvent(dateValue: string): number {
  const now = new Date();
  const eventDate = new Date(dateValue);
  const diff = eventDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function EventBookingClient({
  eventId,
  eventDate,
  eventNotoriety,
  tables,
}: EventBookingClientProps): ReactElement {
  const [selectedEventTableId, setSelectedEventTableId] = useState<string | undefined>(undefined);

  const selectedEventTable = useMemo(
    () => tables.find((item) => item.id === selectedEventTableId),
    [selectedEventTableId, tables]
  );

  const availableCount = tables.filter((item) => item.status === "available").length;
  const urgency = selectedEventTable?.occupancy_rate && selectedEventTable.occupancy_rate > 70;

  const selectedPrice = selectedEventTable
    ? calculateDynamicPrice({
        basePrice: selectedEventTable.table.base_price,
        occupancyRate: selectedEventTable.occupancy_rate / 100,
        daysUntilEvent: daysUntilEvent(eventDate),
        eventNotoriety,
      })
    : null;

  const floorPlanTables: FloorPlanTableRow[] = tables.map((item) => ({
    id: item.id,
    name: item.table.name,
    capacity: item.table.capacity,
    base_price: item.table.base_price,
    zone: item.table.zone,
    position_x: item.table.x_position,
    position_y: item.table.y_position,
    status: (item.table.is_promo && item.status === "available" ? "promo" : item.status) as FloorPlanStatus,
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <article className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="nt-heading text-2xl text-[#F7F6F3]">Choisir votre table</h2>
          <span className="text-sm text-[#888888]">
            <span className="text-[#E8C96A]">{availableCount}</span> disponibles
          </span>
        </div>
        <FloorPlan
          tables={floorPlanTables}
          mode="booking"
          selectedTableId={selectedEventTableId}
          onTableSelect={setSelectedEventTableId}
        />
      </article>

      <aside className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
        <h3 className="nt-heading text-2xl text-[#F7F6F3]">Votre sélection</h3>

        {!selectedEventTable ? (
          <p className="mt-4 text-sm text-[#888888]">
            Sélectionnez une table disponible sur le plan pour voir le détail et réserver.
          </p>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-[#F7F6F3]">
            <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
              <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Table</p>
              <p className="mt-1 text-lg font-semibold">{selectedEventTable.table.name}</p>
              <p className="mt-1 text-xs text-[#888888]">
                Zone {selectedEventTable.table.zone ?? "vip"} · Capacité {selectedEventTable.table.capacity}
              </p>
            </div>

            <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
              <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Prix dynamique</p>
              <p className="mt-1 font-[Cormorant_Garamond] text-4xl leading-none text-[#C9973A]">
                {selectedPrice ? formatEuros(selectedPrice) : "—"}
              </p>
              {urgency ? (
                <p className="mt-2 text-xs text-[#C4567A]">● Plus que {availableCount} tables à ce prix</p>
              ) : null}
            </div>

            <Link
              href={`/reserve/checkout?eventId=${encodeURIComponent(eventId)}&tableId=${encodeURIComponent(selectedEventTable.id)}`}
              className="nt-btn nt-btn-primary block w-full px-4 py-3 text-center"
            >
              Réserver cette table
            </Link>
          </div>
        )}
      </aside>
    </section>
  );
}
