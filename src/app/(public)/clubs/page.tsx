// Component: ClubsPage
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris pattern
// NightTable usage: public discovery grid of partner clubs

import ClubsPageClient from './ClubsPageClient';

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
  return <ClubsPageClient clubs={clubs} />;
}
