import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo Clubs | NightTable",
  description: "Découvrez la démo NightTable pour piloter votre club: plan des tables, VIP et revenus en temps réel.",
};

const platformCards = [
  {
    title: "Plan des tables en direct",
    description: "Vue live des tables, statuts et capacités en un écran.",
    image: "/demo/club-plan.webp",
  },
  {
    title: "Gestion des promoteurs",
    description: "Suivi des performances, codes promo et commissions par promoteur.",
    image: "/demo/promoter-dashboard.webp",
  },
  {
    title: "Fichiers clients & VIPs",
    description: "Historique, préférences et niveau de service centralisés.",
    image: "/demo/vip-profiles.webp",
  },
  {
    title: "Analyses et CA",
    description: "KPI soirée, revenu et performance par zone en temps réel.",
    image: "/demo/revenue-analytics.webp",
  },
];

const showcaseSections = [
  {
    id: "plan",
    title: "Maîtrisez votre espace avec le Plan des Tables",
    description:
      "Ayez une vue d’ensemble sur l’agencement de votre club. Modifiez en temps réel les prix, la capacité de chaque table et optimisez votre espace pour maximiser vos revenus.",
    points: [
      "Modification en temps réel",
      "Statut de disponibilité",
    ],
    image: "/demo/club-plan.webp",
  },
  {
    id: "vips",
    title: "Vos VIPs méritent un service exceptionnel",
    description:
      "Centralisez vos réservations et accédez au profil détaillé de vos meilleurs clients. Anticipez leurs besoins pour garantir une expérience inoubliable.",
    points: [
      "Gestion centralisée des réservations",
      "Historique client détaillé",
    ],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "analytics",
    title: "Prenez le contrôle de vos chiffres",
    description:
      "Suivez votre chiffre d’affaires en temps réel, analysez les performances de vos soirées et prenez des décisions basées sur des données concrètes.",
    points: [
      "Tableau de bord analytique",
      "Rapports générés automatiquement",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#050508] text-[#F7F6F3]">
      <header className="border-b border-[#C9973A]/10 bg-[#050508]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-[0.08em] text-[#F7F6F3]">
            NIGHTTABLE
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-[#888888] md:flex">
            <a href="#fonctionnalites" className="transition-colors duration-150 hover:text-[#F7F6F3]">Fonctionnalités</a>
            <a href="#plan" className="transition-colors duration-150 hover:text-[#F7F6F3]">Plan des tables</a>
            <Link href="/tarifs" className="transition-colors duration-150 hover:text-[#F7F6F3]">Tarifs</Link>
            <a href="#temoignages" className="transition-colors duration-150 hover:text-[#F7F6F3]">Témoignages</a>
          </nav>
          <div aria-hidden="true" />
        </div>
      </header>

      <section className="px-6 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mx-auto max-w-4xl text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[64px]">
            Gérez votre club d&apos;une
            <br />
            <span className="text-[#C9973A]">main de maître</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[720px] text-base leading-relaxed text-[#888888] md:text-lg">
            La plateforme tout-en-un pour les boîtes de nuit. Optimisez vos réservations de tables,
            gérez vos VIPs et suivez votre chiffre d&apos;affaires en temps réel.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/clubs-acces"
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#C9973A] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508] transition-all duration-150 hover:brightness-105"
            >
              Démarrer l’essai gratuit
            </Link>
            <Link
              href="#plan"
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-[#C9973A]/35 px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#C9973A] transition-all duration-150 hover:border-[#C9973A]/70 hover:text-[#E8C96A]"
            >
              Voir la démo
            </Link>
          </div>

          <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-xl border border-[#C9973A]/15 bg-[#0A0F2E] p-3 md:p-5">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#C9973A]/10">
              <Image
                src="/demo/promoter-dashboard.webp"
                alt="Aperçu dashboard NightTable pour pilotage club"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.15),rgba(5,5,8,0.6))]" />
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnalites" className="px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-24">
          {showcaseSections.map((section, index) => {
            const reverse = index % 2 !== 0;

            return (
              <article
                key={section.id}
                id={section.id}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
              >
                <div className={reverse ? "md:order-2" : ""}>
                  <div className="mb-4 h-4 w-4 rounded-[4px] bg-[#0A0F2E]" aria-hidden="true" />
                  <h2 className="max-w-[540px] text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[44px]">
                    {section.title}
                  </h2>
                  <p className="mt-4 max-w-[540px] text-base leading-relaxed text-[#888888]">
                    {section.description}
                  </p>
                  <div className="mt-6 space-y-3">
                    {section.points.map((point) => (
                      <p key={point} className="text-sm font-semibold text-[#F7F6F3]">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>

                <div className={reverse ? "md:order-1" : ""}>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] border border-[#C9973A]/12 bg-[#0A0F2E]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.1),rgba(5,5,8,0.45))]" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[34px] font-semibold leading-[1.15] tracking-[-0.02em] md:text-[44px]">
              Une solution complète, sans compromis
            </h2>
            <p className="mx-auto mt-4 max-w-[640px] text-base leading-relaxed text-[#888888]">
              NightTable vous offre tous les outils pour paramétrer votre gestion dans les moindres détails,
              de l&apos;accès aux données jusqu&apos;à la personnalisation de votre espace.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
            {platformCards.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[6px] border border-[#C9973A]/10 bg-[#0A0F2E] px-4 py-4 md:px-5"
              >
                <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-[6px] border border-[#C9973A]/10">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.1),rgba(5,5,8,0.35))]" />
                </div>
                <h3 className="text-[18px] font-semibold leading-tight text-[#F7F6F3]">{feature.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#888888]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="temoignages" className="bg-[#C9973A] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-[36px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#050508] md:text-[52px]">
            Prêt à réinventer vos soirées ?
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] text-base leading-relaxed text-[#050508]/75">
            Rejoignez l’élite de la nuit. Digitalisez votre gestion et offrez une expérience sans friction à vos clients et votre équipe.
          </p>
          <div className="mt-9">
            <Link
              href="/clubs-acces"
              className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#050508] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#F7F6F3] transition-all duration-150 hover:brightness-110"
            >
              Créer un compte gratuitement
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#C9973A]/10 bg-[#050508] px-6 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-[4px] bg-[#C9973A]" aria-hidden="true" />
              <p className="text-sm font-semibold tracking-[0.08em] text-[#F7F6F3]">NIGHTTABLE</p>
            </div>
            <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-[#888888]">
              Le logiciel de gestion de réservations premium pour clubs de nuit et établissements de prestige.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F7F6F3]">Produit</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#888888]">
              <Link href="/demo" className="transition-colors duration-150 hover:text-[#F7F6F3]">Démo</Link>
              <Link href="/clubs-acces" className="transition-colors duration-150 hover:text-[#F7F6F3]">Clubs</Link>
              <Link href="/tarifs" className="transition-colors duration-150 hover:text-[#F7F6F3]">Tarifs</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F7F6F3]">Ressources</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#888888]">
              <Link href="/centre-aide" className="transition-colors duration-150 hover:text-[#F7F6F3]">Centre d’aide</Link>
              <Link href="/blog" className="transition-colors duration-150 hover:text-[#F7F6F3]">Blog</Link>
              <Link href="/tutoriels-video" className="transition-colors duration-150 hover:text-[#F7F6F3]">Tutoriels vidéo</Link>
              <Link href="/api-integrations" className="transition-colors duration-150 hover:text-[#F7F6F3]">API & intégrations</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#F7F6F3]">Entreprise</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#888888]">
              <Link href="/a-propos" className="transition-colors duration-150 hover:text-[#F7F6F3]">À propos</Link>
              <Link href="/contact" className="transition-colors duration-150 hover:text-[#F7F6F3]">Contact</Link>
              <Link href="/mentions-legales" className="transition-colors duration-150 hover:text-[#F7F6F3]">Mentions légales</Link>
              <Link href="/confidentialite" className="transition-colors duration-150 hover:text-[#F7F6F3]">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
