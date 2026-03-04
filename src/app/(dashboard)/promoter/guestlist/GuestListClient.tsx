"use client";

// Component: GuestListClient
// Reference: component.gallery/components/list
// Inspired by: Shopify Polaris list pattern
// NightTable usage: Promoter guest list management dashboard

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  addGuestListEntryAction,
  markGuestArrivedAction,
} from "@/lib/promoter.actions";

type EventOption = {
  id: string;
  title: string;
  date: string;
  startTime: string;
};

type GuestItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  guestName: string;
  guestPhone: string | null;
  status: "pending" | "arrived" | "no_show";
  addedAt: string;
};

type GuestListClientProps = {
  events: EventOption[];
  initialGuests: GuestItem[];
  initialEventId: string | null;
};

function statusChip(status: GuestItem["status"]): { color: "default" | "success" | "danger"; variant: "flat" } {
  if (status === "arrived") {
    return { color: "success", variant: "flat" };
  }

  if (status === "no_show") {
    return { color: "danger", variant: "flat" };
  }

  return { color: "default", variant: "flat" };
}

function statusLabel(status: GuestItem["status"]): string {
  if (status === "arrived") return "Arrivé";
  if (status === "no_show") return "Absent";
  return "En attente";
}

export function GuestListClient({
  events,
  initialGuests,
  initialEventId,
}: GuestListClientProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEventId ?? events[0]?.id ?? ""
  );
  const [guests, setGuests] = useState<GuestItem[]>(initialGuests);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pendingArrivalIds, setPendingArrivalIds] = useState<Set<string>>(new Set());

  const selectedEvent = useMemo(
    () => events.find((eventItem) => eventItem.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const visibleGuests = useMemo(
    () => guests.filter((guest) => guest.eventId === selectedEventId),
    [guests, selectedEventId]
  );

  const totalGuests = visibleGuests.length;
  const arrivedGuests = visibleGuests.filter((guest) => guest.status === "arrived").length;

  async function handleAddGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!selectedEventId) {
      setFeedback("Sélectionnez un événement.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addGuestListEntryAction({
        eventId: selectedEventId,
        firstName,
        lastName,
        phone: phone.trim() || undefined,
      });

      if (!result.success || !result.data) {
        setFeedback(result.error ?? "Impossible d’ajouter l’invité.");
        return;
      }

      const addedGuest = result.data;

      const guestName = `${firstName.trim()} ${lastName.trim()}`.trim();
      setGuests((previousGuests) => [
        {
          id: addedGuest.guestId,
          eventId: selectedEventId,
          eventTitle: selectedEvent?.title ?? "Événement",
          eventDate: selectedEvent?.date ?? new Date().toISOString().slice(0, 10),
          guestName,
          guestPhone: phone.trim() || null,
          status: "pending",
          addedAt: new Date().toISOString(),
        },
        ...previousGuests,
      ]);

      setFirstName("");
      setLastName("");
      setPhone("");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMarkArrived(guestId: string): Promise<void> {
    const previousGuests = guests;
    setFeedback("");
    setPendingArrivalIds((previous) => new Set(previous).add(guestId));
    setGuests((previous) =>
      previous.map((guest) =>
        guest.id === guestId ? { ...guest, status: "arrived" } : guest
      )
    );

    const result = await markGuestArrivedAction({ guestId });

    if (!result.success) {
      setGuests(previousGuests);
      setFeedback(result.error ?? "Impossible de marquer l’arrivée.");
    }

    setPendingArrivalIds((previous) => {
      const next = new Set(previous);
      next.delete(guestId);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_65%,rgba(8,10,18,0.96)_100%)] p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#888888] md:text-[11px]">Gestion</p>
            <h1 className="mt-1 text-lg font-semibold text-[#F7F6F3] md:text-xl">Guest list</h1>
            <p className="mt-2 text-sm text-[#9A9AA0]">Pilote les invitations et les arrivées en temps réel.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button as={Link} href="/dashboard/promoter/promo" variant="bordered" className="min-h-11 border-[#C9973A]/40 px-4 text-sm text-[#C9973A]">
              🔗 Lien promo
            </Button>
            <Button as={Link} href="/dashboard/promoter/commissions" variant="bordered" className="min-h-11 border-[#C9973A]/20 px-4 text-sm text-[#F7F6F3]">
              € Commissions
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-[11px] uppercase tracking-widest text-[#888888]">Événement</p>
            <Select
              aria-label="Sélectionner un événement"
              selectedKeys={selectedEventId ? [selectedEventId] : []}
              onChange={(event) => setSelectedEventId(event.target.value)}
              className="mt-2"
              classNames={{
                trigger: "bg-[#0A0F2E] border border-[#2A2F4A]",
                value: "text-[#F7F6F3]",
              }}
            >
              {events.map((eventItem) => (
                <SelectItem key={eventItem.id}>
                  {eventItem.title} — {new Date(eventItem.date).toLocaleDateString("fr-FR")}
                </SelectItem>
              ))}
            </Select>
          </CardBody>
        </Card>

        <Card className="border border-[#C9973A]/15 bg-[#12172B] shadow-none">
          <CardBody>
            <p className="text-[11px] uppercase tracking-widest text-[#888888]">Compteurs live</p>
            <div className="mt-3 flex items-end gap-6">
              <div>
                <p className="text-xs text-[#888888]">Invités ajoutés</p>
                <p className="text-2xl font-semibold text-[#F7F6F3]">{totalGuests}</p>
              </div>
              <div>
                <p className="text-xs text-[#888888]">Invités arrivés</p>
                <p className="text-2xl font-semibold text-[#3A9C6B]">{arrivedGuests}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <form
        onSubmit={handleAddGuest}
        className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4"
      >
        <p className="text-[11px] uppercase tracking-widest text-[#888888]">Ajouter un invité</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <Input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Prénom"
            required
            classNames={{
              inputWrapper: "h-11 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Nom"
            required
            classNames={{
              inputWrapper: "h-11 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
          <Input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Téléphone (optionnel)"
            classNames={{
              inputWrapper: "h-11 bg-[#0A0F2E] border border-[#2A2F4A]",
              input: "text-[#F7F6F3]",
            }}
          />
        </div>
        <Button
          type="submit"
          isDisabled={isSubmitting || !selectedEventId}
          isLoading={isSubmitting}
          className="mt-4 min-h-11 bg-[#C9973A] px-4 text-sm font-semibold text-[#050508]"
        >
          {isSubmitting ? "Ajout..." : "＋ Ajouter"}
        </Button>
      </form>

      {feedback ? (
        <p className="rounded-lg border border-[#C4567A]/30 bg-[#C4567A]/10 px-3 py-2 text-sm text-[#C4567A]">
          {feedback}
        </p>
      ) : null}

      <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-3">
        <div className="overflow-x-auto">
          <Table
            removeWrapper
            aria-label="Guest list promoteur"
            classNames={{
              th: "bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]",
              td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
              tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
            }}
          >
            <TableHeader>
              <TableColumn>INVITÉ</TableColumn>
              <TableColumn>TÉLÉPHONE</TableColumn>
              <TableColumn>STATUT</TableColumn>
              <TableColumn>ACTION</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Aucun invité pour cet événement."}>
              {visibleGuests.map((guest) => {
                const isPendingArrival = pendingArrivalIds.has(guest.id);
                const status = statusChip(guest.status);

                return (
                  <TableRow key={guest.id}>
                    <TableCell>{guest.guestName}</TableCell>
                    <TableCell className="text-[#888888]">{guest.guestPhone ?? "—"}</TableCell>
                    <TableCell>
                      <Chip color={status.color} variant={status.variant} size="sm">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {statusLabel(guest.status)}
                        </span>
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="bordered"
                        onPress={() => void handleMarkArrived(guest.id)}
                        isDisabled={guest.status === "arrived" || isPendingArrival}
                        className="min-h-11 border-[#C9973A]/40 px-3 text-xs font-semibold text-[#C9973A]"
                      >
                        {isPendingArrival ? "Mise à jour..." : "✓ Marquer arrivé"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
