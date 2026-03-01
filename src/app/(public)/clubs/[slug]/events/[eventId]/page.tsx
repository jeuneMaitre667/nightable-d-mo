import { notFound } from "next/navigation";
import EventBookingClient from "./eventBookingClient";
import { createClient } from "@/lib/supabase/server";

import type { ReactElement } from "react";

type PageProps = {
  params: Promise<{
    slug: string;
    eventId: string;
  }>;
};

export default async function PublicEventPage({ params }: PageProps): Promise<ReactElement> {
  const { slug, eventId } = await params;
  const supabase = await createClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id, title, date, start_time, status, club_id")
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

  const eventDate = `${eventData.date}T${eventData.start_time}`;
  const eventDateLabel = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(eventDate));

  const eventNotoriety = 1;

  return (
    <main className="min-h-screen bg-[#0A0F2E] px-4 py-8 md:px-6 lg:px-10">
      <section className="mx-auto mb-6 max-w-7xl rounded-xl border border-[#C9973A]/20 bg-gradient-to-r from-[#0A0F2E] via-[#12172B] to-[#0A0F2E] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9973A]">NightTable · {clubData?.club_name ?? slug}</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3] md:text-4xl">{eventData.title}</h1>
        <p className="mt-2 text-sm text-[#888888]">{eventDateLabel}</p>
      </section>

      <div className="mx-auto max-w-7xl">
        <EventBookingClient
          eventId={eventData.id}
          eventDate={eventDate}
          eventNotoriety={eventNotoriety}
          tables={tablesData}
        />
      </div>
    </main>
  );
}
