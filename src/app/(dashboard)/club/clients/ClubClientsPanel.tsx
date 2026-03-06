"use client";

// Component: ClubClientsPanel
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table + Shopify dashboard cards
// NightTable usage: clients and VIP CRM segmentation view for club dashboard

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ClientStatusType = "fidele" | "top" | "reactivate" | "vip";

type ClientRow = {
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
  statusType: ClientStatusType;
};

type ClubClientsPanelProps = {
  clients: ClientRow[];
  totalClients: number;
  vipClients?: number;
  monthlyNewClients: number;
  averageValueLabel: string;
  topTenValueLabel: string;
  segments: {
    fidele: number;
    reactivate: number;
  };
};

function statusBadgeClass(statusType: ClientStatusType): string {
  if (statusType === "vip") {
    return "border border-[#7C3AED]/35 bg-[#7C3AED]/14 text-[#C4B5FD]";
  }
  if (statusType === "fidele") {
    return "border border-[#3A9C6B]/35 bg-[#3A9C6B]/14 text-[#8DDBB6]";
  }
  if (statusType === "reactivate") {
    return "border border-[#C4567A]/35 bg-[#C4567A]/14 text-[#F2C7D5]";
  }
  return "border border-[#C9973A]/35 bg-[#C9973A]/14 text-[#F3DFB4]";
}

function initialOf(name: string): string {
  return name.trim().slice(0, 1).toUpperCase() || "C";
}

function phoneHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, "");
  return `tel:${normalized}`;
}

