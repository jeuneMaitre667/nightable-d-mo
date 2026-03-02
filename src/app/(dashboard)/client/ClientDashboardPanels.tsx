'use client';

// Component: ClientDashboardPanels
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris dashboard summary pattern
// NightTable usage: client dashboard home KPIs and shortcuts

import Link from "next/link";
import { Button, Card, CardBody, Progress } from "@heroui/react";

type NextReservationData = {
  eventTitle: string;
  clubName: string;
  dateLabel: string;
  tableLabel: string;
  prepaymentLabel: string;
};

type ClientDashboardPanelsProps = {
  firstName: string;
  score: number;
  scoreTone: "high" | "medium" | "low";
  nextReservation: NextReservationData | null;
};

function scoreTextClass(tone: "high" | "medium" | "low"): string {
  if (tone === "high") return "text-[#3A9C6B]";
  if (tone === "medium") return "text-[#C9973A]";
  return "text-[#C4567A]";
}

function scoreTrackClass(tone: "high" | "medium" | "low"): string {
  if (tone === "high") return "[&>div]:bg-[#3A9C6B]";
  if (tone === "medium") return "[&>div]:bg-[#C9973A]";
  return "[&>div]:bg-[#C4567A]";
}

export function ClientDashboardPanels({
  firstName,
  score,
  scoreTone,
  nextReservation,
}: ClientDashboardPanelsProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Bonjour {firstName}</h1>
        <p className="text-sm text-[#888888]">Voici votre dashboard NightTable.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-[11px] uppercase tracking-widest text-[#888888]">NightTable Score</p>
            <div className="mt-3 flex items-end gap-3">
              <p className={`text-4xl font-semibold ${scoreTextClass(scoreTone)}`}>{score}</p>
              <p className="pb-1 text-sm text-[#888888]">/ 100</p>
            </div>
            <Progress
              value={score}
              className="mt-4"
              classNames={{
                track: "h-3 bg-[#0A0F2E]",
                indicator: scoreTrackClass(scoreTone),
              }}
              aria-label="NightTable Score"
            />
          </CardBody>
        </Card>

        <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-[11px] uppercase tracking-widest text-[#888888]">Prochaine réservation</p>
            {nextReservation ? (
              <div className="mt-3 space-y-1">
                <p className="text-lg font-semibold text-[#F7F6F3]">{nextReservation.eventTitle}</p>
                <p className="text-sm text-[#888888]">{nextReservation.clubName}</p>
                <p className="text-sm text-[#888888]">{nextReservation.dateLabel}</p>
                <p className="text-sm text-[#888888]">{nextReservation.tableLabel}</p>
                <p className="text-sm text-[#C9973A]">Acompte: {nextReservation.prepaymentLabel}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#888888]">Aucune réservation à venir.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
        <CardBody>
          <p className="text-[11px] uppercase tracking-widest text-[#888888]">Raccourcis</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              as={Link}
              href="/clubs"
              variant="bordered"
              className="min-h-11 border-[#C9973A]/40 px-4 text-sm font-semibold text-[#C9973A]"
            >
              Explorer les clubs
            </Button>
            <Button
              as={Link}
              href="/dashboard/client/reservations"
              className="min-h-11 bg-[#C9973A] px-4 text-sm font-semibold text-[#050508]"
            >
              Mes réservations
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}