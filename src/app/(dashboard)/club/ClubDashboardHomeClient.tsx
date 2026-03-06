"use client";

import { useState } from "react";
import ClubHomePanels from "./ClubHomePanels";

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

import type { ReactElement } from "react";

interface RawReservation {
  id: string;
  clientName: string;
  clientEmail: string;
  created_at: string;
  event_table_id: string;
  prepayment_amount: number;
  status: string;
}

interface Props {
  dashboardDateLabel: string;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    deltaLabel: string;
    isPositive: boolean;
  }>;
  spaceRows: Array<{ name: string; percent: number }>;
  rawReservations: RawReservation[];
  promotersCount: number;
}

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(date: Date): string {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${day}/${month}`;
}

export default function ClubDashboardHomeClient(
  props: Props
): ReactElement {
  const [period, setPeriod] = useState<string>("hebdo");

  // compute revenue series based on period and reservations
  const revenueSeries = (() => {
    const { rawReservations: reservations } = props;
    const today = new Date();
    const currentWeekMonday = mondayOf(today);
    const weekStarts = Array.from({ length: 5 }, (_, idx) => {
      const d = new Date(currentWeekMonday);
      d.setDate(currentWeekMonday.getDate() - (4 - idx) * 7);
      return d;
    });

    if (period === "hebdo") {
      return weekStarts.map((start) => {
        const end = new Date(start);
        end.setDate(start.getDate() + 7);
        const weekTotal = reservations.reduce((sum, reservation) => {
          const createdAt = new Date(reservation.created_at);
          if (createdAt >= start && createdAt < end) {
            return sum + Number(reservation.prepayment_amount ?? 0);
          }
          return sum;
        }, 0);
        return {
          label: formatWeekLabel(start),
          value: Math.round(weekTotal),
        };
      });
    }

    if (period === "day") {
      const days = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - idx));
        d.setHours(0, 0, 0, 0);
        return d;
      });
      return days.map((day) => {
        const next = new Date(day);
        next.setDate(day.getDate() + 1);
        const dayTotal = reservations.reduce((sum, reservation) => {
          const createdAt = new Date(reservation.created_at);
          if (createdAt >= day && createdAt < next) {
            return sum + Number(reservation.prepayment_amount ?? 0);
          }
          return sum;
        }, 0);
        return {
          label: `${day.getDate().toString().padStart(2, "0")}/${(day.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`,
          value: Math.round(dayTotal),
        };
      });
    }

    if (period === "month") {
      const months = Array.from({ length: 6 }, (_, idx) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - idx), 1);
        d.setHours(0, 0, 0, 0);
        return d;
      });
      return months.map((monthDate) => {
        const next = new Date(monthDate);
        next.setMonth(monthDate.getMonth() + 1, 1);
        const monthTotal = reservations.reduce((sum, reservation) => {
          const createdAt = new Date(reservation.created_at);
          if (createdAt >= monthDate && createdAt < next) {
            return sum + Number(reservation.prepayment_amount ?? 0);
          }
          return sum;
        }, 0);
        return {
          label: `${(monthDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${monthDate.getFullYear().toString().slice(-2)}`,
          value: Math.round(monthTotal),
        };
      });
    }

    return [];
  })();

  // transform raw reservations into the display shape expected by ClubHomePanels
  const displayReservations = props.rawReservations.map((r) => ({
    id: r.id,
    clientName: r.clientName,
    clientEmail: r.clientEmail,
    dateTimeLabel: new Date(r.created_at).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    tableZoneLabel: r.event_table_id, // upstream already maps id→name if needed
    amountLabel: formatEuros(r.prepayment_amount),
    status: r.status,
  }));

  return (
    <ClubHomePanels
      dashboardDateLabel={props.dashboardDateLabel}
      metrics={props.metrics}
      spaceRows={props.spaceRows}
      reservations={displayReservations}
      promotersCount={props.promotersCount}
      revenueSeries={revenueSeries}
      period={period}
      setPeriod={setPeriod}
    />
  );
}
