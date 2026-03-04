"use client";

// Component: EventBookingClient
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: public interactive table selection for one event

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar, Button, Chip } from "@heroui/react";
import { calculateDynamicPrice } from "@/lib/utils";

import type { ReactElement } from "react";

const FloorPlan = dynamic(() => import("@/components/floor-plan/FloorPlan"), {
  ssr: false,
});

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
  /** Event identifier used for checkout routing. */
  eventId: string;
  /** Event title displayed in hero and detail section. */
  eventTitle: string;
  /** Club name displayed in event context labels. */
  clubName: string;
  /** Event datetime used for dynamic pricing urgency. */
  eventDate: string;
  /** Localized event date label displayed under title. */
  eventDateLabel: string;
  /** Event cover image URL for the hero section. */
  eventCoverUrl: string | null;
  /** Event description shown in editorial section. */
  eventDescription: string | null;
  /** Event DJ lineup labels from event payload. */
  eventDjLineup: string[];
  /** Optional event dress code label. */
  eventDressCode: string | null;
  /** Notoriety coefficient used by pricing formula. */
  eventNotoriety: number;
  /** Event tables enriched with status and pricing metadata. */
  tables: EventTable[];
  /** Optional utility classes for wrapper composition. */
  className?: string;
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
  eventTitle,
  clubName,
  eventDate,
  eventDateLabel,
  eventCoverUrl,
  eventDescription,
  eventDjLineup,
  eventDressCode,
  eventNotoriety,
  tables,
  className,
}: EventBookingClientProps): ReactElement {
  const [selectedEventTableId, setSelectedEventTableId] = useState<string | undefined>(undefined);

  const selectedEventTable = useMemo(
    () => tables.find((item) => item.id === selectedEventTableId),
    [selectedEventTableId, tables]
  );

  const availableCount = tables.filter((item) => item.status === "available").length;
  const urgency = selectedEventTable?.occupancy_rate && selectedEventTable.occupancy_rate > 70;
  const minimumPrice = useMemo(() => {
    const availableTables = tables.filter((item) => item.status === "available");

    if (availableTables.length === 0) {
      return null;
    }

    const pricedTables = availableTables.map((item) =>
      calculateDynamicPrice({
        basePrice: item.table.base_price,
        occupancyRate: item.occupancy_rate / 100,
        daysUntilEvent: daysUntilEvent(eventDate),
        eventNotoriety,
      })
    );

    return Math.min(...pricedTables);
  }, [eventDate, eventNotoriety, tables]);

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

  const todayLabel = new Date().toDateString() === new Date(eventDate).toDateString() ? "Ce soir" : eventDateLabel;
  const djs = eventDjLineup.length > 0 ? eventDjLineup : ["DJ lineup à venir"];
  const coverUrl = eventCoverUrl && eventCoverUrl.trim().length > 0
    ? eventCoverUrl
    : "https://images.unsplash.com/photo-1571266028243-d220c9c3f14f?auto=format&fit=crop&w=1600&q=80";
  const mobileActionHref = selectedEventTable
    ? `/reserve/checkout?eventId=${encodeURIComponent(eventId)}&tableId=${encodeURIComponent(selectedEventTable.id)}`
    : "#table-selection";

  return (
    <section className={`bg-[#050508] ${className ?? ""}`.trim()}>
      <div className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={coverUrl}
          alt={`Photo de l'événement ${eventTitle} au ${clubName}`}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/5 via-[#050508]/42 to-[#050508]" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto flex w-full max-w-7xl items-end justify-between gap-4 px-6 pb-6 md:px-6 md:pb-7 lg:px-10">
          <div className="max-w-[80%] md:max-w-[72%]">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9973A]">NightTable · {clubName}</p>
            <h1 className="mt-2 font-[Cormorant_Garamond] text-[36px] font-light leading-[1.02] text-[#F7F6F3] drop-shadow-[0_8px_24px_rgba(5,5,8,0.65)] md:mt-3 md:text-5xl">{eventTitle}</h1>
          </div>
          <Chip color="success" variant="flat" className="mb-1 inline-flex shrink-0 self-end">
            {todayLabel}
          </Chip>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-5 md:px-6 md:py-6 lg:px-10">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[65%_35%]">
          <article>
            <h2 className="font-[Cormorant_Garamond] text-[34px] font-light leading-[1.05] text-[#F7F6F3] md:text-[48px]">
              {eventTitle}
            </h2>
            <p className="mt-2 text-sm text-[#888888]">{eventDateLabel} · {availableCount} tables disponibles</p>

            <div className="mt-5 flex flex-wrap gap-3 md:mt-6 md:gap-4">
              {djs.map((djName, index) => (
                <div key={`${djName}-${index}`} className="flex min-h-[48px] items-center gap-3 rounded-lg border border-white/5 bg-[#12172B]/70 px-3 py-2">
                  <Avatar name={djName} size="md" classNames={{ base: "h-12 w-12 bg-[#0A0F2E] text-[#C9973A]" }} />
                  <div>
                    <p className="text-[13px] font-semibold text-[#F7F6F3]">{djName}</p>
                    <p className="text-[11px] text-[#888888]">Guest DJ</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#888888] md:mt-6">
              {eventDescription?.trim() || "Une nuit exclusive entre house, élégance parisienne et service premium NightTable."}
            </p>

            <div className="mt-5 md:mt-6">
              <Chip color="default" variant="bordered">
                Dress code : {eventDressCode?.trim() || "Tenue élégante"}
              </Chip>
            </div>
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div id="table-selection" className="rounded-xl border border-white/5 bg-[#1A1D24] p-5 md:p-6">
              <h3 className="text-base font-semibold text-[#F7F6F3]">Choisissez votre table</h3>

              <div className="mt-4">
                <p className="text-[13px] text-[#888888]">À partir de</p>
                <p className="font-[Cormorant_Garamond] text-[32px] leading-none text-[#C9973A]">
                  {minimumPrice ? formatEuros(minimumPrice) : "—"}
                </p>
              </div>

              <div className="mt-5">
                <FloorPlan
                  tables={floorPlanTables}
                  mode="booking"
                  selectedTableId={selectedEventTableId}
                  onTableSelect={setSelectedEventTableId}
                  className="max-h-[360px] overflow-hidden md:max-h-[420px]"
                />
              </div>

              {!selectedEventTable ? (
                <p className="mt-4 text-sm text-[#888888]">
                  Sélectionnez une table disponible sur le plan pour continuer.
                </p>
              ) : (
                <div className="mt-4 rounded-lg border border-[#C9973A]/25 bg-[#0A0F2E] p-4">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-[#888888]">Table sélectionnée</p>
                  <p className="mt-2 text-lg font-semibold text-[#F7F6F3]">{selectedEventTable.table.name}</p>
                  <p className="mt-1 text-xs text-[#888888]">Capacité {selectedEventTable.table.capacity}</p>
                  <p className="mt-2 font-[Cormorant_Garamond] text-3xl leading-none text-[#C9973A]">
                    {selectedPrice ? formatEuros(selectedPrice) : "—"}
                  </p>
                  {urgency ? (
                    <p className="mt-2 text-xs text-[#C4567A]">● Plus que {availableCount} tables à ce prix</p>
                  ) : null}
                </div>
              )}

              <div className="mt-5">
                {selectedEventTable ? (
                  <Button
                    as={Link}
                    href={`/reserve/checkout?eventId=${encodeURIComponent(eventId)}&tableId=${encodeURIComponent(selectedEventTable.id)}`}
                    color="primary"
                    radius="none"
                    fullWidth
                    className="h-12 min-h-[48px] font-semibold"
                  >
                    Réserver cette table →
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    radius="none"
                    fullWidth
                    className="h-12 min-h-[48px]"
                    isDisabled
                  >
                    Réserver cette table →
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#C9973A]/20 bg-[#050508]/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-[#888888]">À partir de</p>
            <p className="font-[Cormorant_Garamond] text-2xl leading-none text-[#C9973A]">
              {minimumPrice ? formatEuros(minimumPrice) : "—"}
            </p>
          </div>
          <Button
            as={Link}
            href={mobileActionHref}
            color="primary"
            radius="none"
            className="h-12 min-h-[48px] min-w-[168px] px-6 font-semibold"
          >
            Choisir ma table
          </Button>
        </div>
      </div>
    </section>
  );
}
