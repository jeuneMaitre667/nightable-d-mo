"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LandingFilterPills } from "./LandingFilterPills";

export type ClubCard = {
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

const OVERLAY_LABELS = ["Top club - Paris 8e", "Rooftop - Vue Tour Eiffel", "Nouveau - Sélection"];

/** Images de démo pour les cartes clubs (fallback quand cover_url est vide). Alignées avec les overlay labels. */
const DEMO_CLUB_IMAGES = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80", // ambiance violette / premium
  "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=800&q=80", // rooftop / vue
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80", // doré / atelier nuit
];

export function LandingClubsSection({ clubs }: { clubs: ClubCard[] }) {
  const [filter, setFilter] = useState<"tonight" | "weekend">("tonight");

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 mt-14">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#FAFAFA] mb-1">
            Clubs premiums à Paris
          </h2>
          <p className="text-sm text-[#A1A1AA]">
            Sélection inspirée de Shotgun optimisée pour la réservation de tables
          </p>
        </div>
        <LandingFilterPills value={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clubs.map((club, i) => (
          <article
            key={club.id}
            className="rounded-xl bg-[#111118] border border-[#2A2A35] overflow-hidden flex flex-col transition-all hover:border-[#7C3AED]/30 hover:shadow-[0_4px_24px_rgba(124,58,237,0.08)]"
          >
            <div className="relative h-44 w-full bg-[#111118]">
              <Image
                src={club.cover_url || DEMO_CLUB_IMAGES[i % DEMO_CLUB_IMAGES.length]}
                alt={club.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority={i === 0}
                unoptimized={!club.cover_url}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-[#FAFAFA] text-[11px] font-medium px-2.5 py-1 rounded-md">
                {OVERLAY_LABELS[i] ?? "Club premium"}
              </span>
            </div>
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-[#FAFAFA] truncate">{club.name}</h3>
                <span className="flex items-center gap-1 text-xs text-[#A1A1AA] shrink-0">
                  <svg width="14" height="14" fill="none" viewBox="0 0 14 14" aria-hidden>
                    <path
                      d="M7 11.5l-4.09 2.15.78-4.55L.18 5.85l4.57-.66L7 1l2.25 4.19 4.57.66-3.31 3.25.78 4.55z"
                      fill="#A78BFA"
                    />
                  </svg>
                  4.{8 - i}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mb-3">
                {[club.district, Array.isArray(club.genres) ? club.genres.join(" - ") : club.genres ?? ""]
                  .filter(Boolean)
                  .join(" - ")}
              </p>
              <ul className="space-y-1.5 text-[11px] text-[#A1A1AA] mb-3">
                <li className="flex items-center gap-2">
                  <span className="text-[#7C3AED]" aria-hidden>👤</span>
                  {club.capacity ?? "—"} pers. par table
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#7C3AED]" aria-hidden>🕐</span>
                  Arrivée avant {club.arrival_time || "1h30"}
                </li>
                <li className="flex items-center gap-2">Confirmation immédiate</li>
              </ul>
              <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#2A2A35]">
                <span className="text-sm font-bold text-[#FAFAFA]">
                  Minimum table {club.min_spend ?? "—"}€
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/clubs/${club.slug}`}
                    className="text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition"
                  >
                    Voir les tables →
                  </Link>
                  <Link
                    href={`/clubs/${club.slug}/reserve`}
                    className="text-xs font-semibold text-[#7C3AED] hover:text-[#A78BFA] transition"
                  >
                    Réserver une table →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-4 text-xs text-[#71717A]">
        Les disponibilités, minimums de dépense et plans de tables sont synchronisés en temps réel.
      </p>
    </section>
  );
}
