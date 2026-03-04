// Component: ClubSlugPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: public club detail landing page

import { createClient } from "@/lib/supabase/server";
import ClubSlugPageClient from "./ClubSlugPageClient";

import type { ReactElement } from "react";

export const dynamic = "force-dynamic";

type ClubPageProps = {
  params: Promise<{ slug: string }>;
};

type ClubData = {
  name: string;
  city: string;
  description: string;
  heroImage: string;
  vibes: string[];
  ambiencePhotos?: string[];
  tonight: {
    title: string;
    time: string;
    price: string;
  }[];
};

type PublicClubRow = {
  id: string;
  slug: string | null;
};

type PublicEventRow = {
  id: string;
  title: string;
  date: string;
  start_time: string;
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
    ambiencePhotos: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
    ],
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
    ambiencePhotos: [
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80",
    ],
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
  ambiencePhotos: [
    "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
  ],
  tonight: [{ title: "NightTable Live Session", time: "23:59", price: "Min. conso 700€" }],
};

export default async function ClubSlugPage({ params }: ClubPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const supabase = await createClient();
  const club = clubs[slug] ?? fallbackClub;

  const { data: clubProfile } = await supabase
    .from("club_profiles")
    .select("id,slug")
    .eq("slug", slug)
    .maybeSingle();

  const typedClubProfile = (clubProfile ?? null) as PublicClubRow | null;

  const { data: publishedEvents } = typedClubProfile?.id
    ? await supabase
        .from("events")
      .select("id,title,date,start_time")
        .eq("club_id", typedClubProfile.id)
        .eq("status", "published")
        .order("date", { ascending: true })
        .limit(2)
    : { data: [] as PublicEventRow[] };

  const typedPublishedEvents = (publishedEvents ?? []) as PublicEventRow[];
  const programItems = typedPublishedEvents.length > 0
    ? typedPublishedEvents.map((eventItem) => ({
        title: eventItem.title,
        dateLabel: eventItem.date,
        time: eventItem.start_time.slice(0, 5),
        price: "selon table",
        href: `/clubs/${slug}/events/${eventItem.id}`,
      }))
    : club.tonight.map((eventItem) => ({
        ...eventItem,
        dateLabel: new Date().toISOString().slice(0, 10),
        price: eventItem.price.replace("Min. conso ", ""),
        href: "/reserve",
      }));

  const fallbackPrice = programItems[0]?.price ?? "700€";

  return (
    <ClubSlugPageClient
      clubName={club.name}
      clubCity={club.city}
      clubHeroImage={club.heroImage}
      clubVibes={club.vibes}
      minPriceLabel={fallbackPrice}
      programItems={programItems}
      ambiancePhotos={club.ambiencePhotos ?? []}
    />
  );
}
