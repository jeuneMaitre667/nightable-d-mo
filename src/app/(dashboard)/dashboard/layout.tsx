import Link from "next/link";
import { ReactNode } from "react";
import { logoutAction } from "@/lib/auth.actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-semibold">NightTable Dashboard</span>
          <nav className="flex gap-4 text-sm text-zinc-300">
            <Link href="/dashboard/client">Client</Link>
            <Link href="/dashboard/club">Club</Link>
            <Link href="/dashboard/promoter">Promoteur</Link>
            <Link href="/dashboard/vip">VIP</Link>
            <Link href="/dashboard/admin">Admin</Link>
            <form action={logoutAction}>
              <button type="submit" className="cursor-pointer underline">Déconnexion</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
