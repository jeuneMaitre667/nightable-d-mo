// Component: PublicEventPage
// Reference: component.gallery/components/card
// Inspired by: IBM Carbon Design System pattern
// NightTable usage: public event detail and table booking entry

import { notFound } from "next/navigation";
import EventBookingClient from "./eventBookingClient";
import { createClient } from "@/lib/supabase/server";

import type { ReactElement } from "react";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
    eventId: string;
  }>;
};

type EventTableQueryRow = {
  id: string;
  status: "available" | "reserved" | "occupied" | "disabled" | "sold_out";
  occupancy_rate: number;
  time_coefficient: number;
  occupancy_coefficient: number;
  notoriety_coefficient: number;
  dynamic_price: number | null;
  table:
    | {
        id: string;
        name: string;
        zone: string | null;
        capacity: number;
        base_price: number;
        x_position: number | null;
        y_position: number | null;
        is_promo: boolean;
      }
    | {
        id: string;
        name: string;
        zone: string | null;
        capacity: number;
        base_price: number;
        x_position: number | null;
        y_position: number | null;
        is_promo: boolean;
      }[];
};

type EventTableItem = {
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

export default async function PublicEventPage({ params }: PageProps): Promise<ReactElement> {
  const { slug, eventId } = await params;
  const supabase = await createClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id, title, description, date, start_time, status, club_id, dj_lineup, dress_code")
    .eq("id", eventId)
    .eq("status", "published")
    .maybeSingle();

  if (eventError || !eventData) {
    notFound();
  }

  const { data: clubData } = await supabase
    .from("club_profiles")
    .select("id, club_name, slug")
    .eq("id", eventData.club_id)
    .maybeSingle();

  if (clubData?.slug && clubData.slug !== slug) {
    notFound();
  }

  const { data: tablesData, error: tablesError } = await supabase
    .from("event_tables")
    .select(
      `
        id,
        status,
        occupancy_rate,
        time_coefficient,
        occupancy_coefficient,
        notoriety_coefficient,
        dynamic_price,
        table:tables (
          id,
          name,
          zone,
          capacity,
          base_price,
          x_position,
          y_position,
          is_promo
        )
      `
    )
    .eq("event_id", eventData.id)
    .order("created_at", { ascending: true });

  if (tablesError || !tablesData) {
    notFound();
  }

  const normalizedTables: EventTableItem[] = (tablesData as EventTableQueryRow[])
    .map((row) => {
      const tableItem = Array.isArray(row.table) ? row.table[0] : row.table;

      if (!tableItem) {
        return null;
      }

      return {
        id: row.id,
        status: row.status,
        occupancy_rate: row.occupancy_rate,
        time_coefficient: row.time_coefficient,
        occupancy_coefficient: row.occupancy_coefficient,
        notoriety_coefficient: row.notoriety_coefficient,
        dynamic_price: row.dynamic_price,
        table: tableItem,
      };
    })
    .filter((row): row is EventTableItem => row !== null)
;

  const eventDate = `${eventData.date}T${eventData.start_time}`;
  const eventDateLabel = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(eventDate));

  const eventNotoriety = 1;

  return (
    <main className="min-h-screen bg-[#050508] pb-28 md:pb-8">
      <EventBookingClient
        eventId={eventData.id}
        eventTitle={eventData.title}
        clubName={clubData?.club_name ?? slug}
        eventDate={eventDate}
        eventDateLabel={eventDateLabel}
        eventCoverUrl={null}
        eventDescription={eventData.description}
        eventDjLineup={eventData.dj_lineup ?? []}
        eventDressCode={eventData.dress_code}
        eventNotoriety={eventNotoriety}
        tables={normalizedTables}
      />
    </main>
  );
}
