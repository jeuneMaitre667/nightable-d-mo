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
};

const roleMenus: Record<UserRole, MenuItem[]> = {
  client: [
    { href: "/dashboard/client", label: "Accueil" },
    { href: "/reserve", label: "Réserver" },
    { href: "/dashboard/client", label: "Mes réservations" },
    { href: "/dashboard/client", label: "Mon score" },
  ],
  club: [
    { href: "/dashboard/club", label: "Dashboard" },
    { href: "/dashboard/club", label: "Événements" },
    { href: "/dashboard/club", label: "Tables" },
    { href: "/dashboard/club", label: "Promoteurs" },
    { href: "/dashboard/club", label: "Analytics" },
  ],
  promoter: [
    { href: "/dashboard/promoter", label: "Dashboard" },
    { href: "/dashboard/promoter", label: "Guest list" },
    { href: "/dashboard/promoter", label: "Commissions" },
    { href: "/dashboard/promoter", label: "Lien promo" },
  ],
  female_vip: [
    { href: "/dashboard/vip", label: "Profil" },
    { href: "/dashboard/vip", label: "Invitations" },
    { href: "/dashboard/vip", label: "Clubs" },
    { href: "/dashboard/vip", label: "Historique" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin", label: "Clubs" },
    { href: "/dashboard/admin", label: "Réservations" },
    { href: "/dashboard/admin", label: "Promoteurs" },
    { href: "/dashboard/admin", label: "Support" },
  ],
};

async function logoutAndRedirect(): Promise<void> {
  "use server";

  const result = await logoutAction();
  redirect(result.data?.redirectTo ?? "/login");
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
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = normalizeRole(profile?.role);
  const menuItems = roleMenus[role];
  const mobileTabs = menuItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#050508] text-[#f7f6f3]">
      <header className="sticky top-0 z-30 border-b border-[#c9973a]/15 bg-[#0a0f2e]/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#888888]">NightTable</p>
            <p className="nt-heading text-xl">Dashboard {role.replace("_", " ")}</p>
          </div>
          <form action={logoutAndRedirect}>
            <button type="submit" className="nt-btn nt-btn-secondary px-3 py-2 text-xs">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid min-h-screen max-w-7xl md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-[#c9973a]/12 bg-[#0a0f2e] p-5 md:block">
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#888888]">NightTable</p>
            <h2 className="nt-heading mt-1 text-3xl text-[#c9973a]">Dashboard</h2>
            <p className="mt-2 text-sm capitalize text-[#888888]">Rôle : {role.replace("_", " ")}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={`${role}-${item.label}-${item.href}`}
                href={item.href}
                className="block rounded-md border border-[#c9973a]/10 px-3 py-2 text-sm text-[#c9c9c9] transition duration-200 ease-in-out hover:border-[#c9973a]/40 hover:text-[#f7f6f3]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAndRedirect} className="mt-6">
            <button type="submit" className="nt-btn nt-btn-secondary w-full px-4 py-2 text-sm">
              Déconnexion
            </button>
          </form>
        </aside>

        <main className="px-4 pb-24 pt-5 md:px-8 md:pb-8 md:pt-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#c9973a]/20 bg-[#0a0f2e] px-2 py-2 md:hidden">
        <div className="grid grid-cols-5 gap-2">
          {mobileTabs.map((item) => (
            <Link
              key={`mobile-${item.label}-${item.href}`}
              href={item.href}
              className="rounded-md border border-[#c9973a]/10 px-1 py-2 text-center text-[11px] text-[#c9c9c9]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
