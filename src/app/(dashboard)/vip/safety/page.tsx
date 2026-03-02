import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { activateSafetyAction, confirmDepartureAction, reportIncidentAction } from "@/lib/vip.actions";
import { getDashboardPathByRole, normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type SafetyPageProps = {
  searchParams: Promise<{ incident?: string }>;
};

type CheckinRow = {
  checkin_type: "arrived" | "departed";
  created_at: string;
};

async function activateSafetyFromForm(): Promise<void> {
  "use server";

  await activateSafetyAction();
}

async function confirmDepartureFromForm(): Promise<void> {
  "use server";

  await confirmDepartureAction();
}

async function reportIncidentFromForm(formData: FormData): Promise<void> {
  "use server";

  const message = String(formData.get("incident_message") ?? "").trim();
  await reportIncidentAction(message);
  redirect("/dashboard/vip/safety?incident=sent");
}

export default async function VipSafetyPage({ searchParams }: SafetyPageProps): Promise<ReactElement> {
  const params = await searchParams;
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

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const { data: checkins } = await supabase
    .from("vip_safety_checkins")
    .select("checkin_type, created_at")
    .eq("vip_id", user.id)
    .gte("created_at", dayStart.toISOString())
    .order("created_at", { ascending: true });

  let activeCheckinTime: string | null = null;
  for (const checkin of (checkins ?? []) as CheckinRow[]) {
    if (checkin.checkin_type === "arrived") {
      activeCheckinTime = checkin.created_at;
    }

    if (checkin.checkin_type === "departed") {
      activeCheckinTime = null;
    }
  }

  const isSafetyActive = Boolean(activeCheckinTime);
  const activeTimeLabel = activeCheckinTime
    ? new Date(activeCheckinTime).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-[#C4567A]/35 bg-[linear-gradient(135deg,rgba(18,23,43,0.95)_0%,rgba(10,15,46,0.95)_65%,rgba(8,10,18,0.96)_100%)] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#C4567A]">Femme VIP</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Suivi de soirée</h1>
        <p className="mt-2 text-sm text-[#9A9AA0]">
          Activez votre suivi en début de soirée, puis confirmez votre retour pour rassurer votre contact de confiance.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard/vip/invitations"
            className="nt-btn nt-btn-secondary inline-flex min-h-11 items-center justify-center px-4 py-2 text-sm"
          >
            Mes invitations
          </Link>
          <Link
            href="/dashboard/vip/profile"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#C4567A]/35 px-4 py-2 text-sm text-[#F7F6F3] transition-all duration-200 ease-in-out hover:border-[#C4567A]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
          >
            Mon profil
          </Link>
        </div>
      </header>

      {params.incident === "sent" ? (
        <p className="rounded-lg border border-[#C4567A]/35 bg-[#C4567A]/12 px-4 py-3 text-sm text-[#F7F6F3]">
          Signalement envoyé discrètement à votre contact et à l’équipe NightTable.
        </p>
      ) : null}

      {!isSafetyActive ? (
        <article className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-8 text-center">
          <p className="text-sm text-[#888888]">Activez le suivi avant de partir en soirée</p>
          <form action={activateSafetyFromForm} className="mt-5">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#C4567A]/55 bg-[#C4567A]/22 px-5 py-3 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/34 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Activer le suivi pour ce soir
            </button>
          </form>
        </article>
      ) : (
        <article className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-3 w-3 rounded-full bg-[#3A9C6B] animate-pulse" />
            <p className="text-sm font-semibold text-[#3A9C6B]">Suivi actif depuis {activeTimeLabel}</p>
          </div>

          <form action={confirmDepartureFromForm} className="mt-6">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#3A9C6B]/55 bg-[#3A9C6B]/20 px-5 py-3 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#3A9C6B]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Je suis rentrée ✓
            </button>
          </form>

          <details className="mt-5 rounded-lg border border-[#C4567A]/25 bg-[#0A0F2E] p-3">
            <summary className="cursor-pointer text-xs uppercase tracking-[0.14em] text-[#C4567A]">
              Signaler un incident
            </summary>

            <form action={reportIncidentFromForm} className="mt-3 space-y-3">
              <textarea
                name="incident_message"
                required
                minLength={5}
                maxLength={1000}
                className="nt-input min-h-24 w-full"
                placeholder="Décrivez la situation en quelques mots..."
              />
              <button
                type="submit"
                className="min-h-11 rounded-lg border border-[#C4567A]/45 bg-[#C4567A]/15 px-4 py-2 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
              >
                Envoyer
              </button>
            </form>
          </details>
        </article>
      )}
    </section>
  );
}
