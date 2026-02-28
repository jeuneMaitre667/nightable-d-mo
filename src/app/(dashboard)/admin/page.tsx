import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/login')

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-white mb-2">
        Administration NightTable ⚙️
      </h1>
      <p className="text-gray-400 font-body mb-8">Accès complet à la plateforme</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Utilisateurs', value: '–', color: 'text-white' },
          { label: 'Clubs', value: '–', color: 'text-[#C9973A]' },
          { label: 'Réservations', value: '–', color: 'text-white' },
          { label: "Chiffre d'affaires", value: '–', color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-body">{stat.label}</p>
            <p className={`text-3xl font-heading ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
