"use client";

// Component: ClubHomePanels
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon dashboard data table pattern
// NightTable usage: club home soirée panels with HeroUI

import {
  Avatar,
  Select,
  SelectItem,
  Progress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type MetricItem = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  isPositive: boolean;
};

type ReservationItem = {
  id: string;
  clientName: string;
  clientEmail: string;
  dateTimeLabel: string;
  tableZoneLabel: string;
  amountLabel: string;
  status: string;
};

type RevenuePoint = {
  label: string;
  value: number;
};

type SpaceRow = {
  name: string;
  percent: number;
};

type ClubHomePanelsProps = {
  dashboardDateLabel: string;
  metrics: MetricItem[];
  revenueSeries: RevenuePoint[];
  spaceRows: SpaceRow[];
  reservations: ReservationItem[];
  promotersCount: number;
};

function statusConfig(status: string): { label: string; color: "success" | "warning" | "danger" | "default" } {
  if (status === "confirmed") return { label: "Confirmée", color: "success" };
  if (status === "pending" || status === "payment_pending") return { label: "Acompte payé", color: "warning" };
  if (status === "cancelled") return { label: "Annulée", color: "default" };
  return { label: "En attente", color: "warning" };
}

export default function ClubHomePanels({
  dashboardDateLabel,
  metrics,
  revenueSeries,
  spaceRows,
  reservations,
  promotersCount,
}: ClubHomePanelsProps): React.JSX.Element {
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#1A1D24] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#555555]">Dashboard club</p>
          <h1 className="text-[20px] font-semibold text-[#F7F6F3]">Tableau de bord</h1>
          <p className="text-[13px] text-[#888888]">{dashboardDateLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/dashboard/club/events"
            className="inline-flex min-h-10 items-center rounded-md border border-white/10 bg-transparent px-4 py-2 text-[13px] font-medium text-[#F7F6F3] transition-all duration-150 hover:bg-white/5"
          >
            Réservations
          </a>
          <a
            href="/dashboard/club/events/new"
            className="inline-flex min-h-10 items-center rounded-md bg-[#C9973A] px-4 py-2 text-[13px] font-medium text-[#050508] transition-all duration-150 hover:brightness-110"
          >
            Nouvel événement
          </a>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
            <p className="mb-1 text-[12px] text-[#888888]">{metric.label}</p>
            <p className="text-[28px] font-semibold text-[#F7F6F3]">{metric.value}</p>
            <p className={`mt-1 text-[12px] ${metric.isPositive ? "text-[#3A9C6B]" : "text-[#C4567A]"}`}>
              {metric.deltaLabel}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#F7F6F3]">Évolution des revenus</h2>
              <p className="text-[12px] text-[#888888]">Revenus hebdomadaires</p>
            </div>
            <Select
              size="sm"
              variant="bordered"
              selectedKeys={["hebdo"]}
              className="w-[150px]"
              classNames={{
                trigger: "border-white/10 bg-[#111318]",
                value: "text-[#F7F6F3] text-[12px]",
              }}
              aria-label="Période revenus"
            >
              <SelectItem key="hebdo">Hebdomadaire</SelectItem>
            </Select>
          </div>
          <div className="h-[220px] min-w-0 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
              <BarChart data={revenueSeries} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="#555555" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis stroke="#555555" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{
                    background: "#111318",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#F7F6F3",
                  }}
                />
                <Bar dataKey="value" fill="#C9973A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
          <h2 className="text-[14px] font-bold text-[#F7F6F3]">Espaces les plus prisés</h2>
          <p className="mb-4 text-[12px] text-[#888888]">Répartition des réservations par zone</p>
          <div className="space-y-3">
            {spaceRows.map((space) => (
              <div key={space.name}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-[#F7F6F3]">{space.name}</span>
                  <span className="text-[#888888]">{space.percent}%</span>
                </div>
                <Progress
                  value={space.percent}
                  color="primary"
                  size="sm"
                  aria-label={`Taux de réservation ${space.name}`}
                  classNames={{
                    track: "bg-white/5",
                    indicator: "bg-[#C9973A]",
                  }}
                />
              </div>
            ))}
            <p className="pt-2 text-[12px] text-[#888888]">{promotersCount} promoteur(s) actif(s) ce soir</p>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#F7F6F3]">Réservations récentes</h2>
          <a href="/dashboard/club/events" className="text-[13px] text-[#C9973A] hover:underline">
            Voir tout
          </a>
        </div>
        <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Réservations récentes"
            classNames={{
              th: "bg-transparent text-left text-[11px] uppercase tracking-widest text-[#555555] border-b border-white/5 pb-3",
              td: "border-b border-white/5 py-4 text-[#F7F6F3]",
              tr: "hover:bg-white/5",
            }}
          >
            <TableHeader>
              <TableColumn>CLIENT</TableColumn>
              <TableColumn>DATE &amp; HEURE</TableColumn>
              <TableColumn>TABLE / ZONE</TableColumn>
              <TableColumn>MONTANT</TableColumn>
              <TableColumn>STATUT</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Aucune réservation récente."}>
              {reservations.map((reservation) => {
                const status = statusConfig(reservation.status);
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" name={reservation.clientName} className="bg-[#C9973A]/15 text-[#C9973A]" />
                        <div>
                          <p className="text-[14px] font-bold text-[#F7F6F3]">{reservation.clientName}</p>
                          <p className="text-[11px] text-[#888888]">{reservation.clientEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#888888]">{reservation.dateTimeLabel}</TableCell>
                    <TableCell className="text-[13px] text-[#F7F6F3]">{reservation.tableZoneLabel}</TableCell>
                    <TableCell className="text-[14px] font-medium text-[#F7F6F3]">{reservation.amountLabel}</TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color={status.color}>
                        <span className="text-[10px] uppercase tracking-[0.04em]">{status.label}</span>
                      </Chip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}