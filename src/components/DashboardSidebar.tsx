'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'

interface NavItem {
  href: string
  label: string
  icon: string
}

interface DashboardSidebarProps {
  role: string
  userName: string
  navItems: NavItem[]
}

export default function DashboardSidebar({ role, userName, navItems }: DashboardSidebarProps) {
  const pathname = usePathname()

  const roleLabels: Record<string, string> = {
    client: 'Client',
    club: 'Club',
    promoter: 'Promoteur',
    female_vip: 'VIP Féminin',
    admin: 'Administrateur',
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0a0a12] border-r border-[#C9973A]/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#C9973A]/20">
        <h1 className="font-heading text-2xl text-[#C9973A]">NightTable</h1>
        <p className="text-xs text-gray-500 font-body mt-1">{roleLabels[role] || role}</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-[#C9973A]/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#C9973A]/20 flex items-center justify-center">
            <span className="text-[#C9973A] text-sm font-body font-semibold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white text-sm font-body truncate">{userName}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-body text-sm ${
                isActive
                  ? 'bg-[#C9973A]/15 text-[#C9973A] border border-[#C9973A]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#C9973A]/10">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-colors font-body text-sm"
          >
            <span>🚪</span>
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
