'use client';

// Component: ClientReservationsTable
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon table pattern
// NightTable usage: client reservation history and actions

import Link from "next/link";
import { Button, Card, CardBody, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

type ReservationRow = {
  id: string;
  eventTitle: string;
  clubName: string;
  dateLabel: string;
  tableName: string;
  status: string;
  statusLabel: string;
  canResell: boolean;
  canCancel: boolean;
};

type ClientReservationsTableProps = {
  reservations: ReservationRow[];
  cancelReservationFormAction: (formData: FormData) => Promise<void>;
  createResaleListingFormAction: (formData: FormData) => Promise<void>;
};

function statusClass(status: string): string {
  if (status === "confirmed") {
    return "border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-[#3A9C6B]";
  }

  if (status === "cancelled") {
    return "border border-[#C4567A]/30 bg-[#C4567A]/15 text-[#C4567A]";
  }

  return "border border-[#C9973A]/30 bg-[#C9973A]/15 text-[#C9973A]";
}

export function ClientReservationsTable({
  reservations,
  cancelReservationFormAction,
  createResaleListingFormAction,
}: ClientReservationsTableProps): React.JSX.Element {
  if (reservations.length === 0) {
    return (
      <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
        <CardBody className="p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-[#C9973A]/30 bg-[#C9973A]/10" />
          <h2 className="text-lg font-semibold text-[#F7F6F3]">Aucune réservation pour le moment</h2>
          <p className="mt-2 text-sm text-[#888888]">
            Découvrez les meilleures soirées à Paris et réservez votre première table.
          </p>
          <Button
            as={Link}
            href="/clubs"
            className="mt-5 min-h-11 bg-[#C9973A] px-4 text-sm font-semibold text-[#050508]"
          >
            Voir les clubs
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="rounded-xl border border-[#C9973A]/10 bg-[#12172B] p-3">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="Historique des réservations client"
          classNames={{
            th: "bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]",
            td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
            tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
          }}
        >
          <TableHeader>
            <TableColumn>ÉVÉNEMENT</TableColumn>
            <TableColumn>CLUB</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn>TABLE</TableColumn>
            <TableColumn>STATUT</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.eventTitle}</TableCell>
                <TableCell className="text-[#888888]">{reservation.clubName}</TableCell>
                <TableCell className="text-[#888888]">{reservation.dateLabel}</TableCell>
                <TableCell className="text-[#888888]">{reservation.tableName}</TableCell>
                <TableCell>
                  <Chip
                    radius="full"
                    size="sm"
                    variant="flat"
                    className={statusClass(reservation.status)}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {reservation.statusLabel}
                    </span>
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <form action={createResaleListingFormAction}>
                      <input type="hidden" name="reservation_id" value={reservation.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="bordered"
                        className="min-h-11 border-[#C9973A]/40 px-3 text-xs font-semibold text-[#C9973A]"
                        isDisabled={!reservation.canResell}
                      >
                        Revendre
                      </Button>
                    </form>
                    <form action={cancelReservationFormAction}>
                      <input type="hidden" name="reservation_id" value={reservation.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="bordered"
                        className="min-h-11 border-[#C4567A]/40 px-3 text-xs font-semibold text-[#C4567A]"
                        isDisabled={!reservation.canCancel}
                      >
                        Annuler
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ClientReservationsTable;