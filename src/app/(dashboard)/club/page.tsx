import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ClubDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('club_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-white mb-2">
        {profile?.club_name || 'Mon Club'} 🏛️
      </h1>
      <p className="text-gray-400 font-body mb-8">
        Tableau de bord club · {profile?.subscription_tier || 'starter'}
        {profile?.subscription_active ? (
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Actif</span>
        ) : (
          <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Inactif</span>
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Événements', value: '0', color: 'text-white' },
          { label: 'Réservations', value: '0', color: 'text-[#C9973A]' },
          { label: "Chiffre d'affaires", value: '0 €', color: 'text-green-400' },
          { label: 'Promoteurs actifs', value: '0', color: 'text-white' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-body">{stat.label}</p>
            <p className={`text-3xl font-heading ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
        <h2 className="font-heading text-xl text-white mb-4">Événements récents</h2>
        <p className="text-gray-500 font-body text-sm">Aucun événement créé pour le moment.</p>
      </div>
    </div>
  )
}
