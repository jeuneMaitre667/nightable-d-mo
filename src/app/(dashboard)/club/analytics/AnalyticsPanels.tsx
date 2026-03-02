'use client';

// Component: AnalyticsPanels
// Reference: component.gallery/components/tabs + component.gallery/components/table
// Inspired by: IBM Carbon analytics + Shopify Polaris metric cards
// NightTable usage: club analytics period dashboard

import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Tab,
} from "@heroui/react";

type PeriodKey = "7d" | "30d" | "3m" | "all";

type MetricBundle = {
  revenueTotal: number;
  confirmedReservations: number;
  noShowRate: number;
  mostProfitableTable: string;
  bestPromoter: string;
  averageClientRating: number | null;
  variations: {
    revenueTotal: number | null;
    confirmedReservations: number | null;
    noShowRate: number | null;
    mostProfitableTable: number | null;
    bestPromoter: number | null;
    averageClientRating: number | null;
  };
};

type PromoterRow = {
  rank: number;
  promoterId: string;
  promoterName: string;
  reservations: number;
  revenue: number;
  paidCommission: number;
};

type EventRow = {
  eventId: string;
  eventTitle: string;
  dateLabel: string;
  soldTables: number;
  revenue: number;
  noShowRate: number;
  averageRating: number | null;
};

