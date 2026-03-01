// Component: ClubSlugPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: public club detail landing page

import Link from "next/link";

import type { ReactElement } from "react";

type ClubPageProps = {
  params: Promise<{ slug: string }>;
};

type ClubData = {
  name: string;
  city: string;
  description: string;
  heroImage: string;
  vibes: string[];
  tonight: {
    title: string;
    time: string;
    price: string;
  }[];
};

const clubs: Record<string, ClubData> = {
  "l-arc-paris": {
    name: "L'Arc Paris",
    city: "Paris",
    description:
      "Adresse iconique des nuits parisiennes. Positionnement premium, line-ups internationaux et service table très haut niveau.",
    heroImage:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80",
    vibes: ["Hip-Hop", "Open Format", "VIP"],
    tonight: [
      { title: "Fashion Week Afterparty", time: "23:30", price: "Min. conso 1500€" },
      { title: "Black Room Signature", time: "00:45", price: "Min. conso 1200€" },
    ],
  },
  raspoutine: {
    name: "Raspoutine",
    city: "Paris",
    description:
      "Univers glamour, house élégante et expérience club immersive. Idéal pour une soirée premium à forte ambiance.",
    heroImage:
      "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1600&q=80",
    vibes: ["House", "Afro House", "Premium"],
    tonight: [
      { title: "Midnight Society", time: "23:45", price: "Min. conso 900€" },
      { title: "After Midnight Session", time: "01:00", price: "Min. conso 1000€" },
    ],
  },
};

const fallbackClub: ClubData = {
  name: "Club NightTable",
  city: "Paris",
  description:
    "Découvrez les meilleurs clubs partenaires NightTable et réservez votre table VIP en quelques taps.",
  heroImage:
    "https://images.unsplash.com/photo-1571266028243-d220c9b3cca4?auto=format&fit=crop&w=1600&q=80",
  vibes: ["VIP", "House", "Nightlife"],
  tonight: [{ title: "NightTable Live Session", time: "23:59", price: "Min. conso 700€" }],
};

export default async function ClubSlugPage({ params }: ClubPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const club = clubs[slug] ?? fallbackClub;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0A0F2E] to-[#050508] text-[#F7F6F3]">
      <section
        className="relative overflow-hidden border-b border-[#C9973A]/20"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(9,9,11,0.9), rgba(9,9,11,0.35)), url(${club.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">Club Partner · {club.city}</p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">{club.name}</h1>
          <p className="mt-4 max-w-3xl text-[#F7F6F3] md:text-lg">{club.description}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            {club.vibes.map((vibe) => (
              <span key={vibe} className="rounded-full border border-[#C9973A]/25 bg-[#12172B]/70 px-3 py-1.5">
                {vibe}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="nt-btn nt-btn-primary min-h-11 px-5 py-3 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Réserver ma table
            </Link>
            <Link
              href="/demo"
              className="nt-btn nt-btn-secondary min-h-11 px-5 py-3 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
            >
              Voir la démo NightTable
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-semibold">Programmation en avant</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {club.tonight.map((event) => (
            <article key={event.title} className="rounded-2xl border border-[#C9973A]/20 bg-[#12172B] p-5">
              <p className="text-sm text-[#888888]">{club.name}</p>
              <h3 className="mt-1 text-xl font-semibold">{event.title}</h3>
              <p className="mt-1 text-[#888888]">{event.time}</p>
              <p className="mt-3 inline-block rounded-md border border-[#C9973A]/25 bg-[#0A0F2E] px-2 py-1 text-sm">
                {event.price}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
