"use client";

// Component: ClubVipPanels
// Reference: component.gallery/components/table
// Inspired by: Radix + Polaris VIP management pattern
// NightTable usage: club VIP management interface with secondary accent

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

type PendingProfile = {
  id: string;
  firstName: string;
  lastName: string;
  instagramHandle: string | null;
  avatarUrl: string | null;
};

type ValidatedProfile = {
  id: string;
  firstName: string;
  lastName: string;
  instagramHandle: string | null;
  avatarUrl: string | null;
  validatedAt: string | null;
};

type InviteEvent = {
  id: string;
  title: string;
  dateLabel: string;
};

type ReservationOption = {
  id: string;
  eventId: string;
  label: string;
};

type PromoEvent = {
  id: string;
  title: string;
  dateLabel: string;
  isPromoActive: boolean;
};

type PromoTable = {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  status: string;
};

type ClubVipPanelsProps = {
  pendingProfiles: PendingProfile[];
  validatedProfiles: ValidatedProfile[];
  inviteEvents: InviteEvent[];
  reservationOptions: ReservationOption[];
  promoEvents: PromoEvent[];
  promoTablesByEvent: Record<string, PromoTable[]>;
  validateVipFromForm: (formData: FormData) => Promise<void>;
  createInvitationFromForm: (formData: FormData) => Promise<void>;
  toggleVipPromoFromForm: (formData: FormData) => Promise<void>;
};

function fullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim() || "Profil VIP";
}