type AnalyticsPanelsProps = {
  period: PeriodKey;
  metrics: MetricBundle;
  promoterRows: PromoterRow[];
  eventRows: EventRow[];
  hasData: boolean;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatVariation(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  if (value >= 0) {
    return `+${value.toFixed(1)}%`;
  }

  return `${value.toFixed(1)}%`;
}

function variationColor(value: number | null): "default" | "success" | "danger" {
  if (value === null) {
    return "default";
  }

  return value >= 0 ? "success" : "danger";
}

export function AnalyticsPanels({
  period,
  metrics,
  promoterRows,
  eventRows,
  hasData,
}: AnalyticsPanelsProps): React.JSX.Element {
  const router = useRouter();

  const metricCards = [
    {
      key: "revenue",
      label: "CA total période",
      value: formatEuros(metrics.revenueTotal),
      variation: metrics.variations.revenueTotal,
    },
    {
      key: "confirmed",
      label: "Réservations confirmées",
      value: String(metrics.confirmedReservations),
      variation: metrics.variations.confirmedReservations,
    },
    {
      key: "noshow",
      label: "Taux de no-show",
      value: `${metrics.noShowRate.toFixed(1)}%`,
      variation: metrics.variations.noShowRate,
    },
    {
      key: "best-table",
      label: "Table la plus rentable",
      value: metrics.mostProfitableTable,
      variation: metrics.variations.mostProfitableTable,
    },
    {
      key: "best-promoter",
      label: "Promoteur le plus performant",
      value: metrics.bestPromoter,
      variation: metrics.variations.bestPromoter,
    },
    {
      key: "rating",
      label: "Note moyenne clients",
      value: metrics.averageClientRating !== null ? `${metrics.averageClientRating.toFixed(1)}/5` : "N/A",
      variation: metrics.variations.averageClientRating,
    },
  ];

  return (
    <div className="space-y-5">
      <header className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#888888]">Gestion</p>
            <h1 className="text-xl font-semibold text-[#F7F6F3]">Analytics</h1>
            <p className="text-sm text-[#888888]">Pilotez la performance commerciale du club.</p>
          </div>
          <Tabs
            selectedKey={period}
            color="primary"
            variant="underlined"
            onSelectionChange={(key) => {
              const selected = String(key);
              router.replace(`/dashboard/club/analytics?period=${selected}`);
            }}
          >
            <Tab key="7d" title="7 jours" />
            <Tab key="30d" title="30 jours" />
            <Tab key="3m" title="3 mois" />
            <Tab key="all" title="Tout" />
          </Tabs>
        </div>
      </header>

      {!hasData ? (
        <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
          <CardBody className="p-10 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
            <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucun événement sur cette période</h2>
            <p className="mt-2 text-sm text-[#888888]">Créez une soirée pour démarrer votre analyse.</p>
          </CardBody>
        </Card>
      ) : (
        <>
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((card) => (
              <Card key={card.key} className="border border-[#C9973A]/10 bg-[#12172B] shadow-none">
                <CardBody>
                  <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">{card.label}</p>
                  <p className="mt-2 nt-heading text-[36px] leading-none text-[#C9973A]">{card.value}</p>
                  <div className="mt-3">
                    <Chip size="sm" variant="flat" color={variationColor(card.variation)}>
                      {formatVariation(card.variation)}
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            ))}
          </section>

          <section className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-3">
            <h2 className="mb-3 px-1 text-[15px] font-medium text-[#F7F6F3]">Top promoteurs</h2>
            <div className="overflow-x-auto">
              <Table
                removeWrapper
                aria-label="Top promoteurs"
                classNames={{
                  th: "bg-[#0A0F2E] text-left text-[11px] uppercase tracking-[0.04em] text-[#888888]",
                  td: "border-b border-[#C9973A]/8 text-[#F7F6F3]",
                  tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
                }}
              >
                <TableHeader>
                  <TableColumn>RANG</TableColumn>
                  <TableColumn>PROMOTEUR</TableColumn>
                  <TableColumn>RÉSERVATIONS</TableColumn>
                  <TableColumn>CA GÉNÉRÉ</TableColumn>
                  <TableColumn>COMMISSION VERSÉE</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Aucune donnée promoteur sur cette période."}>
                  {promoterRows.map((row) => (
                    <TableRow key={row.promoterId}>
                      <TableCell>
                        <Chip variant="flat" color={row.rank === 1 ? "warning" : "default"} size="sm">
                          {row.rank}
                        </Chip>
                      </TableCell>
                      <TableCell>{row.promoterName}</TableCell>
                      <TableCell>{row.reservations}</TableCell>
                      <TableCell className="text-[#C9973A]">{formatEuros(row.revenue)}</TableCell>
                      <TableCell>{formatEuros(row.paidCommission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-3">
            <h2 className="mb-3 px-1 text-[15px] font-medium text-[#F7F6F3]">Événements passés</h2>
            <div className="overflow-x-auto">
              <Table
                removeWrapper
                aria-label="Événements passés"
                classNames={{
                  th: "bg-[#0A0F2E] text-left text-[11px] uppercase tracking-[0.04em] text-[#888888]",
                  td: "border-b border-[#C9973A]/8 text-[#F7F6F3]",
                  tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
                }}
              >
                <TableHeader>
                  <TableColumn>ÉVÉNEMENT</TableColumn>
                  <TableColumn>DATE</TableColumn>
                  <TableColumn>TABLES VENDUES</TableColumn>
                  <TableColumn>CA</TableColumn>
                  <TableColumn>NO-SHOWS</TableColumn>
                  <TableColumn>NOTE</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Aucun événement terminé sur cette période."}>
                  {eventRows.map((row) => (
                    <TableRow key={row.eventId}>
                      <TableCell>{row.eventTitle}</TableCell>
                      <TableCell>{row.dateLabel}</TableCell>
                      <TableCell>{row.soldTables}</TableCell>
                      <TableCell className="text-[#C9973A]">{formatEuros(row.revenue)}</TableCell>
                      <TableCell>
                        {row.noShowRate > 20 ? (
                          <Chip color="danger" variant="flat" size="sm">
                            {row.noShowRate.toFixed(1)}%
                          </Chip>
                        ) : (
                          <Chip color="default" variant="flat" size="sm">
                            {row.noShowRate.toFixed(1)}%
                          </Chip>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.averageRating !== null && row.averageRating > 4 ? (
                          <Chip color="success" variant="flat" size="sm">
                            {row.averageRating.toFixed(1)}/5
                          </Chip>
                        ) : (
                          <Chip color="default" variant="flat" size="sm">
                            {row.averageRating !== null ? `${row.averageRating.toFixed(1)}/5` : "N/A"}
                          </Chip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}