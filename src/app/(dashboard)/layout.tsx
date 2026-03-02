// Component: DashboardGroupLayout
// Reference: component.gallery/components/tabs
// Inspired by: Linear.app sidebar navigation pattern
// NightTable usage: global shell for authenticated dashboard group

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/auth.actions";
import { normalizeRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import type { UserRole } from "@/types";

type MenuItem = {
  href: string;
  label: string;
  icon?: string;
  section?: "general" | "gestion";
  badge?: string;
};

const roleMenus: Record<UserRole, MenuItem[]> = {
  client: [
    { href: "/dashboard/client", label: "Accueil", icon: "◦" },
    { href: "/reserve", label: "Réserver", icon: "◦" },
    { href: "/dashboard/client", label: "Mes réservations", icon: "◦" },
    { href: "/dashboard/client", label: "Mon score", icon: "◦" },
  ],
  club: [
    { href: "/dashboard/club", label: "Dashboard", icon: "⌂", section: "general" },
    { href: "/dashboard/club/events", label: "Événements", icon: "◧", section: "general" },
    { href: "/dashboard/club/tables", label: "Tables", icon: "▦", section: "general" },
    { href: "/dashboard/club/promoters", label: "Promoteurs", icon: "◉", section: "gestion" },
    { href: "/dashboard/club/vip", label: "Femmes VIP", icon: "✦", section: "gestion" },
    { href: "/dashboard/club/analytics", label: "Analytics", icon: "▤", section: "gestion" },
  ],
  promoter: [
    { href: "/dashboard/promoter", label: "Dashboard", icon: "◦" },
    { href: "/dashboard/promoter/guestlist", label: "Guest list", icon: "◦" },
    { href: "/dashboard/promoter/commissions", label: "Commissions", icon: "◦" },
    { href: "/dashboard/promoter/promo", label: "Lien promo", icon: "◦" },
  ],
  female_vip: [
    { href: "/dashboard/vip", label: "Accueil", icon: "◦" },
    { href: "/dashboard/vip/invitations", label: "Mes invitations", icon: "◦" },
    { href: "/dashboard/vip/profile", label: "Mon profil", icon: "◦" },
    { href: "/dashboard/vip/safety", label: "Suivi de soirée", icon: "◦" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "◦" },
    { href: "/dashboard/admin", label: "Clubs", icon: "◦" },
    { href: "/dashboard/admin", label: "Réservations", icon: "◦" },
    { href: "/dashboard/admin", label: "Promoteurs", icon: "◦" },
    { href: "/dashboard/admin", label: "Support", icon: "◦" },
  ],
};

async function logoutAndRedirect(): Promise<void> {
  "use server";

  const result = await logoutAction();
  redirect(result.data?.redirectTo ?? "/login");
}

async function resolveDashboardRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  profileRole: string | null | undefined
): Promise<UserRole> {
  let role = normalizeRole(profileRole);

  if (role === "admin") {
    return role;
  }

  if (!profileRole || role === "client") {
    const [clubResult, promoterResult, vipResult] = await Promise.all([
      supabase.from("club_profiles").select("id").eq("id", userId).maybeSingle(),
      supabase.from("promoter_profiles").select("id").eq("id", userId).maybeSingle(),
      supabase.from("female_vip_profiles").select("id").eq("id", userId).maybeSingle(),
    ]);

    const inferredRole: UserRole = clubResult.data?.id
      ? "club"
      : promoterResult.data?.id
        ? "promoter"
        : vipResult.data?.id
          ? "female_vip"
          : "client";

    if (inferredRole !== role) {
      role = inferredRole;
      await supabase.from("profiles").update({ role }).eq("id", userId);
    }
  }

  return role;
}

