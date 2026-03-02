'use client';

// Component: PromoterCommissionsPanel
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table pattern
// NightTable usage: promoter commissions summary and history

import Link from "next/link";
import { Button, Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

type CommissionItem = {
  id: string;
  createdAtLabel: string;
  clubName: string;
  eventTitle: string;
  reservationAmountLabel: string;
  rateLabel: string;
  commissionAmountLabel: string;
  status: "pending" | "validated" | "paid";
  statusLabel: string;
};

type PromoterCommissionsPanelProps = {
  monthlyRevenueLabel: string;
  pendingAmountLabel: string;
  totalPaidLabel: string;
  commissions: CommissionItem[];
};

function statusChip(status: CommissionItem["status"]): { color: "default" | "success" | "warning"; variant: "flat" } {
  if (status === "paid") return { color: "success", variant: "flat" };
  if (status === "validated") return { color: "warning", variant: "flat" };
  return { color: "default", variant: "flat" };
}

export function PromoterCommissionsPanel({
  monthlyRevenueLabel,
  pendingAmountLabel,
  totalPaidLabel,
  commissions,
}: PromoterCommissionsPanelProps): React.JSX.Element {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="nt-heading text-3xl text-[#F7F6F3]">Mes commissions</h1>
        <p className="mt-1 text-sm text-[#888888]">Historique complet et suivi des versements.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">CA ce mois</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{monthlyRevenueLabel}</p>
          </CardBody>
        </Card>
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">En attente</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{pendingAmountLabel}</p>
          </CardBody>
        </Card>
        <Card className="border border-[#C9973A]/20 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-xs uppercase tracking-[0.16em] text-[#888888]">Total versé</p>
            <p className="nt-heading mt-3 text-4xl text-[#C9973A]">{totalPaidLabel}</p>
          </CardBody>
        </Card>
      </section>

      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4">
        <h2 className="mb-4 text-lg font-medium text-[#F7F6F3]">Historique</h2>

        {commissions.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10">
              <span className="text-2xl text-[#C9973A]/30">€</span>
            </div>
            <h3 className="text-lg font-semibold text-[#F7F6F3]">Aucune commission pour le moment</h3>
            <p className="mt-2 text-sm text-[#888888]">Dès qu&apos;un client réserve via ton lien promo, ta commission apparaîtra ici.</p>
            <Button as={Link} href="/dashboard/promoter/promo" className="mt-5 min-h-11 bg-[#C9973A] px-5 text-sm font-semibold text-[#050508]">
              Voir mon lien promo
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#C9973A]/10 bg-[#12172B] p-3">
            <Table
              removeWrapper
              aria-label="Historique commissions promoteur"
              classNames={{
                th: "bg-[#0A0F2E] text-left text-xs uppercase tracking-widest text-[#888888]",
                td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
                tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
              }}
            >
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>CLUB</TableColumn>
                <TableColumn>ÉVÉNEMENT</TableColumn>
                <TableColumn>RÉSERVATION</TableColumn>
                <TableColumn>TAUX</TableColumn>
                <TableColumn>COMMISSION</TableColumn>
                <TableColumn>STATUT</TableColumn>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => {
                  const chip = statusChip(commission.status);

                  return (
                    <TableRow key={commission.id}>
                      <TableCell>{commission.createdAtLabel}</TableCell>
                      <TableCell>{commission.clubName}</TableCell>
                      <TableCell>{commission.eventTitle}</TableCell>
                      <TableCell>{commission.reservationAmountLabel}</TableCell>
                      <TableCell className="text-[#888888]">{commission.rateLabel}</TableCell>
                      <TableCell className="font-semibold text-[#C9973A]">{commission.commissionAmountLabel}</TableCell>
                      <TableCell>
                        <Chip color={chip.color} variant={chip.variant} size="sm">
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            {commission.statusLabel}
                          </span>
                        </Chip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}