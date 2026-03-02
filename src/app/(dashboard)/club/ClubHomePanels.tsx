"use client";

// Component: ClubHomePanels
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon dashboard data table pattern
// NightTable usage: club home soirée panels with HeroUI

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

import RefreshButton from "./refreshButton";

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
  tableName: string;
  hourLabel: string;
  guests: number;
  status: string;
};

type PromoterItem = {
  id: string;
  name: string;
  guests: number;
  revenueLabel: string;
  linkActive: boolean;
};

type ClubHomePanelsProps = {
  dashboardDateLabel: string;
  metrics: MetricItem[];
  reservations: ReservationItem[];
  promoters: PromoterItem[];
};

function statusConfig(status: string): { label: string; color: "success" | "warning" | "danger" | "default" } {
  if (status === "confirmed") return { label: "confirmed", color: "success" };
  if (status === "pending" || status === "payment_pending") return { label: "pending", color: "warning" };
  if (status === "no_show") return { label: "no_show", color: "danger" };
  return { label: status.replaceAll("_", " "), color: "default" };
}

export default function ClubHomePanels({
  dashboardDateLabel,
  metrics,
  reservations,
  promoters,
}: ClubHomePanelsProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-[18px] font-semibold leading-[1.4] text-[#F7F6F3]">Tableau de bord</h1>
          <span className="text-[13px] text-[#888888]">· {dashboardDateLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            as="a"
            href="/dashboard/club/events"
            variant="bordered"
            size="sm"
            radius="none"
            className="min-h-11 border-[#C9973A]/20 text-[#C9973A]"
          >
            Événements
          </Button>
          <RefreshButton />
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="rounded-xl border border-[#C9973A]/10 bg-[#0A0F2E] shadow-none">
            <CardBody>
              <div className="flex items-start justify-between gap-2">
                <p className="mb-1 text-[11px] uppercase tracking-widest text-[#888888]">{metric.label}</p>
                <Chip
                  size="sm"
                  variant="flat"
                  color={metric.isPositive ? "success" : "danger"}
                  className="text-[10px]"
                >
                  {metric.deltaLabel}
                </Chip>
              </div>
              <p className="mt-2 font-[Cormorant_Garamond] text-[36px] font-normal leading-none text-[#C9973A]">{metric.value}</p>
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="rounded-[8px] border border-[#C9973A]/8 bg-[#12172B] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-[#F7F6F3]">Réservations du soir</h2>
        </div>
        <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Réservations du soir"
            classNames={{
              th: "bg-[#0A0F2E] text-left text-[11px] uppercase tracking-[0.04em] text-[#888888]",
              td: "border-b border-[#C9973A]/5 text-[#F7F6F3]",
              tr: "odd:bg-[#12172B] even:bg-[#0A0F2E] hover:bg-[#C9973A]/5 transition-colors duration-100",
            }}
          >
            <TableHeader>
              <TableColumn>CLIENT</TableColumn>
              <TableColumn>TABLE</TableColumn>
              <TableColumn>HEURE</TableColumn>
              <TableColumn>GUESTS</TableColumn>
              <TableColumn>STATUT</TableColumn>
              <TableColumn>CHECK-IN</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Aucune réservation pour ce soir."}>
              {reservations.map((reservation) => {
                const status = statusConfig(reservation.status);
                return (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" name={reservation.clientName} className="bg-[#C9973A]/20 text-[#C9973A]" />
                        <div>
                          <p className="text-[13px] font-semibold text-[#F7F6F3]">{reservation.clientName}</p>
                          <p className="text-[11px] text-[#888888]">{reservation.clientEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#888888]">{reservation.tableName}</TableCell>
                    <TableCell className="text-[#888888]">{reservation.hourLabel}</TableCell>
                    <TableCell>{reservation.guests}</TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color={status.color}>
                        <span className="text-[10px] uppercase tracking-[0.04em]">{status.label}</span>
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" color="success" variant="bordered" radius="none">
                        Check-in
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="mb-4 text-[15px] font-medium text-[#F7F6F3]">Promoteurs actifs ce soir</h2>
        <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Promoteurs actifs"
            classNames={{
              th: "bg-[#0A0F2E] text-left text-[11px] uppercase tracking-[0.04em] text-[#888888]",
              td: "border-b border-[#C9973A]/5 text-[#F7F6F3]",
              tr: "odd:bg-[#12172B] even:bg-[#0A0F2E] hover:bg-[#C9973A]/5 transition-colors duration-100",
            }}
          >
            <TableHeader>
              <TableColumn>NOM</TableColumn>
              <TableColumn>GUESTS AMENÉS</TableColumn>
              <TableColumn>CA GÉNÉRÉ</TableColumn>
              <TableColumn>LIEN ACTIF</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Aucun promoteur actif pour le moment."}>
              {promoters.map((promoter) => (
                <TableRow key={promoter.id}>
                  <TableCell>{promoter.name}</TableCell>
                  <TableCell>{promoter.guests}</TableCell>
                  <TableCell className="text-[#C9973A]">{promoter.revenueLabel}</TableCell>
                  <TableCell>
                    <Chip size="sm" radius="sm" variant="flat" color={promoter.linkActive ? "success" : "default"}>
                      {promoter.linkActive ? "Actif" : "Inactif"}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}