export default async function DashboardGroupLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,first_name")
    .eq("id", user.id)
    .maybeSingle();

  const role = await resolveDashboardRole(supabase, user.id, profile?.role);
  const menuItems = [...roleMenus[role]];

  if (role === "female_vip") {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    const { data: checkins } = await supabase
      .from("vip_safety_checkins")
      .select("checkin_type, created_at")
      .eq("vip_id", user.id)
      .gte("created_at", dayStart.toISOString())
      .order("created_at", { ascending: true });

    let safetyActive = false;
    for (const checkin of checkins ?? []) {
      if (checkin.checkin_type === "arrived") {
        safetyActive = true;
      }

      if (checkin.checkin_type === "departed") {
        safetyActive = false;
      }
    }

    if (safetyActive) {
      const safetyItem = menuItems.find((item) => item.href === "/dashboard/vip/safety");
      if (safetyItem) {
        safetyItem.badge = "actif";
      }
    }
  }

  const mobileTabs = menuItems.slice(0, 5);
  const firstName = typeof profile?.first_name === "string" && profile.first_name.trim().length > 0
    ? profile.first_name.trim()
    : "Club";
  const clubGeneralItems = role === "club" ? menuItems.filter((item) => item.section === "general") : [];
  const clubGestionItems = role === "club" ? menuItems.filter((item) => item.section === "gestion") : [];

  return (
    <div className="min-h-screen bg-[#050508] text-[#f7f6f3]">
      <header className="sticky top-0 z-30 border-b border-[#C9973A]/20 bg-[linear-gradient(180deg,rgba(10,15,46,0.96)_0%,rgba(18,23,43,0.92)_100%)] px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#888888]">NightTable</p>
            <p className="nt-heading text-xl">Dashboard {role.replace("_", " ")}</p>
          </div>
          <form action={logoutAndRedirect}>
            <button
              type="submit"
              className="nt-btn nt-btn-secondary min-h-11 px-3 py-2 text-xs transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Déconnexion
            </button>
          </form>
        </div>

      </header>

      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[220px_1fr]">
        <aside className="hidden h-screen border-r border-[#C9973A]/10 bg-[#0A0F2E] md:flex md:flex-col">
          <div className="px-4 pb-5 pt-6">
            <div className="flex items-center gap-2 px-1">
              <p className="font-[Cormorant_Garamond] text-[24px] leading-none text-[#C9973A]">NT</p>
              <p className="text-[13px] text-[#F7F6F3]">NightTable</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3">
            {role === "club" ? (
              <>
                <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-[#444]">Général</p>
                <nav className="space-y-1">
                  {clubGeneralItems.map((item) => (
                    <Link
                      key={`${role}-general-${item.label}-${item.href}`}
                      href={item.href}
                      className="flex min-h-11 items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#888888] transition-all duration-150 hover:bg-[#C9973A]/5 hover:text-[#F7F6F3]"
                    >
                      <span className="inline-flex w-4 justify-center text-[12px] text-current">{item.icon ?? "•"}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>

                <p className="mb-2 mt-6 px-3 text-[10px] uppercase tracking-widest text-[#444]">Gestion</p>
                <nav className="space-y-1">
                  {clubGestionItems.map((item) => (
                    <Link
                      key={`${role}-gestion-${item.label}-${item.href}`}
                      href={item.href}
                      className="flex min-h-11 items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#888888] transition-all duration-150 hover:bg-[#C9973A]/5 hover:text-[#F7F6F3]"
                    >
                      <span className="inline-flex w-4 justify-center text-[12px] text-current">{item.icon ?? "•"}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </>
            ) : (
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={`${role}-${item.label}-${item.href}`}
                    href={item.href}
                    className="flex min-h-11 items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#888888] transition-all duration-150 hover:bg-[#C9973A]/5 hover:text-[#F7F6F3]"
                  >
                    <span className="inline-flex w-4 justify-center text-[12px] text-current">{item.icon ?? "•"}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="border-t border-[#C9973A]/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9973A]/20 bg-[#12172B] text-[11px] font-semibold text-[#C9973A]">
                {firstName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] text-[#F7F6F3]">{firstName}</p>
                <p className="text-[11px] text-[#888888]">Manager du Club</p>
              </div>
            </div>
            <form action={logoutAndRedirect} className="mt-3">
              <button
                type="submit"
                className="nt-btn nt-btn-secondary min-h-11 w-full px-3 py-2 text-xs transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </aside>

        <main className="px-4 pb-24 pt-5 md:px-8 md:pb-8 md:pt-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#C9973A]/20 bg-[linear-gradient(180deg,#0A0F2E_0%,#12172B_100%)] px-2 py-2 md:hidden">
        <div className="grid grid-cols-5 gap-2">
          {mobileTabs.map((item) => (
            <Link
              key={`mobile-${item.label}-${item.href}`}
              href={item.href}
              className="min-h-11 rounded-[8px] border border-[#C9973A]/10 bg-[#0A0F2E]/35 px-1 py-2 text-center text-[11px] text-[#888888] transition-all duration-150 ease-in-out hover:border-[#C9973A]/40 hover:text-[#F7F6F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F2E]"
            >
              <span className="inline-flex items-center justify-center gap-1">
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex rounded-full border border-[#C4567A]/40 bg-[#C4567A]/15 px-1.5 py-0.5 text-[9px] uppercase text-[#C4567A] animate-pulse">
                    ●
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
