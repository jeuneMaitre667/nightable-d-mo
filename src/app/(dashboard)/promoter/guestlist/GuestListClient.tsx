"use client";

// Component: GuestListClient
// Reference: component.gallery/components/list
// Inspired by: Shopify Polaris list pattern
// NightTable usage: Promoter guest list management dashboard

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
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

function statusClasses(status: GuestItem["status"]): string {
  if (status === "arrived") {
    return "border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-[#3A9C6B]";
  }

  if (status === "no_show") {
    return "border border-[#C4567A]/30 bg-[#C4567A]/15 text-[#C4567A]";
  }

  return "border border-[#C9973A]/30 bg-[#C9973A]/15 text-[#C9973A]";
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4">
          <p className="text-[11px] uppercase tracking-widest text-[#888888]">Événement</p>
          <select
            value={selectedEventId}
            onChange={(event) => setSelectedEventId(event.target.value)}
            className="mt-2 h-11 w-full rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
            aria-label="Sélectionner un événement"
          >
            {events.map((eventItem) => (
              <option key={eventItem.id} value={eventItem.id}>
                {eventItem.title} — {new Date(eventItem.date).toLocaleDateString("fr-FR")}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4">
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
        </div>
      </div>

      <form
        onSubmit={handleAddGuest}
        className="rounded-xl border border-[#C9973A]/15 bg-[#12172B] p-4"
      >
        <p className="text-[11px] uppercase tracking-widest text-[#888888]">Ajouter un invité</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Prénom"
            required
            className="h-11 rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
          />
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Nom"
            required
            className="h-11 rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Téléphone (optionnel)"
            className="h-11 rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !selectedEventId}
          className="mt-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Ajout..." : "Ajouter"}
        </button>
      </form>

      {feedback ? (
        <p className="rounded-lg border border-[#C4567A]/30 bg-[#C4567A]/10 px-3 py-2 text-sm text-[#C4567A]">
          {feedback}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-[#C9973A]/10">
        <table className="w-full">
          <thead className="bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]">
            <tr>
              <th className="px-4 py-3 text-left">Invité</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleGuests.length === 0 ? (
              <tr className="bg-[#12172B]">
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#888888]">
                  Aucun invité pour cet événement.
                </td>
              </tr>
            ) : (
              visibleGuests.map((guest) => {
                const isPendingArrival = pendingArrivalIds.has(guest.id);

                return (
                  <tr
                    key={guest.id}
                    className="border-t border-[#C9973A]/5 bg-[#12172B] text-sm text-[#F7F6F3]"
                  >
                    <td className="px-4 py-3">{guest.guestName}</td>
                    <td className="px-4 py-3 text-[#888888]">{guest.guestPhone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusClasses(guest.status)}`}>
                        {statusLabel(guest.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleMarkArrived(guest.id)}
                        disabled={guest.status === "arrived" || isPendingArrival}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-3 py-2 text-xs font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isPendingArrival ? "Mise à jour..." : "Marquer arrivé"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
