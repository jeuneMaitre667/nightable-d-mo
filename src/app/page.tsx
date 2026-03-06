// Component: HomePage
// Reference: component.gallery/components/hero + component.gallery/components/card
// Inspired by: Soho House public marketing pages
// NightTable usage: public landing page — acquisition + routing


// Nouvelle landing page NightTable inspirée Velvet Rope, branding NightTable, fetch clubs Supabase, structure et styles strictement conformes au prompt.
// Tous les sous-composants sont inclus dans ce fichier pour respecter la contrainte.


import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les meilleures tables des clubs parisiens, sans friction | NightTable",
  description: "Découvrez une sélection de clubs haut de gamme à Paris et réservez votre table en temps réel. Accès VIP garanti.",
  openGraph: {
    title: "NightTable Paris — Réservation table VIP",
    description: "Plateforme premium de réservation de tables VIP pour clubs à Paris.",
    images: [
      "/demo/nt-landing-hero.webp",
    ],
    type: "website",
  },
};


// Fetch clubs from Supabase (Server Component)
async function getClubs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select("id, name, slug, district, genres, min_spend, cover_url, arrival_time, capacity")
    .order("priority", { ascending: false })
    .limit(3); // 3 cards per row, like the reference
  if (error) return [];
  return data || [];
}

