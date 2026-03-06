// Component: HomePage
// Reference: design Velvet Rope — landing premium réservation tables VIP
// NightTable usage: page d'accueil publique, acquisition + routing vers /clubs

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import type { Metadata } from "next";
import { LandingClubsSection } from "@/components/landing/LandingClubsSection";

export const metadata: Metadata = {
  title: "Les meilleures tables des clubs parisiens, sans friction | NightTable",
  description: "Découvrez une sélection de clubs haut de gamme à Paris et réservez votre table en temps réel. Accès VIP garanti.",
  openGraph: {
    title: "NightTable Paris — Réservation table VIP",
    description: "Plateforme premium de réservation de tables VIP pour clubs à Paris.",
    images: ["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80"],
    type: "website",
  },
};

type ClubRow = {
  id: string;
  name: string;
  slug: string;
  district?: string | null;
  genres?: string | string[] | null;
  min_spend?: number | null;
  cover_url?: string | null;
  arrival_time?: string | null;
  capacity?: number | null;
};

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80";

/** Clubs de démo affichés quand la base n’en renvoie aucun (page identique au design). */
const DEMO_CLUBS_FALLBACK: ClubRow[] = [
  {
    id: "demo-1",
    name: "Le Velvet Paris",
    slug: "l-arc-paris",
    district: "Champs-Élysées",
    genres: "House - Hip-hop",
    min_spend: 250,
    cover_url: null,
    arrival_time: "1h30",
    capacity: "2-8",
  },
  {
    id: "demo-2",
    name: "Skyline Club",
    slug: "raspoutine",
    district: "Rooftop - Vue Tour Eiffel",
    genres: "House - Premium",
    min_spend: 320,
    cover_url: null,
    arrival_time: "1h",
    capacity: "3-6",
  },
  {
    id: "demo-3",
    name: "L'Atelier Nuit",
    slug: "bridge-club",
    district: "Paris 8e",
    genres: "Sélection - Premium",
    min_spend: 220,
    cover_url: null,
    arrival_time: "1h30",
    capacity: "3-6",
  },
];

async function getClubs(): Promise<ClubRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("id, name, slug, district, genres, min_spend, cover_url, arrival_time, capacity")
    .order("priority", { ascending: false })
    .limit(3);
  if (error) return DEMO_CLUBS_FALLBACK;
  const list = (data || []) as ClubRow[];
  return list.length > 0 ? list : DEMO_CLUBS_FALLBACK;
}

const HERO_FEATURES = [
  "Clubs vérifiés uniquement",
  "Gestion en temps réel des tables",
  "Confirmation instantanée",
];

