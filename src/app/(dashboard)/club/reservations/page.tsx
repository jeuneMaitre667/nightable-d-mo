// Component: ClubReservationsPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table pattern
// NightTable usage: consolidated reservation management for club managers

import { redirect } from "next/navigation";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClubReservationsPanel } from "./ClubReservationsPanel";

import type { ReactElement } from "react";

type ClubReservationsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type ReservationRow = {
  id: string;
  status: string;
  prepayment_amount: number;
  created_at: string;
  event_id: string;
  event_table_id: string;
  promoter_id: string | null;
  promo_code_used: string | null;
  contact_phone: string | null;
  client_first_name: string | null;
  client_last_name: string | null;
  client_id: string;
};

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
};

type EventTableRow = {
  id: string;
  table_id: string;
};

type TableRow = {
  id: string;
  name: string;
  zone: string | null;
};

type ProfileRow = {
  id: string;
  email: string | null;
};

type PanelReservation = {
  id: string;
  clientName: string;
  clientContact: string;
  dateTimeLabel: string;
  tableName: string;
  zoneLabel: string;
  amount: number;
  channelLabel: string;
  status: string;
  statusLabel: string;
  timing: "upcoming" | "ongoing" | "past" | "cancelled";
};

function toDateTimeLabel(dateValue: string, timeValue: string): string {
  const date = new Date(`${dateValue}T${timeValue}`);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusLabel(status: string): string {
  if (status === "confirmed" || status === "checked_in" || status === "reserved") {
    return "Confirmée";
  }

  if (status === "pending" || status === "payment_pending") {
    return "Acompte payé";
  }

  if (status === "cancelled" || status === "refunded") {
    return "Annulée";
  }

  if (status === "no_show") {
    return "No-show";
  }

  return "En attente";
}

function inferChannel(reservation: ReservationRow): string {
  if (reservation.promoter_id) {
    return "Instagram";
  }

  if (reservation.contact_phone) {
    return "Phoning";
  }

  if (reservation.promo_code_used) {
    return "Concierge";
  }

  return "En ligne";
}

function inferTiming(eventDate: string, eventTime: string, status: string): "upcoming" | "ongoing" | "past" | "cancelled" {
  if (status === "cancelled" || status === "refunded") {
    return "cancelled";
  }

  const eventStart = new Date(`${eventDate}T${eventTime}`);
  const now = new Date();
  const eventEnd = new Date(eventStart);
  eventEnd.setHours(eventEnd.getHours() + 6);

  if (eventStart > now) {
    return "upcoming";
  }

  if (now >= eventStart && now <= eventEnd) {
    return "ongoing";
  }

  return "past";
}

function displayName(firstName: string | null, lastName: string | null): string {
  const label = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return label || "Client NightTable";
}

export default async function ClubReservationsPage({ searchParams }: ClubReservationsPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (role !== "club" && role !== "admin") {
    redirect("/dashboard");
  }

  let clubId = user.id;
  if (role === "admin") {
    const { data: firstClub } = await supabase
      .from("club_profiles")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstClub?.id) {
      clubId = firstClub.id;
    }
  }

  const { data: clubEventsData, error: clubEventsError } = await supabase
    .from("events")
    .select("id,title,date,start_time")
    .eq("club_id", clubId)
    .order("date", { ascending: false })
    .limit(200);

  if (clubEventsError) {
    throw new Error("Impossible de charger les événements du club.");
  }

  const clubEvents = (clubEventsData ?? []) as EventRow[];
  const eventIds = clubEvents.map((eventItem) => eventItem.id);

  const reservationsResult = eventIds.length
    ? await supabase
        .from("reservations")
        .select(
          "id,status,prepayment_amount,created_at,event_id,event_table_id,promoter_id,promo_code_used,contact_phone,client_first_name,client_last_name,client_id"
        )
        .in("event_id", eventIds)
        .order("created_at", { ascending: false })
        .limit(120)
    : { data: [] as ReservationRow[], error: null };

  if (reservationsResult.error) {
    throw new Error("Impossible de charger les réservations du club.");
  }

  const reservations = (reservationsResult.data ?? []) as ReservationRow[];

  const eventTableIds = Array.from(new Set(reservations.map((item) => item.event_table_id)));
  const clientIds = Array.from(new Set(reservations.map((item) => item.client_id)));

  const [eventTablesResult, profilesResult] = await Promise.all([
    eventTableIds.length
      ? supabase.from("event_tables").select("id,table_id").in("id", eventTableIds)
      : Promise.resolve({ data: [] as EventTableRow[], error: null }),
    clientIds.length
      ? supabase.from("profiles").select("id,email").in("id", clientIds)
      : Promise.resolve({ data: [] as ProfileRow[], error: null }),
  ]);

  const eventTables = (eventTablesResult.data ?? []) as EventTableRow[];
  const profiles = (profilesResult.data ?? []) as ProfileRow[];

  const tableIds = Array.from(new Set(eventTables.map((item) => item.table_id)));
  const { data: tablesData } = tableIds.length
    ? await supabase.from("tables").select("id,name,zone").in("id", tableIds)
    : { data: [] as TableRow[] };

  const tables = (tablesData ?? []) as TableRow[];

  const eventById = new Map(clubEvents.map((eventItem) => [eventItem.id, eventItem]));
  const eventTableById = new Map(eventTables.map((eventTable) => [eventTable.id, eventTable]));
  const tableById = new Map(tables.map((tableItem) => [tableItem.id, tableItem]));
  const profileById = new Map(profiles.map((profileItem) => [profileItem.id, profileItem]));

  const panelRows: PanelReservation[] = reservations.map((reservation) => {
    const event = eventById.get(reservation.event_id);
    const eventTable = eventTableById.get(reservation.event_table_id);
    const table = eventTable ? tableById.get(eventTable.table_id) : undefined;
    const profileInfo = profileById.get(reservation.client_id);

    const eventDate = event?.date ?? new Date().toISOString().slice(0, 10);
    const eventTime = event?.start_time ?? "23:00:00";

    return {
      id: reservation.id,
      clientName: displayName(reservation.client_first_name, reservation.client_last_name),
      clientContact: profileInfo?.email ?? reservation.contact_phone ?? "client@nighttable.app",
      dateTimeLabel: toDateTimeLabel(eventDate, eventTime),
      tableName: table?.name ?? "Table N/A",
      zoneLabel: table?.zone ? `Zone ${table.zone}` : event?.title ?? "Salle principale",
      amount: Number(reservation.prepayment_amount ?? 0),
      channelLabel: inferChannel(reservation),
      status: reservation.status,
      statusLabel: statusLabel(reservation.status),
      timing: inferTiming(eventDate, eventTime, reservation.status),
    };
  });

  return <ClubReservationsPanel reservations={panelRows} initialQuery={initialQuery} />;
}
