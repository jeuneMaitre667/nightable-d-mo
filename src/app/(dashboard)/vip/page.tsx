import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function VipDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('female_vip_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400',
    validated: 'text-green-400',
    rejected: 'text-red-400',
  }

  const statusLabels: Record<string, string> = {
    pending: 'En attente de validation',
    validated: 'Profil validé ✓',
    rejected: 'Profil refusé',
  }

  const status = profile?.validation_status || 'pending'

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-white mb-2">
        Espace VIP Féminin 💌
      </h1>
      <p className={`font-body mb-8 ${statusColors[status]}`}>
        {statusLabels[status]}
      </p>

      {status === 'pending' && (
        <div className="bg-[#C4567A]/10 border border-[#C4567A]/30 rounded-xl p-6 mb-6">
          <h2 className="font-heading text-lg text-[#C4567A] mb-2">Votre profil est en cours d&apos;examen</h2>
          <p className="text-gray-400 font-body text-sm">
            Notre équipe valide les profils VIP pour maintenir la qualité de notre communauté. 
            Vous serez notifié(e) par email sous 24-48h.
          </p>
        </div>
      )}

      <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
        <h2 className="font-heading text-xl text-white mb-4">Mes invitations</h2>
        <p className="text-gray-500 font-body text-sm">Aucune invitation pour le moment.</p>
      </div>
    </div>
  )
}