export default function ClubVipPanels({
  pendingProfiles,
  validatedProfiles,
  inviteEvents,
  reservationOptions,
  promoEvents,
  promoTablesByEvent,
  validateVipFromForm,
  createInvitationFromForm,
  toggleVipPromoFromForm,
}: ClubVipPanelsProps): React.JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedVipId, setSelectedVipId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>(inviteEvents[0]?.id ?? "");
  const [selectedReservationId, setSelectedReservationId] = useState<string>("");

  const selectedVip = validatedProfiles.find((vip) => vip.id === selectedVipId) ?? null;
  const filteredReservations = useMemo(
    () => reservationOptions.filter((reservation) => reservation.eventId === selectedEventId),
    [reservationOptions, selectedEventId]
  );

  const activePromoEvents = promoEvents.filter((eventItem) => eventItem.isPromoActive);

  async function handleTogglePromo(eventId: string, enabled: boolean): Promise<void> {
    const formData = new FormData();
    formData.set("event_id", eventId);
    formData.set("enabled", String(enabled));

    startTransition(async () => {
      await toggleVipPromoFromForm(formData);
      router.refresh();
    });
  }

  return (
    <section className="space-y-5">
      <header className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#888888]">Gestion</p>
        <h1 className="text-2xl font-semibold text-[#F7F6F3]">Femmes VIP</h1>
        <p className="text-sm text-[#888888]">Validez les profils, envoyez les invitations et activez les promotions VIP.</p>
      </header>

      <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <h2 className="nt-heading text-2xl text-[#F7F6F3]">Profils en attente</h2>
        {pendingProfiles.length === 0 ? (
          <p className="mt-3 text-sm text-[#888888]">Aucun profil en attente pour le moment.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {pendingProfiles.map((vip) => (
              <Card key={vip.id} className="border border-[#C9973A]/20 bg-[#0A0F2E] shadow-none">
                <CardBody className="gap-3">
                  <Avatar
                    size="lg"
                    isBordered
                    color="secondary"
                    src={vip.avatarUrl ?? undefined}
                    name={fullName(vip.firstName, vip.lastName)}
                  />
                  <p className="nt-heading text-[18px] text-[#F7F6F3]">{fullName(vip.firstName, vip.lastName)}</p>
                  <Chip size="sm" variant="flat" color="secondary">
                    {vip.instagramHandle ?? "Instagram non renseigné"}
                  </Chip>
                </CardBody>
                <CardFooter className="flex gap-2 pt-0">
                  <form action={validateVipFromForm}>
                    <input type="hidden" name="vip_id" value={vip.id} />
                    <input type="hidden" name="status" value="validated" />
                    <Button size="sm" color="success" variant="bordered" radius="none" type="submit">
                      Valider
                    </Button>
                  </form>
                  <form action={validateVipFromForm}>
                    <input type="hidden" name="vip_id" value={vip.id} />
                    <input type="hidden" name="status" value="rejected" />
                    <Button size="sm" variant="light" type="submit" className="text-[#C4567A]">
                      Refuser
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </article>

      <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <h2 className="nt-heading mb-3 text-2xl text-[#F7F6F3]">VIPs validées</h2>
        <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="VIPs validées"
          classNames={{
            th: "bg-[#0A0F2E] text-xs uppercase tracking-widest text-[#888888]",
            td: "border-b border-[#C9973A]/8 text-sm text-[#F7F6F3]",
            tr: "hover:bg-[#C9973A]/5 transition-colors duration-150",
          }}
        >
          <TableHeader>
            <TableColumn>PROFIL</TableColumn>
            <TableColumn>INSTAGRAM</TableColumn>
            <TableColumn>VALIDÉE LE</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Aucune VIP validée pour ce club actuellement."}>
            {validatedProfiles.map((vip) => (
              <TableRow key={vip.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      src={vip.avatarUrl ?? undefined}
                      name={fullName(vip.firstName, vip.lastName)}
                    />
                    <span>{fullName(vip.firstName, vip.lastName)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-[#888888]">{vip.instagramHandle ?? "—"}</TableCell>
                <TableCell className="text-[#888888]">
                  {vip.validatedAt ? new Date(vip.validatedAt).toLocaleDateString("fr-FR") : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color="secondary"
                    variant="bordered"
                    radius="none"
                    onPress={() => {
                      setSelectedVipId(vip.id);
                      setSelectedEventId(inviteEvents[0]?.id ?? "");
                      setSelectedReservationId("");
                    }}
                  >
                    Inviter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </article>

      <article className="rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] p-4">
        <h2 className="nt-heading text-2xl text-[#F7F6F3]">Tables promos ce soir</h2>
        {activePromoEvents.length === 0 ? (
          <p className="mt-3 text-sm text-[#888888]">Aucune soirée avec promo VIP active ce soir.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {activePromoEvents.map((eventItem) => (
              <div key={eventItem.id} className="rounded-[8px] border border-[#C9973A]/12 bg-[#0A0F2E] p-4">
                <p className="text-sm font-semibold text-[#F7F6F3]">{eventItem.title}</p>
                <p className="mb-3 text-xs text-[#888888]">{eventItem.dateLabel}</p>

                <div className="space-y-2">
                  {(promoTablesByEvent[eventItem.id] ?? []).map((tableItem) => (
                    <div key={`${eventItem.id}-${tableItem.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-[#C9973A]/10 bg-[#12172B] px-3 py-2">
                      <div>
                        <p className="text-sm text-[#F7F6F3]">{tableItem.name}</p>
                        <p className="text-xs text-[#888888]">{tableItem.zone} · {tableItem.capacity} places</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          color="secondary"
                          isSelected={eventItem.isPromoActive}
                          isDisabled={isPending}
                          onValueChange={(value) => {
                            void handleTogglePromo(eventItem.id, value);
                          }}
                          aria-label={`Promo ${tableItem.name}`}
                        />
                        <Chip
                          color={tableItem.status === "available" ? "success" : "danger"}
                          variant="flat"
                          size="sm"
                        >
                          {tableItem.status === "available" ? "disponible" : "occupée"}
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <Modal
        isOpen={Boolean(selectedVip)}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedVipId(null);
          }
        }}
        classNames={{
          base: "bg-[#12172B] border border-[#C9973A]/20 text-[#F7F6F3]",
          header: "border-b border-[#C9973A]/10",
          footer: "border-t border-[#C9973A]/10",
        }}
      >
        <ModalContent>
          <form
            action={createInvitationFromForm}
            onSubmit={() => {
              setSelectedVipId(null);
            }}
          >
            <ModalHeader>Créer une invitation VIP</ModalHeader>
            <ModalBody>
              <input type="hidden" name="vip_id" value={selectedVipId ?? ""} />
              <Select
                label="Événement"
                labelPlacement="outside"
                color="secondary"
                variant="bordered"
                selectedKeys={selectedEventId ? [selectedEventId] : []}
                onChange={(event) => {
                  setSelectedEventId(event.target.value);
                  setSelectedReservationId("");
                }}
              >
                {inviteEvents.map((eventItem) => (
                  <SelectItem key={eventItem.id}>
                    {eventItem.title} · {eventItem.dateLabel}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Réservation"
                labelPlacement="outside"
                color="secondary"
                variant="bordered"
                name="reservation_id"
                selectedKeys={selectedReservationId ? [selectedReservationId] : []}
                onChange={(event) => setSelectedReservationId(event.target.value)}
                isRequired
              >
                {filteredReservations.map((reservation) => (
                  <SelectItem key={reservation.id}>{reservation.label}</SelectItem>
                ))}
              </Select>

              <input type="hidden" name="event_id" value={selectedEventId} />
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => setSelectedVipId(null)}>
                Annuler
              </Button>
              <Button type="submit" color="secondary" radius="none" isDisabled={!selectedReservationId}>
                Inviter
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </section>
  );
}