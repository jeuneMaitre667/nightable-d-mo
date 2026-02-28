import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PromoterDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('promoter_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nightable.fr'
  const promoLink = profile?.promo_code ? `${appUrl}/reserve?promo=${profile.promo_code}` : null

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-white mb-2">
        Tableau de bord Promoteur 📣
      </h1>
      <p className="text-gray-400 font-body mb-8">Gérez vos liens affiliés et commissions</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">Total gagné</p>
          <p className="text-3xl font-heading text-[#C9973A] mt-1">{profile?.total_earned || 0} €</p>
        </div>
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">Taux de commission</p>
          <p className="text-3xl font-heading text-white mt-1">{profile?.commission_rate || 0}%</p>
        </div>
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm font-body">Code promo</p>
          <p className="text-2xl font-heading text-white mt-1">{profile?.promo_code || '–'}</p>
        </div>
      </div>

      {promoLink && (
        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-6">
          <h2 className="font-heading text-xl text-white mb-3">Votre lien affilié</h2>
          <div className="bg-[#050508] rounded-lg p-3">
            <code className="text-[#C9973A] text-sm font-body break-all">{promoLink}</code>
          </div>
        </div>
      )}
    </div>
  )
}
