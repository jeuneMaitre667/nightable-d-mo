import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateVipProfileAction } from "@/lib/vip.actions";

type VipProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  instagram_handle: string | null;
  avatar_url: string | null;
  validated_clubs: string[];
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  rgpd_consent_at: string | null;
};

type ClubRow = {
  id: string;
  club_name: string | null;
  city: string | null;
};

async function updateVipProfileFromForm(formData: FormData): Promise<void> {
  "use server";

  await updateVipProfileAction(formData);
}

export default async function VipProfilePage(): Promise<ReactElement> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roleProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(roleProfile?.role);
  if (role !== "female_vip" && role !== "admin") {
    redirect(getDashboardPathByRole(role));
  }

  const { data: vipProfile, error: vipError } = await supabase
    .from("female_vip_profiles")
    .select(
      "id, first_name, last_name, phone, instagram_handle, avatar_url, validated_clubs, emergency_contact_name, emergency_contact_phone, rgpd_consent_at"
    )
    .eq("id", user.id)
    .maybeSingle();

  const typedVipProfile = vipProfile as VipProfileRow | null;

  if (vipError || !typedVipProfile) {
    return (
      <section className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Mon profil</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Profil indisponible</h1>
        <p className="mt-3 text-sm text-[#888888]">Impossible de charger vos informations pour le moment.</p>
      </section>
    );
  }

  const validatedClubIds = typedVipProfile.validated_clubs ?? [];

  const { data: validatedClubs } = validatedClubIds.length
    ? await supabase
        .from("club_profiles")
        .select("id, club_name, city")
        .in("id", validatedClubIds)
    : { data: [] as ClubRow[] };

  const validatedClubList = (validatedClubs ?? []) as ClubRow[];

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#C4567A]/35 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#C4567A]">Femme VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Mon profil</h1>
        <p className="mt-2 text-sm text-[#888888]">
          Gardez vos informations à jour pour simplifier vos validations et vos invitations.
        </p>
      </header>

      <form action={updateVipProfileFromForm} className="space-y-6 rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
        <section>
          <h2 className="nt-heading text-xl text-[#F7F6F3]">Informations personnelles</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Prénom</label>
              <input id="first_name" name="first_name" defaultValue={typedVipProfile.first_name ?? ""} className="nt-input min-h-11" type="text" />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Nom</label>
              <input id="last_name" name="last_name" defaultValue={typedVipProfile.last_name ?? ""} className="nt-input min-h-11" type="text" />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Téléphone</label>
              <input id="phone" name="phone" defaultValue={typedVipProfile.phone ?? ""} className="nt-input min-h-11" type="tel" />
            </div>
            <div>
              <label htmlFor="instagram_handle" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Instagram</label>
              <input id="instagram_handle" name="instagram_handle" defaultValue={typedVipProfile.instagram_handle ?? ""} className="nt-input min-h-11" type="text" placeholder="@votrehandle" />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="avatar_url" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Photo (URL)</label>
            <input id="avatar_url" name="avatar_url" defaultValue={typedVipProfile.avatar_url ?? ""} className="nt-input min-h-11" type="url" placeholder="https://..." />
          </div>
        </section>

        <section className="rounded-lg border border-[#C4567A]/25 bg-[#0A0F2E] p-4">
          <h2 className="nt-heading text-lg text-[#F7F6F3]">Contact de confiance</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="emergency_contact_name" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Nom</label>
              <input id="emergency_contact_name" name="emergency_contact_name" defaultValue={typedVipProfile.emergency_contact_name ?? ""} className="nt-input min-h-11" type="text" />
            </div>
            <div>
              <label htmlFor="emergency_contact_phone" className="mb-1 block text-[11px] uppercase tracking-[0.15em] text-[#888888]">Téléphone</label>
              <input id="emergency_contact_phone" name="emergency_contact_phone" defaultValue={typedVipProfile.emergency_contact_phone ?? ""} className="nt-input min-h-11" type="tel" />
            </div>
          </div>
        </section>

        <label className="flex min-h-11 items-center gap-3 text-sm text-[#F7F6F3]">
          <input
            type="checkbox"
            name="rgpd_consent"
            defaultChecked={Boolean(typedVipProfile.rgpd_consent_at)}
            className="h-4 w-4 accent-[#C9973A]"
          />
          J’accepte le traitement de mes données pour les parcours VIP NightTable.
        </label>

        <button
          type="submit"
          className="min-h-11 rounded-lg border border-[#C4567A]/55 bg-[#C4567A]/20 px-5 py-2 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
        >
          Mettre à jour mon profil
        </button>
      </form>

      <section className="rounded-xl border border-[#C4567A]/25 bg-[#12172B] p-6">
        <h2 className="nt-heading text-xl text-[#F7F6F3]">Mes clubs valideurs</h2>
        {validatedClubList.length === 0 ? (
          <p className="mt-3 text-sm text-[#888888]">Aucun club validateur pour le moment.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {validatedClubList.map((club) => (
              <li key={club.id} className="rounded-lg border border-[#C4567A]/20 bg-[#0A0F2E] p-4">
                <p className="text-sm font-semibold text-[#F7F6F3]">{club.club_name ?? "Club"}</p>
                <p className="mt-1 text-xs text-[#888888]">{club.city ?? "Paris"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
