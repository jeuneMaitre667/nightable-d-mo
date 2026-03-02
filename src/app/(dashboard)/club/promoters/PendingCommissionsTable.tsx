"use client";

// Component: PendingCommissionsTable
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon compact table pattern
// NightTable usage: club pending commissions validation panel

import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

type PendingCommissionRow = {
  id: string;
  promoterName: string;
  eventTitle: string;
  amountLabel: string;
  rateLabel: string;
};

type PendingCommissionsTableProps = {
  rows: PendingCommissionRow[];
  validateCommissionFormAction: (formData: FormData) => Promise<void>;
};

export function PendingCommissionsTable({
  rows,
  validateCommissionFormAction,
}: PendingCommissionsTableProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4">
      <h2 className="mb-3 text-lg font-semibold text-[#F7F6F3]">Commissions à valider</h2>
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="Commissions à valider"
          classNames={{
            th: "bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]",
            td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
            tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
          }}
        >
          <TableHeader>
            <TableColumn>PROMOTEUR</TableColumn>
            <TableColumn>ÉVÉNEMENT</TableColumn>
            <TableColumn>MONTANT</TableColumn>
            <TableColumn>TAUX</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Aucune commission en attente de validation."}>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.promoterName}</TableCell>
                <TableCell className="text-[#888888]">{row.eventTitle}</TableCell>
                <TableCell className="text-[#C9973A]">{row.amountLabel}</TableCell>
                <TableCell>{row.rateLabel}</TableCell>
                <TableCell>
                  <form action={validateCommissionFormAction}>
                    <input type="hidden" name="commission_id" value={row.id} />
                    <Button size="sm" color="success" variant="bordered" radius="none">
                      Valider
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}