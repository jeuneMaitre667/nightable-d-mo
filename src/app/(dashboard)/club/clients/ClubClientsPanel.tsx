"use client";

// Component: ClubClientsPanel
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table + Shopify dashboard cards
// NightTable usage: clients and VIP CRM segmentation view for club dashboard

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button, Input, Tab, Tabs } from "@heroui/react";

type ClientStatusType = "vip" | "fidele" | "top" | "reactivate";

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
  vipClients: number;
  monthlyNewClients: number;
  averageValueLabel: string;
  topTenValueLabel: string;
  segments: {
    vip: number;
    fidele: number;
    reactivate: number;
  };
};

function statusBadgeClass(statusType: ClientStatusType): string {
  if (statusType === "vip") {
    return "border border-[#7D5DF6]/35 bg-[#7D5DF6]/14 text-[#CFC3FF]";
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
  vipClients,
  monthlyNewClients,
  averageValueLabel,
  topTenValueLabel,
  segments,
}: ClubClientsPanelProps): React.JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [scope, setScope] = useState<"all" | "vip" | "top" | "reactivate">("all");
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
          : scope === "vip"
            ? client.statusType === "vip"
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
        <h1 className="text-lg font-semibold tracking-tight text-[#F7F6F3] md:text-xl">Clients & VIPs</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="bordered"
            className="min-h-11 border-[#2A2F4A] px-4 text-sm text-[#F7F6F3]"
            onPress={() => {
              filtersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              setTimeout(() => {
                focusSearchInput();
              }, 120);
            }}
          >
            ⚙ Filtres avancés
          </Button>
          <Button
            as={Link}
            href="/dashboard/club/reservations"
            className="min-h-11 bg-[#7D5DF6] px-4 text-sm font-semibold text-white"
          >
            + Ajouter un contact
          </Button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <article className="rounded-xl border border-white/5 bg-[#0B0F18] p-6">
          <h2 className="text-[30px] font-semibold leading-none text-[#F7F6F3]">Vue d&apos;ensemble clients</h2>
          <p className="mt-1 text-sm text-[#888888]">Performance de votre base clients ce mois-ci</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-[#888888]">Clients totaux</p>
              <p className="mt-2 text-4xl font-semibold text-[#F7F6F3]">{totalClients}</p>
              <p className="mt-1 text-sm text-[#3A9C6B]">+{monthlyNewClients} nouveaux ce mois</p>
            </div>
            <div>
              <p className="text-sm text-[#888888]">Clients VIP</p>
              <p className="mt-2 text-4xl font-semibold text-[#F7F6F3]">{vipClients}</p>
              <p className="mt-1 text-sm text-[#3A9C6B]">
                {totalClients > 0 ? Math.round((vipClients / totalClients) * 100) : 0}% de la base
              </p>
            </div>
            <div>
              <p className="text-sm text-[#888888]">Valeur vie client moyenne</p>
              <p className="mt-2 text-4xl font-semibold text-[#F7F6F3]">{averageValueLabel}</p>
              <p className="mt-1 text-sm text-[#3A9C6B]">Top 10 &gt; {topTenValueLabel}</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-white/5 bg-[#0B0F18] p-6">
          <h2 className="text-[30px] font-semibold leading-none text-[#F7F6F3]">Segments clés</h2>
          <p className="mt-1 text-sm text-[#888888]">Groupes de clients les plus importants</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#F7F6F3]"><span className="mr-2 text-[#7D5DF6]">●</span>VIP Carré Platine</p>
                <p className="text-sm text-[#888888]">Panier moyen &gt; 1500 €</p>
              </div>
              <p className="text-sm font-semibold text-[#F7F6F3]">{segments.vip} clients</p>
            </div>
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

      <section id="clients-filters" ref={filtersRef} className="rounded-xl border border-white/5 bg-[#0B0F18]">
        <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#F7F6F3]">Liste des clients</h2>
            <p className="mt-1 text-sm text-[#888888]">Historique et valeur des meilleurs clients et VIPs</p>
          </div>

          <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[560px] xl:flex-row xl:items-center">
            <Input
              value={search}
              onValueChange={setSearch}
              id="clients-search-input"
              placeholder="Rechercher un nom, téléphone, email..."
              variant="bordered"
              color="primary"
              className="xl:min-w-[320px]"
              classNames={{
                inputWrapper: "min-h-11 bg-[#0A0F2E] border border-[#2A2F4A]",
                input: "text-[#F7F6F3]",
              }}
            />
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <Tabs
                selectedKey={scope}
                onSelectionChange={(key) => setScope(String(key) as "all" | "vip" | "top" | "reactivate")}
                variant="solid"
                classNames={{
                  tabList: "bg-transparent p-0 gap-2",
                  tab: "min-h-9 rounded-full border border-transparent px-4 text-sm text-[#888888] data-[selected=true]:bg-[#7D5DF6] data-[selected=true]:text-white",
                }}
              >
                <Tab key="all" title="Tous" />
                <Tab key="vip" title="VIP" />
                <Tab key="top" title="Top CA" />
                <Tab key="reactivate" title="À relancer" />
              </Tabs>
            </div>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-5xl text-[#7D5DF6]/35">◉</p>
            <h3 className="mt-3 text-lg font-semibold text-[#F7F6F3]">Aucun client trouvé</h3>
            <p className="mt-1 text-sm text-[#888888]">Ajustez vos filtres pour afficher des résultats.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                className="min-h-11 bg-[#7D5DF6] px-4 text-sm font-semibold text-white"
                onPress={() => {
                  setSearch("");
                  setScope("all");
                  focusSearchInput();
                }}
              >
                Réinitialiser les filtres
              </Button>
              <Button
                as={Link}
                href="/dashboard/club/reservations"
                variant="bordered"
                className="min-h-11 border-[#2A2F4A] px-4 text-sm text-[#F7F6F3]"
              >
                Voir les réservations
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
                    <tr key={client.id} className="border-t border-white/5 bg-[#0D1320] transition-colors duration-150 hover:bg-[#7D5DF6]/8">
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
                          <Button
                            as={Link}
                            href={`/dashboard/club/reservations?q=${encodeURIComponent(client.fullName)}`}
                            variant="bordered"
                            className="min-h-11 border-[#7D5DF6]/40 px-3 text-xs font-semibold text-[#CFC3FF]"
                          >
                            ◉ Voir fiche
                          </Button>
                          {client.phone ? (
                            <Button
                              as={Link}
                              href={phoneHref(client.phone)}
                              variant="bordered"
                              className="min-h-11 border-[#3A6BC9]/35 px-3 text-xs font-semibold text-[#C9DAF8]"
                            >
                              ☎ Appeler
                            </Button>
                          ) : null}
                          {client.email ? (
                            <Button
                              as={Link}
                              href={`mailto:${client.email}`}
                              variant="bordered"
                              className="min-h-11 border-[#3A9C6B]/35 px-3 text-xs font-semibold text-[#8DDBB6]"
                            >
                              ✉ Email
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
                    <Button
                      as={Link}
                      href={`/dashboard/club/reservations?q=${encodeURIComponent(client.fullName)}`}
                      variant="bordered"
                      className="mt-2 min-h-11 w-full border-[#7D5DF6]/40 text-xs font-semibold text-[#CFC3FF]"
                    >
                      ◉ Voir fiche client
                    </Button>
                    {client.phone ? (
                      <Button
                        as={Link}
                        href={phoneHref(client.phone)}
                        variant="bordered"
                        className="min-h-11 w-full border-[#3A6BC9]/35 text-xs font-semibold text-[#C9DAF8]"
                      >
                        ☎ Appeler
                      </Button>
                    ) : null}
                    {client.email ? (
                      <Button
                        as={Link}
                        href={`mailto:${client.email}`}
                        variant="bordered"
                        className="min-h-11 w-full border-[#3A9C6B]/35 text-xs font-semibold text-[#8DDBB6]"
                      >
                        ✉ Envoyer un email
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
