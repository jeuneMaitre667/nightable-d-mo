import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#C9973A]/10 bg-[#050508]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl text-[#C9973A]">NightTable</h1>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white font-body text-sm transition-colors">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="bg-[#C9973A] hover:bg-[#b8872f] text-black font-body font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block border border-[#C9973A]/30 rounded-full px-4 py-1.5 text-[#C9973A] text-sm font-body mb-8">
            🥂 La référence des réservations VIP à Paris
          </div>
          <h2 className="font-heading text-6xl md:text-7xl text-white leading-tight mb-6">
            Réservez votre table<br />
            <span className="text-[#C9973A]">dans les meilleurs clubs</span><br />
            de Paris
          </h2>
          <p className="text-gray-400 font-body text-xl max-w-2xl mx-auto mb-10">
            NightTable est la plateforme premium pour réserver des tables dans les clubs les plus exclusifs de Paris. 
            Prix dynamiques, réservation instantanée, expérience VIP.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-[#C9973A] hover:bg-[#b8872f] text-black font-body font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Réserver une table →
            </Link>
            <Link
              href="/register?role=club"
              className="border border-[#C9973A]/40 hover:border-[#C9973A] text-[#C9973A] font-body font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Inscrire mon club
            </Link>
          </div>
        </div>

        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9973A]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Features */}
      <section className="py-24 px-6 border-t border-[#C9973A]/10">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-heading text-4xl text-center text-white mb-4">
            Une plateforme complète
          </h3>
          <p className="text-gray-400 text-center font-body mb-16">
            Tout ce dont vous avez besoin pour vivre la nuit parisienne
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎫',
                title: 'Réservation instantanée',
                description: 'Sélectionnez votre table, payez en ligne, recevez votre QR code. Simple et rapide.',
              },
              {
                icon: '💰',
                title: 'Prix dynamiques',
                description: "Des tarifs qui s'adaptent à la demande, à l'événement et aux DJs. Réservez tôt pour économiser.",
              },
              {
                icon: '📣',
                title: 'Programme promoteurs',
                description: 'Les promoteurs partagent des liens affiliés et gagnent des commissions sur chaque réservation.',
              },
              {
                icon: '💌',
                title: 'Tables VIP féminines',
                description: 'Programme exclusif pour les VIP féminines avec invitations et tables promotionnelles.',
              },
              {
                icon: '🔄',
                title: 'Revente de tables',
                description: 'Vous ne pouvez plus venir ? Revendez votre table à un autre client en toute sécurité.',
              },
              {
                icon: '🤖',
                title: 'Concierge IA',
                description: 'Notre chatbot vous aide à trouver la table parfaite selon vos préférences.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[#0d0d14] border border-[#C9973A]/15 rounded-2xl p-6 hover:border-[#C9973A]/40 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="font-heading text-xl text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 font-body text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#C9973A]/10">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-heading text-5xl text-white mb-6">
            Prêt à vivre la nuit<br />
            <span className="text-[#C9973A]">comme jamais avant ?</span>
          </h3>
          <Link
            href="/register"
            className="inline-block bg-[#C9973A] hover:bg-[#b8872f] text-black font-body font-bold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C9973A]/10 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-heading text-[#C9973A]">NightTable</p>
          <p className="text-gray-600 font-body text-sm">
            © {new Date().getFullYear()} NightTable. La référence VIP à Paris.
          </p>
        </div>
      </footer>
    </div>
  )
}
