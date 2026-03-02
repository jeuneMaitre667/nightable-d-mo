'use client';

// Component: PromoterPromoPanel
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris card + metric pattern
// NightTable usage: dedicated promo link management page for promoter

import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";
import PromoterShareActions from "@/app/(dashboard)/dashboard/promoter/promoterShareActions";

type DayEntry = {
  day: string;
  dayLabel: string;
  total: number;
  converted: number;
};

type PromoterPromoPanelProps = {
  promoLink: string | null;
  promoCode: string | null;
  commissionRate: number;
  totalClicks: number;
  convertedClicks: number;
  conversionRate: number;
  days: DayEntry[];
};

export function PromoterPromoPanel({
  promoLink,
  promoCode,
  commissionRate,
  totalClicks,
  convertedClicks,
  conversionRate,
  days,
}: PromoterPromoPanelProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
            <h1 className="mt-1 text-lg font-semibold text-[#F7F6F3] md:text-xl">Mon lien promo</h1>
            <p className="mt-2 text-sm text-[#9A9AA0]">
              Partage ton lien de réservation tracké. Chaque réservation te rapporte {commissionRate}% de commission.
            </p>
          </div>
          <Button as={Link} href="/dashboard/promoter/commissions" variant="bordered" className="min-h-11 border-[#C9973A]/40 px-4 text-sm text-[#C9973A]">
            € Mes commissions
          </Button>
        </div>
      </section>

      <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
        <CardBody className="p-6">
          {promoLink ? (
            <>
              <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Ton lien de réservation</p>
              <p className="mt-3 break-all rounded-lg border border-[#C9973A]/25 bg-[#0A0F2E] px-4 py-3 font-mono text-sm text-[#F7F6F3]">
                {promoLink}
              </p>
              <div className="mt-4">
                <PromoterShareActions link={promoLink} />
              </div>
              <p className="mt-4 text-xs text-[#888888]">
                Code promo&nbsp;: <span className="font-semibold text-[#C9973A]">{promoCode}</span> · Commission&nbsp;: <span className="text-[#C9973A]">{commissionRate}%</span>
              </p>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10">
                <span className="text-2xl text-[#C9973A]/30">🔗</span>
              </div>
              <h3 className="text-lg font-semibold text-[#F7F6F3]">Aucun code promo attribué</h3>
              <p className="mt-2 text-sm text-[#888888]">
                Contacte ton club référent pour activer ton lien de réservation.
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Clics total</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{totalClicks}</p>
          </CardBody>
        </Card>
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Réservations</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{convertedClicks}</p>
          </CardBody>
        </Card>
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Taux de conversion</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{conversionRate.toFixed(1)}%</p>
          </CardBody>
        </Card>
      </section>

      <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
        <CardBody className="p-4">
          <h2 className="mb-4 text-lg font-medium text-[#F7F6F3]">Activité des 7 derniers jours</h2>
          <div className="grid grid-cols-4 gap-2 text-center text-xs sm:grid-cols-7">
            {days.map((entry) => {
              const barHeight = entry.total > 0 ? Math.max(12, Math.min(80, entry.total * 8)) : 4;

              return (
                <div key={entry.day} className="flex flex-col items-center gap-1">
                  <div className="flex h-20 items-end">
                    <div
                      className="w-6 rounded-t bg-[#C9973A]/60 transition-all duration-200"
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>
                  <span className="text-[#888888]">{entry.total}</span>
                  <span className="text-[10px] text-[#888888]/70">{entry.dayLabel}</span>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Card className="border border-[#C9973A]/15 bg-[#0A0F2E] shadow-none">
        <CardBody className="p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9973A]">Conseils</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#888888]">
            <li>📱 Partage ton lien en story Instagram — les clics arrivent instantanément</li>
            <li>💬 Envoie le lien directement en message privé pour un meilleur taux de conversion</li>
            <li>🎯 Le cookie promo expire après 48h — relance régulièrement</li>
          </ul>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button as={Link} href="/dashboard/promoter" variant="bordered" className="min-h-11 border-[#C9973A]/40 px-5 text-sm text-[#C9973A]">
          ← Retour au dashboard
        </Button>
        <Button as={Link} href="/dashboard/promoter/commissions" variant="bordered" className="min-h-11 border-[#C9973A]/20 px-5 text-sm text-[#F7F6F3]">
          ◉ Voir mes commissions
        </Button>
      </div>
    </div>
  );
}