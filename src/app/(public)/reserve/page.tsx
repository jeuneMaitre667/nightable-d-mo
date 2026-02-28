import { cookies } from 'next/headers'

interface ReservePageProps {
  searchParams: Promise<{ promo?: string }>
}

export default async function ReservePage({ searchParams }: ReservePageProps) {
  const params = await searchParams
  const promoCode = params.promo

  if (promoCode) {
    const cookieStore = await cookies()
    cookieStore.set('promo_code', promoCode, {
      maxAge: 60 * 60 * 48, // 48 hours
      httpOnly: true,
      sameSite: 'lax',
    })
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl text-white mb-2">Réserver une table</h1>
        {promoCode && (
          <div className="inline-flex items-center gap-2 bg-[#C9973A]/10 border border-[#C9973A]/30 rounded-full px-4 py-1.5 text-[#C9973A] text-sm font-body mb-6">
            🎁 Code promo <strong>{promoCode}</strong> appliqué
          </div>
        )}
        <p className="text-gray-400 font-body mb-8">Découvrez les événements disponibles à Paris</p>

        <div className="bg-[#0d0d14] border border-[#C9973A]/20 rounded-xl p-8">
          <p className="text-gray-500 font-body text-center">
            Aucun événement disponible pour le moment. Revenez bientôt !
          </p>
        </div>
      </div>
    </div>
  )
}
