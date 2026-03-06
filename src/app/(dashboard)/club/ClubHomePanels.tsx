
'use client'

// Component: ClubHomePanels (refonte 2024-06, full Tailwind, NightTable dark luxury)
// Reference: IBM Carbon, Linear, Figma maquette Velvet Rope
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { ReactElement } from 'react';

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
type RevenuePoint = { label: string; value: number };
type SpaceRow = { name: string; percent: number };
type ClubHomePanelsProps = {
  dashboardDateLabel: string;
  metrics: MetricItem[];
  revenueSeries: RevenuePoint[];
  spaceRows: SpaceRow[];
  reservations: ReservationItem[];
  promotersCount: number;
  period: string;
  setPeriod: (p: string) => void;
};

const statusBadge = (status: string) => {
  if (status === 'confirmed') return <span className="inline-block rounded-full bg-[#3A9C6B]/15 text-[#3A9C6B] border border-[#3A9C6B]/30 px-3 py-1 text-[12px] font-semibold">Confirmée</span>;
  if (status === 'pending' || status === 'payment_pending') return <span className="inline-block rounded-full bg-[#C9973A]/15 text-[#C9973A] border border-[#C9973A]/30 px-3 py-1 text-[12px] font-semibold">Acompte payé</span>;
  if (status === 'cancelled') return <span className="inline-block rounded-full bg-[#C4567A]/15 text-[#C4567A] border border-[#C4567A]/30 px-3 py-1 text-[12px] font-semibold">Annulée</span>;
  return <span className="inline-block rounded-full bg-[#888888]/15 text-[#888888] border border-[#888888]/30 px-3 py-1 text-[12px] font-semibold">En attente</span>;
};

export default function ClubHomePanels({
  dashboardDateLabel,
  metrics,
  revenueSeries,
  spaceRows,
  reservations,
  promotersCount,
  period,
  setPeriod,
}: ClubHomePanelsProps): ReactElement {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-[22px] md:text-[28px] font-semibold text-[#F7F6F3] tracking-tight">Aperçu analytique</h1>
          <p className="text-[13px] text-[#888888]">{dashboardDateLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="min-h-11 px-5 text-sm font-semibold">
            Exporter
          </Button>
        </div>
      </div>

      {/* Metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="rounded-xl bg-[#12172B] border border-[#C9973A]/15 p-6 flex flex-col gap-2 shadow-[0_4px_24px_rgba(201,151,58,0.08)]">
            <div className="text-[13px] text-[#888888]">{metric.label}</div>
            <div className="text-[28px] font-bold text-[#F7F6F3]">{metric.value}</div>
            <div className={`text-[13px] font-medium ${metric.isPositive ? 'text-[#3A9C6B]' : 'text-[#C4567A]'}`}>{metric.deltaLabel}</div>
          </div>
        ))}
      </div>

      {/* Main content: chart + spaces */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1.2fr] gap-4">
        {/* Revenue chart */}
        <div className="rounded-xl bg-[#181B2A] border border-[#C9973A]/10 p-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-[#C9973A]/10 bg-[#12172B] px-6 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[16px] font-bold text-[#F7F6F3]">Évolution des revenus</h2>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={period}
                onValueChange={setPeriod}
                options={[
                  { label: 'Journalier', value: 'day' },
                  { label: 'Hebdomadaire', value: 'hebdo' },
                  { label: 'Mensuel', value: 'month' },
                ]}
                className="w-[140px]"
              />
            </div>
          </div>
          <div className="h-[220px] w-full px-2 md:px-6 pb-6 pt-2 bg-[#181B2A]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries} barSize={36}>
                <XAxis dataKey="label" stroke="#888888" tickLine={false} axisLine={false} fontSize={13} />
                <YAxis stroke="#888888" tickLine={false} axisLine={false} fontSize={13} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  contentStyle={{ background: "#111318", border: "1px solid #C9973A33", borderRadius: 8, color: "#F7F6F3" }}
                />
                <Bar dataKey="value" fill="#7C5CFA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spaces popularity */}
        <div className="rounded-xl bg-[#1A1D24] border border-[#C9973A]/15 p-6 flex flex-col">
          <h2 className="text-[15px] font-bold text-[#F7F6F3] mb-1">Espaces les plus prisés</h2>
          <p className="mb-4 text-[12px] text-[#888888]">Répartition par zone</p>
          <div className="flex flex-col gap-4">
            {spaceRows.map((space) => (
              <div key={space.name} className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-[#F7F6F3]">{space.name}</span>
                  <span className="text-[13px] text-[#7C5CFA] font-semibold">{space.percent}%</span>
                </div>
                <div className="w-full h-2 bg-[#12172B] rounded-full overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${space.percent}%`, background: '#7C5CFA' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 text-[12px] text-[#888888]">{promotersCount} promoteur(s) actif(s) ce soir</div>
        </div>
      </div>

      {/* Recent reservations table */}
      <div className="rounded-xl bg-[#1A1D24] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold text-[#F7F6F3]">Réservations récentes</h2>
          <a href="/dashboard/club/events" className="text-[13px] text-[#7C5CFA] hover:underline">Voir tout</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-[11px] uppercase tracking-widest text-[#888888] font-semibold pb-2">Client</th>
                <th className="text-[11px] uppercase tracking-widest text-[#888888] font-semibold pb-2">Date de l&apos;événement</th>
                <th className="text-[11px] uppercase tracking-widest text-[#888888] font-semibold pb-2">Table / Espace</th>
                <th className="text-[11px] uppercase tracking-widest text-[#888888] font-semibold pb-2">Montant</th>
                <th className="text-[11px] uppercase tracking-widest text-[#888888] font-semibold pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="bg-[#181B2A] rounded-xl">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#C9973A]/20 flex items-center justify-center text-[#C9973A] font-bold text-[15px]">
                        {r.clientName.split(' ').map((n) => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold text-[#F7F6F3]">{r.clientName}</div>
                        <div className="text-[12px] text-[#888888]">{r.clientEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-[13px] text-[#F7F6F3]">{r.dateTimeLabel}</td>
                  <td className="py-3 pr-4 text-[13px] text-[#F7F6F3]">{r.tableZoneLabel}</td>
                  <td className="py-3 pr-4 text-[14px] font-medium text-[#F7F6F3]">{r.amountLabel}</td>
                  <td className="py-3">{statusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}