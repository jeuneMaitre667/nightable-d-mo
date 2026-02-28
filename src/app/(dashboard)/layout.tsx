import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardSidebar from '@/components/DashboardSidebar'

const NAV_ITEMS: Record<string, Array<{ href: string; label: string; icon: string }>> = {
  client: [
    { href: '/dashboard/client', label: 'Tableau de bord', icon: '🏠' },
    { href: '/dashboard/client/reservations', label: 'Mes réservations', icon: '🎫' },
    { href: '/dashboard/client/events', label: 'Événements', icon: '🎉' },
    { href: '/dashboard/client/profile', label: 'Mon profil', icon: '👤' },
  ],
  club: [
    { href: '/dashboard/club', label: 'Tableau de bord', icon: '🏠' },
    { href: '/dashboard/club/events', label: 'Événements', icon: '🎉' },
    { href: '/dashboard/club/tables', label: 'Plans de salle', icon: '🗺️' },
    { href: '/dashboard/club/reservations', label: 'Réservations', icon: '🎫' },
    { href: '/dashboard/club/promoters', label: 'Promoteurs', icon: '📣' },
    { href: '/dashboard/club/settings', label: 'Paramètres', icon: '⚙️' },
  ],
  promoter: [
    { href: '/dashboard/promoter', label: 'Tableau de bord', icon: '🏠' },
    { href: '/dashboard/promoter/links', label: 'Mes liens', icon: '🔗' },
    { href: '/dashboard/promoter/guests', label: 'Liste invités', icon: '👥' },
    { href: '/dashboard/promoter/commissions', label: 'Commissions', icon: '💰' },
    { href: '/dashboard/promoter/profile', label: 'Mon profil', icon: '👤' },
  ],
  female_vip: [
    { href: '/dashboard/vip', label: 'Tableau de bord', icon: '🏠' },
    { href: '/dashboard/vip/invitations', label: 'Invitations', icon: '💌' },
    { href: '/dashboard/vip/profile', label: 'Mon profil', icon: '👤' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Tableau de bord', icon: '🏠' },
    { href: '/dashboard/admin/users', label: 'Utilisateurs', icon: '👥' },
    { href: '/dashboard/admin/clubs', label: 'Clubs', icon: '🏛️' },
    { href: '/dashboard/admin/reservations', label: 'Réservations', icon: '🎫' },
    { href: '/dashboard/admin/reports', label: 'Rapports', icon: '📊' },
    { href: '/dashboard/admin/settings', label: 'Paramètres', icon: '⚙️' },
  ],
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  const role = profile.role as string
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.client

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <DashboardSidebar
        role={role}
        userName={user.email || 'User'}
        navItems={navItems}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
