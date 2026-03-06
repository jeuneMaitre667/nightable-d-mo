// Component: ReservePage
// Reference: component.gallery/components/select
// Inspired by: Shopify Polaris pattern
// NightTable usage: public reservation configurator before checkout

"use client";

import { createClient } from "@/lib/supabase/server";
import { Select } from "@/components/ui/Select";

import type { ReactElement } from "react";

type ReservePageProps = {
  searchParams: Promise<{
    promo?: string;
    club?: string;
    event?: string;
    table?: string;
    guests?: string;
  }>;
};

const clubs = [
  { slug: "l-arc-paris", label: "L'Arc Paris" },
  { slug: "raspoutine", label: "Raspoutine" },
  { slug: "bridge-club", label: "Bridge Club" },
  { slug: "manko", label: "Manko" },
];

const events = [
  { id: "fashion-week-afterparty", label: "Fashion Week Afterparty", min: 1500 },
  { id: "midnight-society", label: "Midnight Society", min: 900 },
  { id: "noir-signature", label: "Noir Signature", min: 650 },
  { id: "velvet-closing", label: "Velvet Closing", min: 1100 },
];

const tables = [
  { id: "standard-4", label: "Table Standard (4 pers)", multiplier: 1 },
  { id: "vip-6", label: "Table VIP (6 pers)", multiplier: 1.35 },
  { id: "loge-8", label: "Loge Premium (8 pers)", multiplier: 1.8 },
];

import { useState, useEffect } from "react";

function getById<T extends { id: string }>(items: T[], id: string, fallback: T) {
  return items.find((item) => item.id === id) ?? fallback;
}

export default function ReservePage({ searchParams }: ReservePageProps): ReactElement {
  const [selectedClub, setSelectedClub] = useState(clubs[0].slug);
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);
  const [selectedTableId, setSelectedTableId] = useState(tables[0].id);
  const [guestsCount, setGuestsCount] = useState(4);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const params = await searchParams;
      setPromoCode(params.promo?.trim() || null);
      setSelectedClub(params.club ?? clubs[0].slug);
      setSelectedEventId(params.event ?? events[0].id);
      setSelectedTableId(params.table ?? tables[0].id);
      setGuestsCount(Math.max(1, Number(params.guests ?? "4") || 4));
    })();
  }, [searchParams]);

  const event = getById(events, selectedEventId, events[0]);
  const table = getById(tables, selectedTableId, tables[0]);

  const minimum = Math.round(event.min * table.multiplier);
  const prepaid = Math.round(minimum * 0.4);
  const insurance = 5;
  const totalNow = prepaid + insurance;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0a0f2e] to-[#050508] px-4 py-10 text-[#f7f6f3] md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="nt-section p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Réservation</p>
          <h1 className="nt-heading mt-3 text-3xl font-semibold md:text-5xl">Réserver une table VIP</h1>
          <p className="mt-4 max-w-3xl text-[#c9c9c9]">
            Sélectionne ton club, ta soirée et ton format de table. Le récapitulatif met à jour le minimum conso et le
            prépaiement estimé.
          </p>
          <p className="mt-4 rounded-md border border-[#c9973a]/30 bg-[#0a0f2e] px-3 py-2 text-sm text-[#f7f6f3]">
            Code promoteur détecté: <span className="font-semibold">{promoCode ?? "aucun"}</span>
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="nt-card p-6">
            <h2 className="text-xl font-semibold">Configurer ma réservation</h2>

            <form className="mt-5 grid gap-4" method="GET" action="/reserve">
              {promoCode ? <input type="hidden" name="promo" value={promoCode} /> : null}

              <div>
                <label htmlFor="club" className="nt-label mb-1 block">Club</label>
                <Select
                  value={selectedClub}
                  onValueChange={(val) => setSelectedClub(val)}
                  options={clubs.map((club) => ({ label: club.label, value: club.slug }))}
                  placeholder="Choisir un club"
                  name="club"
                  className="nt-input"
                />
              </div>

              <div>
                <label htmlFor="event" className="nt-label mb-1 block">Soirée</label>
                <Select
                  value={selectedEventId}
                  onValueChange={(val) => setSelectedEventId(val)}
                  options={events.map((item) => ({ label: item.label, value: item.id }))}
                  placeholder="Choisir une soirée"
                  name="event"
                  className="nt-input"
                />
              </div>

              <div>
                <label htmlFor="table" className="nt-label mb-1 block">Format table</label>
                <Select
                  value={selectedTableId}
                  onValueChange={(val) => setSelectedTableId(val)}
                  options={tables.map((item) => ({ label: item.label, value: item.id }))}
                  placeholder="Choisir un format"
                  name="table"
                  className="nt-input"
                />
              </div>

              <div>
                <label htmlFor="guests" className="nt-label mb-1 block">Nombre de personnes</label>
                  <input
                    id="guests"
                    name="guests"
                    type="number"
                    min={1}
                    value={guestsCount}
                    onChange={e => setGuestsCount(Number(e.target.value))}
                    className="nt-input"
                  />
              </div>

              <button
                type="submit"
                className="nt-btn nt-btn-primary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
              >
                Mettre à jour le récapitulatif
              </button>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="nt-card p-5">
              <h3 className="text-lg font-semibold">Récapitulatif estimé</h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#c9c9c9]"><span>Événement</span><span>{event.label}</span></div>
                <div className="flex justify-between text-[#c9c9c9]"><span>Table</span><span>{table.label}</span></div>
                <div className="flex justify-between text-[#c9c9c9]"><span>Participants</span><span>{guestsCount}</span></div>
                <div className="flex justify-between text-[#c9c9c9]"><span>Minimum conso</span><span className="nt-price text-2xl leading-none">{minimum}€</span></div>
                <div className="flex justify-between text-[#c9c9c9]"><span>Prépaiement (40%)</span><span>{prepaid}€</span></div>
                <div className="flex justify-between text-[#c9c9c9]"><span>Assurance no-show</span><span>{insurance}€</span></div>
              </div>

              <div className="mt-4 rounded-lg border border-[#3a9c6b]/40 bg-[#3a9c6b]/15 px-3 py-2 text-[#82d6aa]">
                Total à payer maintenant: <span className="font-semibold">{totalNow}€</span>
              </div>
            </section>

            <section className="nt-card p-5">
              <h3 className="text-lg font-semibold">Prochaine étape</h3>
              <p className="mt-2 text-sm text-[#c9c9c9]">
                Le paiement final Stripe et la création serveur de la réservation seront branchés sur cette sélection.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a
                  href="/register"
                  className="nt-btn nt-btn-primary min-h-11 px-3 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                >
                  Continuer (inscription)
                </a>
                <a
                  href="/login"
                  className="nt-btn nt-btn-secondary min-h-11 px-3 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                >
                  J&apos;ai déjà un compte
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
