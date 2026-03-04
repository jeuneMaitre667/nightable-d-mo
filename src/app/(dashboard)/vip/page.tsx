// Component: FemaleVipDashboardPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: dashboard principal des utilisatrices female_vip

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateVipProfileAction } from "@/lib/vip.actions";

type VipProfileRow = {
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  instagram_handle: string | null;
  validation_status: "pending" | "validated" | "rejected";
  validated_clubs: string[];
  validated_at: string | null;
  rgpd_consent_at: string | null;
};

type ClubRow = {
  id: string;
  club_name: string | null;
  city: string | null;
};

type EventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  club_id: string;
};

const statusLabel: Record<VipProfileRow["validation_status"], string> = {
  pending: "En attente de validation",
  validated: "Profil validé",
  rejected: "Validation refusée",
};

const statusClassName: Record<VipProfileRow["validation_status"], string> = {
  pending: "border border-[#888888]/40 bg-[#888888]/10 text-[#888888]",
  validated: "border border-[#3A9C6B]/40 bg-[#3A9C6B]/10 text-[#3A9C6B]",
  rejected: "border border-[#C4567A]/40 bg-[#C4567A]/10 text-[#C4567A]",
};

async function updateVipProfileFromForm(formData: FormData): Promise<void> {
  "use server";

  await updateVipProfileAction(formData);
}

export default async function FemaleVipDashboardPage(): Promise<ReactElement> {
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

  const { data: vipProfile, error: vipError } = await supabase
    .from("female_vip_profiles")
    .select(
      "first_name, last_name, phone, instagram_handle, validation_status, validated_clubs, validated_at, rgpd_consent_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  const typedVipProfile = vipProfile as VipProfileRow | null;

  if (vipError || !typedVipProfile) {
    return (
      <section className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Femme VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Module indisponible</h1>
        <p className="mt-3 text-sm text-[#888888]">
          Impossible de charger votre profil pour le moment. Réessayez dans quelques instants.
        </p>
      </section>
    );
  }

  const validatedClubIds = typedVipProfile.validated_clubs ?? [];
  let validatedClubs: ClubRow[] = [];
  if (validatedClubIds.length > 0) {
    const { data: clubs } = await supabase
      .from("club_profiles")
      .select("id, club_name, city")
      .in("id", validatedClubIds);

    validatedClubs = clubs ?? [];
  }

  const today = new Date().toISOString().slice(0, 10);
  let upcomingEvents: EventRow[] = [];
  if (validatedClubIds.length > 0) {
    const { data: events } = await supabase
      .from("events")
      .select("id, title, date, start_time, club_id")
      .in("club_id", validatedClubIds)
      .gte("date", today)
      .eq("status", "published")
      .order("date", { ascending: true })
      .limit(6);

    upcomingEvents = (events ?? []) as EventRow[];
  }

  const clubNameById = new Map(validatedClubs.map((club) => [club.id, club.club_name ?? "Club"]));

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[#C4567A]/30 bg-[linear-gradient(135deg,rgba(18,23,43,0.95)_0%,rgba(10,15,46,0.95)_65%,rgba(8,10,18,0.96)_100%)] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Femme VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Mon espace validation</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#9A9AA0]">
          Gérez votre profil, suivez votre statut et consultez les prochaines soirées des clubs qui vous ont validée.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
          <h2 className="nt-heading text-xl text-[#F7F6F3]">Statut de validation</h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] ${statusClassName[typedVipProfile.validation_status]}`}>
              {statusLabel[typedVipProfile.validation_status]}
            </span>
            {typedVipProfile.validated_at ? (
              <span className="text-xs text-[#888888]">
                Validée le {new Date(typedVipProfile.validated_at).toLocaleDateString("fr-FR")}
              </span>
            ) : null}
          </div>

          {typedVipProfile.validation_status === "pending" ? (
            <p className="mt-4 text-sm text-[#888888]">
              Votre profil est en cours de revue par les clubs partenaires. Complétez vos informations pour accélérer la validation.
            </p>
          ) : null}

          {typedVipProfile.validation_status === "rejected" ? (
            <p className="mt-4 text-sm text-[#888888]">
              Votre demande a été refusée. Mettez à jour votre profil et contactez l’équipe NightTable pour une nouvelle revue.
            </p>
          ) : null}

          <div className="mt-5">
            <Link
              href="/clubs"
              className="nt-btn nt-btn-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4567A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Découvrir les clubs
            </Link>
          </div>
        </article>

        <article className="rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
          <h2 className="nt-heading text-xl text-[#F7F6F3]">Clubs qui vous ont validée</h2>
          {validatedClubs.length === 0 ? (
            <div className="mt-4 rounded-lg border border-[#C4567A]/20 bg-[#0A0F2E] p-4">
              <p className="text-sm text-[#888888]">Aucun club validant pour le moment.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {validatedClubs.map((club) => (
                <li key={club.id} className="rounded-lg border border-[#C4567A]/20 bg-[#0A0F2E] p-4">
                  <p className="text-sm font-semibold text-[#F7F6F3]">{club.club_name ?? "Club"}</p>
                  <p className="mt-1 text-xs text-[#888888]">{club.city ?? "Paris"}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
          <h2 className="nt-heading text-xl text-[#F7F6F3]">Mettre à jour mon profil</h2>
          <form action={updateVipProfileFromForm} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                  Prénom
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  defaultValue={typedVipProfile.first_name ?? ""}
                  className="nt-input min-h-11"
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                  Nom
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  defaultValue={typedVipProfile.last_name ?? ""}
                  className="nt-input min-h-11"
                  type="text"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={typedVipProfile.phone ?? ""}
                className="nt-input min-h-11"
                type="tel"
              />
            </div>

            <div>
              <label htmlFor="instagram_handle" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                Instagram
              </label>
              <input
                id="instagram_handle"
                name="instagram_handle"
                defaultValue={typedVipProfile.instagram_handle ?? ""}
                className="nt-input min-h-11"
                type="text"
                placeholder="@votrehandle"
              />
            </div>

            <label className="flex min-h-11 items-center gap-3 text-sm text-[#F7F6F3]">
              <input
                type="checkbox"
                name="rgpd_consent"
                defaultChecked={Boolean(typedVipProfile.rgpd_consent_at)}
                className="h-4 w-4 accent-[#C4567A]"
              />
              J’accepte le traitement de mes données pour le parcours de validation.
            </label>

            <button
              type="submit"
              className="nt-btn nt-btn-primary min-h-11 px-5 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4567A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Enregistrer mes informations
            </button>
          </form>
        </article>

        <article className="rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
          <h2 className="nt-heading text-xl text-[#F7F6F3]">Prochaines soirées recommandées</h2>
          {upcomingEvents.length === 0 ? (
            <div className="mt-4 rounded-lg border border-[#C4567A]/20 bg-[#0A0F2E] p-4">
              <p className="text-sm text-[#888888]">
                Aucune soirée publiée pour vos clubs validants actuellement.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcomingEvents.map((eventItem) => (
                <li key={eventItem.id} className="rounded-lg border border-[#C4567A]/20 bg-[#0A0F2E] p-4">
                  <p className="text-sm font-semibold text-[#F7F6F3]">{eventItem.title}</p>
                  <p className="mt-1 text-xs text-[#888888]">
                    {new Date(eventItem.date).toLocaleDateString("fr-FR")} • {eventItem.start_time.slice(0, 5)} • {clubNameById.get(eventItem.club_id) ?? "Club"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