export default async function HomePage() {
  const clubs = await getClubs();
  const today = new Date();
  const formattedDate = format(today, "EEE d MMM", { locale: fr });

  return (
    <main className="bg-[#0B0B12] text-[#E6E6F0] font-sans min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B12]/80 backdrop-blur border-b border-[#23233A]/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-base shadow-[0_0_12px_rgba(124,58,237,0.35)] group-hover:brightness-110 transition">NT</div>
            <span className="text-base font-bold tracking-tight text-white group-hover:text-[#7C3AED] transition">NightTable</span>
          </Link>
          <nav>
            <Link href="/login" className="text-xs font-medium text-[#E6E6F0] hover:text-[#A78BFA] transition">Se connecter</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex flex-col justify-center items-center min-h-[60vh] pt-28 pb-10 px-6 overflow-hidden">
        <Image
          src="/demo/nt-landing-hero.webp"
          alt="Ambiance club premium Paris"
          fill
          priority
          className="object-cover object-center -z-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#0B0B12]/80 to-[#7C3AED]/20 -z-10" />
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#18182A] text-[#A78BFA] text-[11px] font-semibold uppercase tracking-widest">Réservez vos tables VIP en un clic</span>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-2 drop-shadow-[0_0_12px_rgba(124,58,237,0.25)]">Les meilleures tables des clubs premiums, sans friction.</h1>
          <p className="text-sm md:text-base text-[#B5B5C3] mb-6">Découvrez une sélection de clubs haut de gamme et réservez votre table VIP en temps réel, comme sur Shotgun mais pensée pour la nuit.</p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-center">
            <Link href="/clubs" className="px-6 py-2 rounded-md bg-[#7C3AED] text-white font-semibold text-sm shadow-[0_0_12px_rgba(124,58,237,0.25)] hover:bg-[#6D28D9] transition">Trouver un club ce soir</Link>
            <Link href="/clubs" className="px-6 py-2 rounded-md border border-[#7C3AED] text-[#7C3AED] font-semibold text-sm bg-transparent hover:bg-[#18182A] transition">Voir tous les clubs</Link>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="w-full flex justify-center px-4 -mt-8 z-10 relative">
        <form action="/clubs" className="flex items-center gap-2 bg-[#18182A] border border-[#23233A] rounded-xl shadow-lg px-4 py-2 w-full max-w-2xl">
          <div className="flex flex-col">
            <label className="text-[10px] text-[#71717A] font-medium mb-0.5">Ville</label>
            <input type="text" value="Paris, France" readOnly className="bg-transparent text-[#E6E6F0] font-semibold outline-none border-none p-0 text-xs" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-[#71717A] font-medium mb-0.5">Date</label>
            <input type="text" value={formattedDate} readOnly className="bg-transparent text-[#E6E6F0] font-semibold outline-none border-none p-0 text-xs" />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] text-[#71717A] font-medium mb-0.5">Personnes</label>
            <input type="text" value="4 personnes · 1 table" readOnly className="bg-transparent text-[#E6E6F0] font-semibold outline-none border-none p-0 text-xs" />
          </div>
          <button type="submit" className="ml-2 flex items-center justify-center h-8 w-8 rounded-full bg-[#7C3AED] hover:bg-[#A78BFA] transition shadow-[0_0_8px_rgba(124,58,237,0.25)]">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="8.5" cy="8.5" r="7.5" stroke="#fff" strokeWidth="2"/><path d="M16 16L13.5 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </form>
      </section>

      {/* CLUBS GRID */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mt-14">
        <h2 className="text-base font-semibold text-[#E6E6F0] mb-2">Clubs premiums à Paris</h2>
        <p className="text-xs text-[#A1A1B5] mb-6">Sélection inspirée de Shotgun optimisée pour la réservation de tables.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {clubs.map((club, i) => (
            <div key={club.id} className="rounded-xl bg-[#18182A] border border-[#23233A] shadow-[0_2px_16px_rgba(124,58,237,0.08)] overflow-hidden flex flex-col">
              <div className="relative h-40 w-full">
                <Image
                  src={club.cover_url || `/demo/nt-landing-hero.webp`}
                  alt={club.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i === 0}
                />
                <span className="absolute top-2 left-2 bg-[#7C3AED]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow">{i === 0 ? "Top club Paris" : i === 1 ? "Rooftop · Vue tour Eiffel" : "Nouveau · Sélection"}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#E6E6F0] truncate max-w-[70%]">{club.name}</h3>
                  <span className="flex items-center gap-1 text-xs text-[#A1A1B5] font-medium">
                    <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 11.5l-4.09 2.15.78-4.55L.18 5.85l4.57-.66L7 1l2.25 4.19 4.57.66-3.31 3.25.78 4.55z" fill="#A78BFA"/></svg>
                    4.{8 - i}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-[#A1A1B5]">
                  <span>{club.district}</span>
                  <span>·</span>
                  <span>{club.genres?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#A1A1B5]">{club.capacity} pers</span>
                  <span className="text-xs text-[#A1A1B5]">Arrivée avant {club.arrival_time || "1h30"}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#A1A1B5]">Minimum table <span className="font-semibold text-[#A78BFA]">{club.min_spend}€</span></span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Link href={`/clubs/${club.slug}`} className="text-xs font-semibold text-[#7C3AED] hover:underline">Voir les tables</Link>
                  <Link href={`/clubs/${club.slug}/reserve`} className="text-xs font-semibold text-[#A78BFA] hover:underline">Réserver une table</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 md:px-8 mt-20 mb-16">
        <h2 className="text-base font-semibold text-[#E6E6F0] mb-4">Comment ça marche ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-[#18182A] border border-[#23233A] p-6">
            <div className="mb-3 flex items-center justify-center h-10 w-10 rounded-full bg-[#7C3AED]/20">
              <span className="text-lg font-bold text-[#A78BFA]">1</span>
            </div>
            <h3 className="text-sm font-semibold mb-1">Choisissez votre ville et votre date</h3>
            <p className="text-xs text-[#A1A1B5]">Filtrez parmi les clubs premiums disponibles ce soir, ce week-end ou pour une date précise.</p>
          </div>
          <div className="rounded-xl bg-[#18182A] border border-[#23233A] p-6">
            <div className="mb-3 flex items-center justify-center h-10 w-10 rounded-full bg-[#7C3AED]/20">
              <span className="text-lg font-bold text-[#A78BFA]">2</span>
            </div>
            <h3 className="text-sm font-semibold mb-1">Sélectionnez votre table VIP</h3>
            <p className="text-xs text-[#A1A1B5]">Capacité, emplacement, minimum de dépense et bouteilles incluses : tout est clair avant de réserver.</p>
          </div>
          <div className="rounded-xl bg-[#18182A] border border-[#23233A] p-6">
            <div className="mb-3 flex items-center justify-center h-10 w-10 rounded-full bg-[#7C3AED]/20">
              <span className="text-lg font-bold text-[#A78BFA]">3</span>
            </div>
            <h3 className="text-sm font-semibold mb-1">Confirmez et arrivez comme un VIP</h3>
            <p className="text-xs text-[#A1A1B5]">Votre réservation est synchronisée avec le club. Vous êtes attendu, comme un client régulier.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#23233A] bg-[#0B0B12] py-8 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A1A1B5]">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm">NT</div>
            <span>NightTable — Outil de réservation de tables clubs premiums.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">À propos</a>
            <a href="#" className="hover:underline">Produit</a>
            <a href="#" className="hover:underline">Support</a>
            <a href="#" className="hover:underline">Mentions légales</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Sous-composants internes pour la landing
function TrustBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#1A1A24] text-[#7C3AED] text-xs font-semibold uppercase tracking-widest border border-[#2A2A35]">
      {children}
    </span>
  );
}

function FilterPill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button type="button" tabIndex={-1} className={`px-4 py-1 rounded-full text-xs font-semibold transition border ${active ? "bg-[#7C3AED] text-white border-[#7C3AED]" : "bg-[#1A1A24] text-[#71717A] border-[#2A2A35]"}`}>{children}</button>
  );
}

function ClubCard({ club }: { club: any }) {
  return (
    <Link href={`/clubs/${club.slug}`} className="group relative aspect-video overflow-hidden rounded-xl border border-[#2A2A35] bg-[#111118] shadow-lg transition-all duration-200 hover:border-[#7C3AED] hover:shadow-[0_0_20px_rgba(124,58,237,0.18)]">
      <Image
        src={club.cover_url || "/demo/nt-landing-hero.webp"}
        alt={club.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 rounded-full bg-[#7C3AED] text-white text-xs font-semibold shadow">Top club · {club.district || "Paris"}</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold mb-1 drop-shadow-[0_0_10px_rgba(124,58,237,0.18)]">{club.name}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-[#B5B5C3] mb-1">
          <span>{club.genres}</span>
          <span>· {club.capacity || 6} pers/table</span>
          <span>· Arrivée avant {club.arrival_time || "1h"}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#7C3AED] font-semibold">Min. {club.min_spend ? club.min_spend + "€" : "—"}</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-[#1A1A24] text-[#7C3AED] text-[11px] font-semibold uppercase">Confirmation instantanée</span>
        </div>
        <div className="mt-3">
          <span className="inline-block px-4 py-2 rounded-md bg-[#7C3AED] text-white font-semibold text-xs shadow hover:bg-[#6D28D9] transition">Voir les tables</span>
        </div>
      </div>
    </Link>
  );
}

function StepCard({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start bg-[#09090B] rounded-xl border border-[#2A2A35] p-6 shadow">
      <span className="mb-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#7C3AED] text-white font-bold text-base">{num}</span>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-[#B5B5C3] text-sm">{children}</p>
    </div>
  );
}

function ValueCard({ title, subtitle, bullets }: { title: string; subtitle: string; bullets: string[] }) {
  return (
    <div className="bg-[#111118] rounded-xl border border-[#2A2A35] p-8 shadow flex flex-col gap-3">
      <span className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">{subtitle}</span>
      <h5 className="text-xl font-bold mb-3">{title}</h5>
      <ul className="flex flex-col gap-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-[#FAFAFA]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#7C3AED]" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
