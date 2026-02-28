import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-white mb-2">
        Bonjour, {profile?.first_name || 'Client'} 👋
      </h1>
      <p className="text-gray-400 font-body mb-8">Bienvenue sur votre tableau de bord NightTable</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">Réservations actives</p>
          <p className="text-3xl font-heading text-white mt-1">0</p>
        </div>
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">Points fidélité</p>
          <p className="text-3xl font-heading text-[#C9973A] mt-1">{profile?.loyalty_points || 0}</p>
        </div>
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">NightTable Score</p>
          <p className="text-3xl font-heading text-white mt-1">{profile?.nighttable_score || '–'}</p>
        </div>
      </div>

      <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
        <h2 className="font-heading text-xl text-white mb-4">Prochains événements à Paris</h2>
        <p className="text-gray-500 font-body text-sm">Aucun événement disponible pour le moment.</p>
      </div>
    </div>
  )
}
