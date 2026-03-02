'use client';

// Component: PromotersTable
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon Design System data table
// NightTable usage: club dashboard promoters ranking table

import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

type PromoterTableRow = {
  id: string;
  rank: number;
  rankLabel: string;
  fullName: string;
  promoCode: string;
  commissionRate: number;
  monthlyRevenue: number;
  isActive: boolean;
};

type PromotersTableProps = {
  rows: PromoterTableRow[];
};

export function PromotersTable({ rows }: PromotersTableProps): React.JSX.Element {
  async function copyPromoCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
  }

  function rankChipColor(rank: number): "warning" | "default" {
    if (rank === 1) {
      return "warning";
    }

    return "default";
  }

  return (
    <div className="rounded-xl border border-white/5 bg-[#1A1D24] p-3 md:p-4">
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row) => (
          <article key={`mobile-${row.id}`} className="rounded-xl border border-white/5 bg-[#12172B] p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Chip size="sm" variant="solid" color={rankChipColor(row.rank)}>
                  {row.rankLabel}
                </Chip>
                <p className="text-sm font-medium text-[#F7F6F3]">{row.fullName}</p>
              </div>
              <Chip
                radius="full"
                size="sm"
                variant="flat"
                color={row.isActive ? "success" : "default"}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {row.isActive ? "Actif" : "Inactif"}
                </span>
              </Chip>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-[#888888]">CA ce mois</span>
              <span className="font-semibold text-[#F7F6F3]">{row.monthlyRevenue.toFixed(2)} €</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-[#888888]">Commission</span>
              <span className="text-[#F7F6F3]">{row.commissionRate}%</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <Chip variant="bordered" color="primary" size="sm">
                {row.promoCode}
              </Chip>
              <Button
                size="sm"
                variant="light"
                className="min-h-11 min-w-[44px] text-[#C9973A]"
                onPress={() => {
                  void copyPromoCode(row.promoCode);
                }}
              >
                Copier
              </Button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <Table
          removeWrapper
          aria-label="Classement des promoteurs du club"
          classNames={{
            th: "bg-[#111318] text-xs uppercase tracking-widest text-[#888888]",
            td: "border-b border-white/5 text-sm text-[#F7F6F3]",
            tr: "hover:bg-[#C9973A]/6 transition-colors duration-150",
          }}
        >
          <TableHeader>
            <TableColumn>PROMOTEUR</TableColumn>
            <TableColumn>CODE PROMO</TableColumn>
            <TableColumn>COMMISSION</TableColumn>
            <TableColumn>CA CE MOIS</TableColumn>
            <TableColumn>STATUT</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Aucun promoteur pour le moment."}>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Chip size="sm" variant="solid" color={rankChipColor(row.rank)}>
                      {row.rankLabel}
                    </Chip>
                    <span>{row.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip variant="bordered" color="primary" size="sm">
                    {row.promoCode}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="default">
                    {row.commissionRate}%
                  </Chip>
                </TableCell>
                <TableCell>{row.monthlyRevenue.toFixed(2)} €</TableCell>
                <TableCell>
                  <Chip
                    radius="full"
                    size="sm"
                    variant="flat"
                    color={row.isActive ? "success" : "default"}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {row.isActive ? "Actif" : "Inactif"}
                    </span>
                  </Chip>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="light"
                    className="min-h-11 min-w-[44px] text-[#C9973A]"
                    onPress={() => {
                      void copyPromoCode(row.promoCode);
                    }}
                  >
                    Copier
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}