export function ClubClientsPanel({
  clients,
  totalClients,
  vipClients: _vipClients,
  monthlyNewClients,
  averageValueLabel,
  topTenValueLabel,
  segments,
}: ClubClientsPanelProps): React.JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [scope, setScope] = useState<"all" | "top" | "reactivate">("all");
  const filtersRef = useRef<HTMLElement | null>(null);

  function focusSearchInput(): void {
    const element = document.getElementById("clients-search-input");
    if (element instanceof HTMLInputElement) {
      element.focus();
    }
  }

  const filteredClients = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesScope =
        scope === "all"
          ? true
          : scope === "top"
            ? client.statusType === "top"
            : client.statusType === "reactivate";
      if (!matchesScope) {
        return false;
      }
      if (!normalized) {
        return true;
      }
      return (
        client.fullName.toLowerCase().includes(normalized) ||
        client.contactLine.toLowerCase().includes(normalized) ||
        client.typeLabel.toLowerCase().includes(normalized)
      );
    });
  }, [clients, scope, search]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-lg font-semibold tracking-tight text-[#F7F6F3] md:text-xl">Clients</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-11 px-4 text-sm font-semibold">
            Exporter
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <article className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-6">
          <h2 className="text-[30px] font-semibold leading-none text-[#F7F6F3]">Vue d&apos;ensemble clients</h2>
          <p className="mt-1 text-sm text-[#888888]">Performance de votre base clients ce mois-ci</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-[#888888]">Clients totaux</p>
              <p className="mt-2 text-4xl font-semibold text-[#F7F6F3]">{totalClients}</p>
              <p className="mt-1 text-sm text-[#3A9C6B]">+{monthlyNewClients} nouveaux ce mois</p>
            </div>
            {/* Bloc Clients VIP supprimé */}
            <div>
              <p className="text-sm text-[#888888]">Valeur vie client moyenne</p>
              <p className="mt-2 text-4xl font-semibold text-[#F7F6F3]">{averageValueLabel}</p>
              <p className="mt-1 text-sm text-[#3A9C6B]">Top 10 &gt; {topTenValueLabel}</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-6">
          <h2 className="text-[30px] font-semibold leading-none text-[#F7F6F3]">Segments clés</h2>
          <p className="mt-1 text-sm text-[#888888]">Groupes de clients les plus importants</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#F7F6F3]"><span className="mr-2 text-[#3A9C6B]">●</span>Fidèles Week-end</p>
                <p className="text-sm text-[#888888]">Viennent régulièrement</p>
              </div>
              <p className="text-sm font-semibold text-[#F7F6F3]">{segments.fidele} clients</p>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#F7F6F3]"><span className="mr-2 text-[#C4567A]">●</span>À réactiver</p>
                <p className="text-sm text-[#888888]">Pas venus depuis &gt; 90 jours</p>
              </div>
              <p className="text-sm font-semibold text-[#F7F6F3]">{segments.reactivate} clients</p>
            </div>
          </div>
        </article>
      </section>

      <section id="clients-filters" ref={filtersRef} className="rounded-xl border border-[#C9973A]/15 bg-[#12172B]">
        <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#F7F6F3]">Liste des clients</h2>
            <p className="mt-1 text-sm text-[#888888]">Historique et valeur des meilleurs clients</p>
          </div>

          <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[560px] xl:flex-row xl:items-center">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="clients-search-input"
              placeholder="Rechercher un nom, téléphone, email..."
              className="xl:min-w-[320px] min-h-11 bg-[#0A0F2E] border border-[#2A2F4A] text-[#F7F6F3]"
            />
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <Tabs value={scope} onChange={v => setScope(v as "all" | "top" | "reactivate")}
                className="bg-transparent p-0 gap-2 flex">
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="top">Top CA</TabsTrigger>
                  <TabsTrigger value="reactivate">À relancer</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl text-[#C9973A]/35">◉</p>
            <h3 className="mt-3 text-lg font-semibold text-[#F7F6F3]">Aucun client trouvé</h3>
            <p className="mt-1 text-sm text-[#888888]">Ajustez vos filtres pour afficher des résultats.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                className="min-h-11 bg-[#C9973A] px-4 text-sm font-semibold text-[#050508]"
                onClick={() => {
                  setSearch("");
                  setScope("all");
                  focusSearchInput();
                }}
              >
                Réinitialiser les filtres
              </Button>
              <Button asChild variant="secondary" className="min-h-11 border-[#2A2F4A] px-4 text-sm text-[#F7F6F3]">
                <Link href="/dashboard/club/reservations">Voir les réservations</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-left">
                <thead className="bg-[#090D16] text-[11px] uppercase tracking-widest text-[#888888]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Client</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Dépenses totales</th>
                    <th className="px-6 py-4 font-medium">Visites</th>
                    <th className="px-6 py-4 font-medium">Dernière venue</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="border-t border-white/5 bg-[#0D1320] transition-colors duration-150 hover:bg-[#C9973A]/8">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2F4A] bg-[#12172B] text-sm font-semibold text-[#F7F6F3]">
                            {initialOf(client.fullName)}
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-[#F7F6F3]">{client.fullName}</p>
                            <p className="text-sm text-[#6E7488]">{client.contactLine || "Contact non renseigné"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(client.statusType)}`}>
                          {client.typeLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xl font-semibold text-[#F7F6F3]">{client.spendLabel}</td>
                      <td className="px-6 py-4 text-base text-[#9AA2B3]">{client.visitsLabel}</td>
                      <td className="px-6 py-4 text-base text-[#9AA2B3]">{client.lastVisitLabel}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="secondary" className="min-h-11 border-[#C9973A]/40 px-3 text-xs font-semibold text-[#F3DFB4]">
                            <Link href={`/dashboard/club/reservations?q=${encodeURIComponent(client.fullName)}`}>◉ Voir fiche</Link>
                          </Button>
                          {client.phone ? (
                            <Button asChild variant="secondary" className="min-h-11 border-[#3A6BC9]/35 px-3 text-xs font-semibold text-[#C9DAF8]">
                              <Link href={phoneHref(client.phone)}>☎ Appeler</Link>
                            </Button>
                          ) : null}
                          {client.email ? (
                            <Button asChild variant="secondary" className="min-h-11 border-[#3A9C6B]/35 px-3 text-xs font-semibold text-[#8DDBB6]">
                              <Link href={`mailto:${client.email}`}>✉ Email</Link>
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 p-4 md:hidden">
              {filteredClients.map((client) => (
                <article key={`mobile-${client.id}`} className="rounded-xl border border-white/5 bg-[#12172B] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2F4A] bg-[#0A0F2E] text-sm font-semibold text-[#F7F6F3]">
                        {initialOf(client.fullName)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F7F6F3]">{client.fullName}</p>
                        <p className="text-xs text-[#888888]">{client.contactLine || "Contact non renseigné"}</p>
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${statusBadgeClass(client.statusType)}`}>
                      {client.typeLabel}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Dépenses</span>
                      <span className="font-semibold text-[#F7F6F3]">{client.spendLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Visites</span>
                      <span className="text-[#F7F6F3]">{client.visitsLabel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#888888]">Dernière venue</span>
                      <span className="text-[#F7F6F3]">{client.lastVisitLabel}</span>
                    </div>
                    <Button asChild variant="secondary" className="mt-2 min-h-11 w-full border-[#C9973A]/40 text-xs font-semibold text-[#F3DFB4]">
                      <Link href={`/dashboard/club/reservations?q=${encodeURIComponent(client.fullName)}`}>◉ Voir fiche client</Link>
                    </Button>
                    {client.phone ? (
                      <Button asChild variant="secondary" className="min-h-11 w-full border-[#3A6BC9]/35 text-xs font-semibold text-[#C9DAF8]">
                        <Link href={phoneHref(client.phone)}>☎ Appeler</Link>
                      </Button>
                    ) : null}
                    {client.email ? (
                      <Button asChild variant="secondary" className="min-h-11 w-full border-[#3A9C6B]/35 text-xs font-semibold text-[#8DDBB6]">
                        <Link href={`mailto:${client.email}`}>✉ Envoyer un email</Link>
                      </Button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </section>
  );
}