export default async function HomePage() {
  const clubs = await getClubs();
  const today = new Date();
  const formattedDate = format(today, "EEE d MMM", { locale: fr });

  return (
    <main className="bg-[#09090B] text-[#FAFAFA] min-h-screen font-sans">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#2A2A35]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(124,58,237,0.4)] group-hover:brightness-110 transition">
              NT
            </div>
            <span className="text-base font-bold tracking-tight text-[#FAFAFA] group-hover:text-[#A78BFA] transition">
              NightTable
            </span>
          </Link>
          <nav>
            <Link
              href="/login"
              className="text-sm font-medium text-[#FAFAFA] hover:text-[#A78BFA] transition"
            >
              Se connecter
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex flex-col justify-center items-center min-h-[62vh] pt-28 pb-12 px-6 overflow-hidden">
        <Image
          src={HERO_IMAGE_URL}
          alt="Ambiance club premium Paris"
          fill
          priority
          className="object-cover object-center -z-10"
          sizes="100vw"
          unoptimized={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[#09090B]/75 to-[#7C3AED]/15 -z-10" />
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block mb-3 px-3 py-1.5 rounded-full bg-[#111118] text-[#A78BFA] text-[11px] font-semibold uppercase tracking-widest border border-[#2A2A35]">
            Réservez vos tables VIP en un clic
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-3 text-[#FAFAFA] drop-shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            Les meilleures tables des clubs premiums, sans friction.
          </h1>
          <p className="text-sm md:text-base text-[#A1A1AA] mb-6 max-w-xl">
            Découvrez une sélection de clubs haut de gamme et réservez votre table VIP en temps réel, comme sur Shotgun mais pensée pour la nuit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
            <Link
              href="/clubs"
              className="px-6 py-3 rounded-lg bg-[#7C3AED] text-white font-semibold text-sm shadow-[0_0_16px_rgba(124,58,237,0.35)] hover:bg-[#6D28D9] transition"
            >
              Trouver un club ce soir
            </Link>
            <Link
              href="/clubs"
              className="px-6 py-3 rounded-lg border border-[#2A2A35] text-[#FAFAFA] font-semibold text-sm bg-transparent hover:bg-[#111118] hover:border-[#7C3AED]/50 transition"
            >
              Voir tous les clubs
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-[#71717A]">
            {HERO_FEATURES.map((label) => (
              <span key={label} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="text-[#7C3AED] shrink-0">
                  <path d="M11.5 4L5.5 10L2.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="w-full flex justify-center px-4 -mt-6 z-10 relative">
        <form
          action="/clubs"
          className="flex flex-wrap items-end gap-4 bg-[#111118] border border-[#2A2A35] rounded-xl shadow-xl px-5 py-4 w-full max-w-3xl"
        >
          <div className="flex flex-col flex-1 min-w-[100px]">
            <label className="text-[10px] text-[#71717A] font-semibold uppercase tracking-wider mb-1">
              Ville
            </label>
            <input
              type="text"
              defaultValue="Paris, France"
              readOnly
              className="bg-transparent text-[#FAFAFA] font-medium outline-none border-none p-0 text-sm"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[100px]">
            <label className="text-[10px] text-[#71717A] font-semibold uppercase tracking-wider mb-1">
              Date
            </label>
            <input
              type="text"
              value={formattedDate}
              readOnly
              className="bg-transparent text-[#FAFAFA] font-medium outline-none border-none p-0 text-sm"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[120px]">
            <label className="text-[10px] text-[#71717A] font-semibold uppercase tracking-wider mb-1">
              Personnes
            </label>
            <input
              type="text"
              defaultValue="4 personnes - 1 table"
              readOnly
              className="bg-transparent text-[#FAFAFA] font-medium outline-none border-none p-0 text-sm"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-[0_0_12px_rgba(124,58,237,0.3)] shrink-0"
            aria-label="Rechercher"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 18 18" aria-hidden>
              <circle cx="8.5" cy="8.5" r="7.5" stroke="#fff" strokeWidth="2" />
              <path d="M16 16L13.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </section>

      {/* CLUBS — client section with filter pills */}
      <LandingClubsSection clubs={clubs} />

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mt-20 mb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#FAFAFA]">Comment ça marche ?</h2>
          <p className="text-sm text-[#A1A1AA] max-w-md">
            En quelques étapes, vous trouvez le club idéal, choisissez votre table et recevez votre confirmation instantanément.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "ÉTAPE 1",
              title: "Choisissez votre ville et votre date",
              desc: "Filtrez parmi les clubs premiums disponibles ce soir, ce week-end ou pour une date précise.",
            },
            {
              step: "ÉTAPE 2",
              title: "Sélectionnez votre table VIP",
              desc: "Capacité, emplacement, minimum de dépense et bouteilles incluses : tout est clair avant de réserver.",
            },
            {
              step: "ÉTAPE 3",
              title: "Confirmez et arrivez comme un VIP",
              desc: "Votre réservation est synchronisée avec le club. Vous êtes attendu, comme un client régulier.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-xl bg-[#111118] border border-[#2A2A35] p-6 transition-all hover:border-[#7C3AED]/20"
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7C3AED] mb-3 block">
                {step}
              </span>
              <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">{title}</h3>
              <p className="text-sm text-[#A1A1AA]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#2A2A35] bg-[#09090B] py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
            <div className="flex items-start gap-3 max-w-sm">
              <div className="h-8 w-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shrink-0">
                NT
              </div>
              <p className="text-xs text-[#71717A] leading-relaxed">
                © NightTable — Outil de réservation de tables pour clubs premiums. Inspiré par l&apos;expérience Shotgun, pensé pour la nuit.
              </p>
            </div>
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-8" aria-label="Pied de page">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">À propos</p>
                <ul className="space-y-2 text-sm text-[#FAFAFA]">
                  <li><Link href="/a-propos" className="hover:text-[#A78BFA] transition">Notre vision</Link></li>
                  <li><Link href="/clubs" className="hover:text-[#A78BFA] transition">Clubs partenaires</Link></li>
                  <li><Link href="/contact" className="hover:text-[#A78BFA] transition">Presse</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Produit</p>
                <ul className="space-y-2 text-sm text-[#FAFAFA]">
                  <li><Link href="/clubs" className="hover:text-[#A78BFA] transition">Réservation de tables</Link></li>
                  <li><Link href="/tarifs" className="hover:text-[#A78BFA] transition">Démo</Link></li>
                  <li><Link href="/a-propos" className="hover:text-[#A78BFA] transition">Fonctionnalités</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Support</p>
                <ul className="space-y-2 text-sm text-[#FAFAFA]">
                  <li><Link href="/centre-aide" className="hover:text-[#A78BFA] transition">FAQ</Link></li>
                  <li><Link href="/centre-aide" className="hover:text-[#A78BFA] transition">Centre d&apos;aide</Link></li>
                  <li><Link href="/contact" className="hover:text-[#A78BFA] transition">Contact</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] mb-3">Légal</p>
                <ul className="space-y-2 text-sm text-[#FAFAFA]">
                  <li><Link href="/mentions-legales" className="hover:text-[#A78BFA] transition">Mentions légales</Link></li>
                  <li><Link href="/tarifs" className="hover:text-[#A78BFA] transition">Conditions générales</Link></li>
                  <li><Link href="/confidentialite" className="hover:text-[#A78BFA] transition">Politique de confidentialité</Link></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}

