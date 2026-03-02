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
  function rankChipColor(rank: number): "warning" | "default" {
    if (rank === 1) {
      return "warning";
    }

    return "default";
  }

  return (
    <div className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-3">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="Classement des promoteurs du club"
          classNames={{
            th: "bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]",
            td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
            tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
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
                  <Button size="sm" variant="light" className="text-[#C9973A]">
                    Voir
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