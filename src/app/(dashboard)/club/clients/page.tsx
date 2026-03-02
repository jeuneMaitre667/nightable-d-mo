// Component: ClubClientsPage
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon + Linear dense CRM pattern
// NightTable usage: club CRM page for clients and VIP segmentation

import { redirect } from "next/navigation";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ClubClientsPanel } from "./ClubClientsPanel";

import type { ReactElement } from "react";

type EventRow = {
  id: string;
  title: string;
  date: string;
};

type ReservationRow = {
  id: string;
  client_id: string;
  client_first_name: string | null;
  client_last_name: string | null;
  contact_phone: string | null;
  prepayment_amount: number;
  status: string;
  event_id: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string | null;
};

type ClientPanelRow = {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  contactLine: string;
  typeLabel: string;
  spendLabel: string;
  visitsLabel: string;
  lastVisitLabel: string;
  totalSpend: number;
  visitsCount: number;
  statusType: "vip" | "fidele" | "top" | "reactivate";
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function fullName(firstName: string | null, lastName: string | null): string {
  const label = `${firstName ?? ""} ${lastName ?? ""}`.trim();
  return label || "Client NightTable";
}

function classifyClient(totalSpend: number, visitsCount: number, daysSinceVisit: number): { typeLabel: string; statusType: "vip" | "fidele" | "top" | "reactivate" } {
  if (totalSpend >= 12000) {
    return { typeLabel: "VIP Carré Platine", statusType: "vip" };
  }

  if (daysSinceVisit > 90) {
    return { typeLabel: "À réactiver", statusType: "reactivate" };
  }

  if (visitsCount >= 8) {
    return { typeLabel: "Fidèle week-end", statusType: "fidele" };
  }

  return { typeLabel: "Top CA", statusType: "top" };
}

function daysBetween(fromDate: Date, toDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((toDate.getTime() - fromDate.getTime()) / msPerDay);
}

export default async function ClubClientsPage(): Promise<ReactElement> {
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

  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id,title,date")
    .eq("club_id", clubId)
    .order("date", { ascending: false })
    .limit(300);

  if (eventsError) {
    throw new Error("Impossible de charger les événements du club.");
  }

  const events = (eventsData ?? []) as EventRow[];
  const eventIds = events.map((eventItem) => eventItem.id);

  const reservationsResult = eventIds.length
    ? await supabase
        .from("reservations")
        .select("id,client_id,client_first_name,client_last_name,contact_phone,prepayment_amount,status,event_id,created_at")
        .in("event_id", eventIds)
        .not("client_id", "is", null)
        .neq("status", "cancelled")
        .neq("status", "refunded")
        .order("created_at", { ascending: false })
        .limit(1000)
    : { data: [] as ReservationRow[], error: null };

  if (reservationsResult.error) {
    throw new Error("Impossible de charger les clients du club.");
  }

  const reservations = (reservationsResult.data ?? []) as ReservationRow[];

  const clientIds = Array.from(new Set(reservations.map((reservation) => reservation.client_id)));
  const { data: profilesData } = clientIds.length
    ? await supabase.from("profiles").select("id,email").in("id", clientIds)
    : { data: [] as ProfileRow[] };

  const profiles = (profilesData ?? []) as ProfileRow[];
  const emailById = new Map(profiles.map((profileItem) => [profileItem.id, profileItem.email ?? "client@nighttable.app"]));

  const eventById = new Map(events.map((eventItem) => [eventItem.id, eventItem]));
  const groupedByClient = new Map<string, ReservationRow[]>();

  for (const reservation of reservations) {
    const list = groupedByClient.get(reservation.client_id) ?? [];
    list.push(reservation);
    groupedByClient.set(reservation.client_id, list);
  }

  const now = new Date();
  const monthStart = new Date(now);
  monthStart.setDate(monthStart.getDate() - 30);

  const clientsRows: ClientPanelRow[] = Array.from(groupedByClient.entries()).map(([clientId, clientReservations]) => {
    const sorted = [...clientReservations].sort((a, b) => b.created_at.localeCompare(a.created_at));
    const latest = sorted[0];
    const totalSpend = clientReservations.reduce((sum, reservation) => sum + Number(reservation.prepayment_amount ?? 0), 0);
    const visitsCount = clientReservations.length;

    const latestEvent = latest ? eventById.get(latest.event_id) : null;
    const lastVisitDate = latestEvent ? new Date(latestEvent.date) : new Date(latest.created_at);
    const daysSinceVisit = daysBetween(lastVisitDate, now);

    const { typeLabel, statusType } = classifyClient(totalSpend, visitsCount, daysSinceVisit);

    return {
      id: clientId,
      fullName: fullName(latest.client_first_name, latest.client_last_name),
      phone: latest.contact_phone,
      email: emailById.get(clientId) ?? null,
      contactLine: `${latest.contact_phone ?? ""} ${emailById.get(clientId) ?? "client@nighttable.app"}`.trim(),
      typeLabel,
      spendLabel: formatEuros(totalSpend),
      visitsLabel: `${visitsCount} visite${visitsCount > 1 ? "s" : ""}`,
      lastVisitLabel: lastVisitDate.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      totalSpend,
      visitsCount,
      statusType,
    };
  });

  clientsRows.sort((a, b) => b.totalSpend - a.totalSpend);

  const totalClients = clientsRows.length;
  const vipClients = clientsRows.filter((client) => client.statusType === "vip").length;
  const monthlyNewClients = new Set(
    reservations
      .filter((reservation) => new Date(reservation.created_at) >= monthStart)
      .map((reservation) => reservation.client_id)
  ).size;
  const averageValue = totalClients > 0
    ? clientsRows.reduce((sum, client) => sum + client.totalSpend, 0) / totalClients
    : 0;
  const topTenTotal = clientsRows.slice(0, 10).reduce((sum, client) => sum + client.totalSpend, 0);

  const segments = {
    vip: clientsRows.filter((client) => client.statusType === "vip").length,
    fidele: clientsRows.filter((client) => client.statusType === "fidele").length,
    reactivate: clientsRows.filter((client) => client.statusType === "reactivate").length,
  };

  return (
    <ClubClientsPanel
      clients={clientsRows}
      totalClients={totalClients}
      vipClients={vipClients}
      monthlyNewClients={monthlyNewClients}
      averageValueLabel={formatEuros(averageValue)}
      topTenValueLabel={formatEuros(topTenTotal)}
      segments={segments}
    />
  );
}
