import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réserver une table VIP à Paris | NightTable",
  description:
    "NightTable centralise réservation tables VIP, paiement sécurisé, gestion club et performance promoteurs.",
  openGraph: {
    title: "NightTable Paris",
    description:
      "Plateforme premium de réservation de tables VIP pour clubs à Paris.",
    images: [
      "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1600&q=80",
    ],
    type: "website",
  },
};

const featuredEvents = [
  {
    title: "Midnight Society",
    club: "Raspoutine",
    date: "Sam 07 Mars · 23:45",
    price: "Min. conso 900€",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Noir Signature",
    club: "Bridge Club",
    date: "Sam 07 Mars · 23:00",
    price: "Min. conso 650€",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Velvet Closing",
    club: "Manko",
    date: "Dim 08 Mars · 23:59",
    price: "Min. conso 1100€",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  },
];

const valuePillars = [
  "Réservation table VIP en quelques taps",
  "Prépaiement sécurisé Stripe anti no-show",
  "Attribution promoteur trackée automatiquement",
  "Dashboard club en temps réel",
  "Parcours premium clients & femmes validées",
  "IA concierge NightTable",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050508] text-[#F7F6F3]">
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="overflow-hidden rounded-3xl border border-[#C9973A]/20 bg-gradient-to-br from-[#0A0F2E] via-[#12172B] to-[#0A0F2E] p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Paris</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold text-[#F7F6F3] md:text-6xl">
            Le standard premium pour réserver une table VIP en club.
          </h1>
          <p className="mt-5 max-w-3xl text-[#888888] md:text-lg">
            NightTable connecte clients, clubs, promoteurs et parcours VIP dans une seule plateforme:
            découverte événements, paiement sécurisé, opérations club et performance commerciale.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {valuePillars.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#C9973A]/20 bg-[#050508]/70 px-3 py-1.5 text-[#F7F6F3]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-5 py-3 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
              href="/register"
            >
              Créer un compte
            </Link>
            <Link
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-5 py-3 text-sm text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10"
              href="/login"
            >
              Connexion
            </Link>
            <Link
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/20 px-5 py-3 text-sm text-[#F7F6F3] transition-all duration-200 ease-in-out hover:border-[#C9973A]/40"
              href="/demo"
            >
              Voir la démo complète
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#F7F6F3]">Événements en avant</h2>
          <Link href="/clubs" className="text-sm text-[#C9973A] underline underline-offset-4">
            Voir les clubs
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={event.title}
              className="relative min-h-80 overflow-hidden rounded-2xl border border-[#C9973A]/15"
            >
              <Image
                src={event.image}
                alt={`${event.title} au ${event.club}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/55 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <p className="text-sm text-[#888888]">{event.club}</p>
                <h3 className="text-xl font-semibold text-[#F7F6F3]">{event.title}</h3>
                <p className="mt-1 text-sm text-[#F7F6F3]">{event.date}</p>
                <p className="mt-2 inline-block rounded-md border border-[#C9973A]/20 bg-[#050508]/75 px-2 py-1 text-sm text-[#C9973A]">
                  {event.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Pour les clubs</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#F7F6F3]">Pilote ton opérationnel de soirée</h3>
          <p className="mt-2 text-[#888888]">
            Gère événements, tables, réservations, promoteurs et performance dans un seul cockpit.
          </p>
          <Link
            href="/dashboard/club"
            className="mt-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#C9973A]/40 px-4 py-2 text-sm font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10"
          >
            Explorer le dashboard club
          </Link>
        </div>

        <div className="rounded-2xl border border-[#C9973A]/15 bg-[#12172B] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Pour les clients</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#F7F6F3]">Réserve vite, vis une expérience premium</h3>
          <p className="mt-2 text-[#888888]">
            Découvre les meilleures nuits parisiennes, sécurise ta table et partage ton expérience.
          </p>
          <Link
            href="/dashboard/client"
            className="mt-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110"
          >
            Voir l’expérience client
          </Link>
        </div>
      </section>
    </main>
  );
}
