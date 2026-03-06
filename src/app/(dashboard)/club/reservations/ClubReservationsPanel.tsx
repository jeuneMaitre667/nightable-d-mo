"use client";

// Component: ClubReservationsPanel
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon + Atlassian data management patterns
// NightTable usage: club reservation operations list with quick filtering

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// lightweight local chip component used only on this page
function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${className}`}>{children}</span>
  );
}

type ReservationTiming = "upcoming" | "ongoing" | "past" | "cancelled";

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
  timing: ReservationTiming;
};

type ClubReservationsPanelProps = {
  reservations: PanelReservation[];
  initialQuery?: string;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusChipClass(status: string): string {
  if (status === "confirmed" || status === "checked_in" || status === "reserved") {
    return "border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-[#3A9C6B]";
  }

  if (status === "pending" || status === "payment_pending") {
    return "border border-[#C9973A]/30 bg-[#C9973A]/15 text-[#C9973A]";
  }

  if (status === "cancelled" || status === "refunded") {
    return "border border-[#888888]/30 bg-[#888888]/15 text-[#888888]";
  }

  return "border border-[#C4567A]/30 bg-[#C4567A]/15 text-[#C4567A]";
}

function channelChipClass(channel: string): string {
  if (channel === "Instagram") {
    return "border border-[#C4567A]/30 bg-[#C4567A]/12 text-[#f2c7d5]";
  }

  if (channel === "Phoning") {
    return "border border-[#3A6BC9]/35 bg-[#3A6BC9]/12 text-[#c9daf8]";
  }

  if (channel === "Concierge") {
    return "border border-[#C9973A]/35 bg-[#C9973A]/12 text-[#f3dfb4]";
  }

  return "border border-[#888888]/30 bg-[#888888]/12 text-[#d7d7d7]";
}

export function ClubReservationsPanel({ reservations, initialQuery = "" }: ClubReservationsPanelProps): React.JSX.Element {
  const [query, setQuery] = useState<string>(initialQuery);
  const [timing, setTiming] = useState<"all" | ReservationTiming>("all");

  const filteredReservations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reservations.filter((reservation) => {
      if (timing !== "all" && reservation.timing !== timing) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        reservation.clientName.toLowerCase().includes(normalizedQuery) ||
        reservation.tableName.toLowerCase().includes(normalizedQuery) ||
        reservation.zoneLabel.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, reservations, timing]);

  const totalAmount = filteredReservations.reduce((sum, reservation) => sum + reservation.amount, 0);

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-[#F7F6F3] md:text-xl">Réservations</h1>
        <Button asChild variant="primary" className="h-11 px-6 text-sm font-semibold md:ml-auto">
          <Link href="/dashboard/club/events/new">＋ Nouvelle réservation</Link>
        </Button>
      </header>

      <section className="space-y-4 rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4 md:p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un client, une table..."
              className="min-w-[280px] flex-1 bg-[#0A0F2E] border border-[#2A2F4A] text-[#F7F6F3]"
            />
            <span className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-[#0A0F2E]/45 px-3 text-sm text-[#A0A0A5]">
              ☰ Statut: Tous
            </span>
            <span className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-[#0A0F2E]/45 px-3 text-sm text-[#A0A0A5]">
              ◉ Zone: Toute la salle
            </span>
            <span className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-[#0A0F2E]/45 px-3 text-sm text-[#A0A0A5]">
              ◷ Service: Nuit entière
            </span>
          </div>
          <Button
            type="button"
            className="min-h-11 px-3 text-sm font-semibold text-[#F7F6F3] bg-[#0A0F2E] hover:bg-[#1A2235]"
            onClick={() => {
              setQuery("");
              setTiming("all");
            }}
          >
            ↺ Réinitialiser
          </Button>
        </div>

        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <Tabs value={timing} onChange={(v) => setTiming(v as "all" | ReservationTiming)}>
            <TabsList className="gap-5">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="upcoming">À venir</TabsTrigger>
              <TabsTrigger value="ongoing">En cours</TabsTrigger>
              <TabsTrigger value="past">Passées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <section className="rounded-xl border border-[#C9973A]/15 bg-[#0F1424]">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-4 md:px-5">
            <div>
              <h2 className="text-lg font-semibold text-[#F7F6F3]">Liste des réservations</h2>
              <p className="mt-1 text-sm text-[#888888]">
                Vue consolidée des réservations en ligne, WhatsApp et phoning.
              </p>
            </div>
            <span className="inline-flex min-h-11 items-center rounded-xl border border-white/10 bg-[#0A0F2E]/45 px-3 text-sm font-medium text-[#F7F6F3]">
              ▥ Colonnes
            </span>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
              <h3 className="text-lg font-semibold text-[#F7F6F3]">Aucune réservation trouvée</h3>
              <p className="mt-2 text-sm text-[#888888]">Ajuste les filtres pour afficher les réservations.</p>
              <p className="mt-3 text-sm text-[#C9973A]">CA actuel: {formatEuros(totalAmount)}</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left">
                  <thead className="text-[11px] uppercase tracking-widest text-[#888888]">
                    <tr className="border-b border-white/5 bg-[#0A0F2E]/65">
                      <th className="px-5 py-3 font-medium">Client</th>
                      <th className="px-5 py-3 font-medium">Date & heure</th>
                      <th className="px-5 py-3 font-medium">Table / zone</th>
                      <th className="px-5 py-3 font-medium">Montant</th>
                      <th className="px-5 py-3 font-medium">Canal</th>
                      <th className="px-5 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="border-b border-[#C9973A]/10 bg-[#101726] transition-colors duration-150 hover:bg-[#C9973A]/5">
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-[#F7F6F3]">{reservation.clientName}</p>
                          <p className="text-xs text-[#888888]">{reservation.clientContact}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#F7F6F3]">{reservation.dateTimeLabel}</td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-[#F7F6F3]">{reservation.tableName}</p>
                          <p className="text-xs text-[#888888]">{reservation.zoneLabel}</p>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-[#F7F6F3]">{formatEuros(reservation.amount)}</td>
                        <td className="px-5 py-4">
                          <Chip size="sm" radius="full" variant="flat" className={channelChipClass(reservation.channelLabel)}>
                            <span className="text-[11px] font-medium">{reservation.channelLabel}</span>
                          </Chip>
                        </td>
                        <td className="px-5 py-4">
                          <Chip size="sm" radius="full" variant="flat" className={statusChipClass(reservation.status)}>
                            <span className="text-[11px] font-semibold uppercase tracking-wider">{reservation.statusLabel}</span>
                          </Chip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 p-3 md:hidden">
                {filteredReservations.map((reservation) => (
                  <article key={`mobile-${reservation.id}`} className="rounded-xl border border-[#C9973A]/10 bg-[#12172B] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[#F7F6F3]">{reservation.clientName}</p>
                        <p className="text-xs text-[#888888]">{reservation.clientContact}</p>
                      </div>
                      <Chip size="sm" radius="full" variant="flat" className={statusChipClass(reservation.status)}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider">{reservation.statusLabel}</span>
                      </Chip>
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#888888]">Date</span>
                        <span className="text-[#F7F6F3]">{reservation.dateTimeLabel}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#888888]">Table</span>
                        <span className="text-[#F7F6F3]">{reservation.tableName}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#888888]">Montant</span>
                        <span className="font-semibold text-[#F7F6F3]">{formatEuros(reservation.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#888888]">Canal</span>
                        <Chip size="sm" radius="full" variant="flat" className={channelChipClass(reservation.channelLabel)}>
                          <span className="text-[11px] font-medium">{reservation.channelLabel}</span>
                        </Chip>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </section>
    </section>
  );
}
