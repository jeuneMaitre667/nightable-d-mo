// Component: Sidebar (NightTable)
// Reference: shadcn/ui radix-nova sidebar
// Inspired by: Figma Velvet Rope, shadcn/ui, Radix
// NightTable usage: navigation sur tous les dashboards (club, client, promoter, vip, admin)

import * as React from "react"
import Link from "next/link"
// No external sidebar package: using local components
import { User2, Home, Calendar, Users, LayoutGrid, BarChart2, Settings, LogOut } from "lucide-react"

// SidebarProvider: simple passthrough for compatibility
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// AppSidebar: main sidebar component
export function AppSidebar({ role: _role = "club" }: { role?: string }) {
  // Sidebar structure: header, main nav
  return (
    <aside className="bg-[--color-bg-secondary] border-r border-[--color-accent]/10 flex flex-col h-full min-h-screen w-[var(--sidebar-width,16rem)]">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-[--color-accent]/10">
        <span className="text-[18px] font-bold tracking-[0.08em] text-[--color-accent]">NightTable</span>
      </div>
      {/* Content */}
      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          <li>
            <Link href="/dashboard/club" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Home className="w-5 h-5 mr-2" /> Tableau de bord
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/reservations" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Calendar className="w-5 h-5 mr-2" /> Réservations
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/clients" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Users className="w-5 h-5 mr-2" /> Clients
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/04-femmes-vip" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Users className="w-5 h-5 mr-2 rotate-45" /> Femmes VIP
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/promoters" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Users className="w-5 h-5 mr-2" /> Promoteurs
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/tables" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <LayoutGrid className="w-5 h-5 mr-2" /> Plan des tables
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/reports" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <BarChart2 className="w-5 h-5 mr-2" /> Rapports & CA
            </Link>
          </li>
          <li>
            <Link href="/dashboard/club/settings" className="flex items-center px-4 py-2 rounded-lg text-[--color-fg] font-medium hover:bg-[--color-accent]/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[--color-accent] focus:outline-none">
              <Settings className="w-5 h-5 mr-2" /> Paramètres
            </Link>
          </li>
        </ul>
      </nav>
      {/* Footer */}
      <div className="flex items-center gap-2 px-6 py-4 border-t border-[--color-accent]/10">
        <User2 className="w-6 h-6 text-[--color-accent]" />
        <span className="text-[--color-fg] text-[15px] font-medium">Julia B.</span>
        <span className="ml-auto text-[--color-muted] text-[13px]">Manager du Club</span>
        <button className="ml-2 p-1 rounded hover:bg-[--color-danger]/10 focus-visible:ring-2 focus-visible:ring-[--color-danger]" aria-label="Déconnexion">
          <LogOut className="w-5 h-5 text-[--color-muted] hover:text-[--color-danger]" />
        </button>
      </div>
    </aside>
  );
}
// ...existing code...

// No SidebarTrigger (not needed)
