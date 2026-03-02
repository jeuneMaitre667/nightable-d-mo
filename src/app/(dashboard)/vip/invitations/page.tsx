import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { acceptInvitationAction, declineInvitationAction } from "@/lib/vip.actions";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type InvitationRow = {
  id: string;
  reservation_id: string;
  invited_by: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

type ReservationRow = {
  id: string;
  event_id: string;
};

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  club_id: string;
};

type ClubRow = {
  id: string;
  club_name: string | null;
};

type InviterProfileRow = {
  id: string;
  email: string | null;
  role: string;
};

type PromoterRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
};

const invitationStatusLabel: Record<InvitationRow["status"], string> = {
  pending: "En attente",
  accepted: "Acceptée",
  declined: "Déclinée",
};

async function acceptInvitationFromForm(formData: FormData): Promise<void> {
  "use server";

  const invitationId = String(formData.get("invitation_id") ?? "").trim();
  await acceptInvitationAction(invitationId);
}

async function declineInvitationFromForm(formData: FormData): Promise<void> {
  "use server";

  const invitationId = String(formData.get("invitation_id") ?? "").trim();
  await declineInvitationAction(invitationId);
}

export default async function VipInvitationsPage(): Promise<ReactElement> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  if (role !== "female_vip" && role !== "admin") {
    redirect(getDashboardPathByRole(role));
  }

  const { data: invitations } = await supabase
    .from("vip_invitations")
    .select("id, reservation_id, invited_by, status, created_at")
    .eq("vip_id", user.id)
    .order("created_at", { ascending: false });

  const invitationList = (invitations ?? []) as InvitationRow[];
  const reservationIds = invitationList.map((item) => item.reservation_id);

  const { data: reservations } = reservationIds.length
    ? await supabase
        .from("reservations")
        .select("id, event_id")
        .in("id", reservationIds)
    : { data: [] as ReservationRow[] };

  const reservationList = (reservations ?? []) as ReservationRow[];
  const eventIds = reservationList.map((item) => item.event_id);

  const { data: events } = eventIds.length
    ? await supabase
        .from("events")
        .select("id, title, date, start_time, club_id")
        .in("id", eventIds)
    : { data: [] as EventRow[] };

  const eventList = (events ?? []) as EventRow[];
  const clubIds = Array.from(new Set(eventList.map((item) => item.club_id)));

  const { data: clubs } = clubIds.length
    ? await supabase
        .from("club_profiles")
        .select("id, club_name")
        .in("id", clubIds)
    : { data: [] as ClubRow[] };

  const inviterIds = Array.from(new Set(invitationList.map((item) => item.invited_by)));

  const { data: inviterProfiles } = inviterIds.length
    ? await supabase
        .from("profiles")
        .select("id, email, role")
        .in("id", inviterIds)
    : { data: [] as InviterProfileRow[] };

  const { data: promoterProfiles } = inviterIds.length
    ? await supabase
        .from("promoter_profiles")
        .select("id, first_name, last_name")
        .in("id", inviterIds)
    : { data: [] as PromoterRow[] };

  const clubList = (clubs ?? []) as ClubRow[];
  const inviterList = (inviterProfiles ?? []) as InviterProfileRow[];
  const promoterList = (promoterProfiles ?? []) as PromoterRow[];

  const reservationsById = new Map(reservationList.map((item) => [item.id, item]));
  const eventsById = new Map(eventList.map((item) => [item.id, item]));
  const clubsById = new Map(clubList.map((item) => [item.id, item]));
  const inviterById = new Map(inviterList.map((item) => [item.id, item]));
  const promoterById = new Map(promoterList.map((item) => [item.id, item]));

  function getInvitedByLabel(invitedBy: string): string {
    const inviter = inviterById.get(invitedBy);
    if (!inviter) {
      return "NightTable";
    }

    if (inviter.role === "promoter") {
      const promoter = promoterById.get(invitedBy);
      const fullName = `${promoter?.first_name ?? ""} ${promoter?.last_name ?? ""}`.trim();
      return fullName || inviter.email || "Promoteur";
    }

    return inviter.email ?? "Club";
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#C4567A]/35 bg-[linear-gradient(135deg,rgba(18,23,43,0.95)_0%,rgba(10,15,46,0.95)_65%,rgba(8,10,18,0.96)_100%)] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#C4567A]">Femme VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Mes invitations</h1>
        <p className="mt-2 text-sm text-[#9A9AA0]">
          Consultez les invitations reçues, puis acceptez ou déclinez en un clic.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard/vip/profile"
            className="nt-btn nt-btn-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm"
          >
            Mon profil
          </Link>
          <Link
            href="/dashboard/vip/safety"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#C4567A]/35 px-4 py-2 text-sm text-[#F7F6F3] transition-all duration-200 ease-in-out hover:border-[#C4567A]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
          >
            Suivi de soirée
          </Link>
        </div>
      </header>

      {invitationList.length === 0 ? (
        <div className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-10 text-center">
          <p className="text-5xl text-[#C4567A]/40">✦</p>
          <h2 className="nt-heading mt-3 text-2xl text-[#F7F6F3]">Aucune invitation pour le moment</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#888888]">
            Les clubs et promoteurs pourront vous inviter directement à leurs tables VIP dès qu’une soirée correspond à votre profil.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {invitationList.map((invitation) => {
            const reservation = reservationsById.get(invitation.reservation_id);
            const event = reservation ? eventsById.get(reservation.event_id) : undefined;
            const club = event ? clubsById.get(event.club_id) : undefined;

            return (
              <li key={invitation.id} className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#F7F6F3]">{event?.title ?? "Événement"}</p>
                    <p className="mt-1 text-xs text-[#888888]">
                      {club?.club_name ?? "Club"} • {event ? new Date(event.date).toLocaleDateString("fr-FR") : "Date à venir"} {event?.start_time ? `• ${event.start_time.slice(0, 5)}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-[#888888]">Invitée par: {getInvitedByLabel(invitation.invited_by)}</p>
                  </div>
                  <span className="rounded-full border border-[#C4567A]/45 bg-[#C4567A]/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C4567A]">
                    {invitationStatusLabel[invitation.status]}
                  </span>
                </div>

                {invitation.status === "pending" ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={acceptInvitationFromForm}>
                      <input type="hidden" name="invitation_id" value={invitation.id} />
                      <button
                        type="submit"
                        className="min-h-11 rounded-lg border border-[#C4567A]/55 bg-[#C4567A]/20 px-4 py-2 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                      >
                        Accepter
                      </button>
                    </form>

                    <form action={declineInvitationFromForm}>
                      <input type="hidden" name="invitation_id" value={invitation.id} />
                      <button
                        type="submit"
                        className="min-h-11 rounded-lg border border-[#C4567A]/35 bg-transparent px-4 py-2 text-sm text-[#C4567A] transition-all duration-200 ease-in-out hover:border-[#C4567A]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                      >
                        Décliner
                      </button>
                    </form>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
