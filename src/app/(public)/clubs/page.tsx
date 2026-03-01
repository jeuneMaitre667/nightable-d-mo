// Component: ClubsPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: public discovery grid of partner clubs

import Link from "next/link";

import type { ReactElement } from "react";

type ClubCard = {
  slug: string;
  name: string;
  area: string;
  vibe: string;
  minConsumption: string;
  image: string;
};

const clubs: ClubCard[] = [
  {
    slug: "l-arc-paris",
    name: "L'Arc Paris",
    area: "Champs-Élysées",
    vibe: "Hip-Hop · Open Format",
    minConsumption: "À partir de 1200€",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "raspoutine",
    name: "Raspoutine",
    area: "8e",
    vibe: "House · Afro House",
    minConsumption: "À partir de 900€",
    image: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "bridge-club",
    name: "Bridge Club",
    area: "Pont Alexandre III",
    vibe: "Urban · House",
    minConsumption: "À partir de 650€",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "manko",
    name: "Manko",
    area: "Avenue Montaigne",
    vibe: "Latin House · Premium",
    minConsumption: "À partir de 1100€",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function ClubsPage(): ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0A0F2E] to-[#050508] px-4 py-10 text-[#F7F6F3] md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-2xl border border-[#C9973A]/20 bg-gradient-to-br from-[#12172B] via-[#12172B] to-[#0A0F2E] p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Clubs</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Les meilleurs clubs partenaires à Paris</h1>
          <p className="mt-4 max-w-3xl text-[#888888]">
            Sélectionne ton ambiance, ouvre la page club et réserve ta table VIP en quelques taps.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {clubs.map((club) => (
            <article
              key={club.slug}
              className="relative min-h-72 overflow-hidden rounded-2xl border border-[#C9973A]/20"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(9,9,11,0.88), rgba(9,9,11,0.25)), url(${club.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute bottom-0 w-full p-5">
                <p className="text-sm text-[#888888]">{club.area}</p>
                <h2 className="text-2xl font-semibold">{club.name}</h2>
                <p className="mt-1 text-[#F7F6F3]">{club.vibe}</p>
                <p className="mt-2 inline-block rounded-md border border-[#C9973A]/25 bg-[#0A0F2E]/80 px-2 py-1 text-sm">
                  {club.minConsumption}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="nt-btn nt-btn-primary min-h-11 px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                  >
                    Voir le club
                  </Link>
                  <Link
                    href="/reserve"
                    className="nt-btn nt-btn-secondary min-h-11 px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
