// Component: HomePage
// Reference: component.gallery/components/hero + component.gallery/components/card
// Inspired by: Soho House public marketing pages
// NightTable usage: public landing page — acquisition + routing

import Image from "next/image";
import Link from "next/link";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Réserver une table VIP à Paris | NightTable",
  description:
    "NightTable centralise réservation tables VIP, paiement sécurisé et accès aux clubs les plus exclusifs de Paris.",
  openGraph: {
    title: "NightTable Paris — Réservation table VIP",
    description:
      "Plateforme premium de réservation de tables VIP pour clubs à Paris.",
    images: [
      "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1600&q=80",
    ],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050508",
};

const placeholderBlurDataUrl =
  "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const partnerClubs = [
  {
    name: "Raspoutine",
    city: "Paris 8e",
    href: "/clubs/raspoutine",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bridge Club",
    city: "Paris 8e",
    href: "/clubs/bridge-club",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    name: "Manko",
    city: "Paris 8e",
    href: "/clubs/manko",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#050508] text-[#F7F6F3]">
      <header className="absolute left-0 right-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.08em] text-[#F7F6F3]">
            NIGHTTABLE
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/login" className="text-[#F7F6F3]/80 transition-colors duration-150 hover:text-[#F7F6F3]">
              Connexion
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-20 pt-28 md:pb-24">
        <Image
          src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1800&q=80"
          alt="Ambiance premium dans un club parisien"
          fill
          priority
          placeholder="blur"
          blurDataURL={placeholderBlurDataUrl}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,8,0.3)_0%,rgba(5,5,8,0.85)_100%)]" />

        <div className="relative mx-auto flex w-full max-w-7xl justify-between gap-8">
          <div className="max-w-3xl">
            <h1 className="nt-heading text-[40px] font-light leading-[1.1] tracking-[-0.02em] sm:text-[48px] md:text-[72px]">
              La meilleure table
              <br />
              de Paris vous attend.
            </h1>
            <p className="mt-4 max-w-[480px] text-[18px] leading-relaxed text-[#F7F6F3]/70">
              Réservez en quelques instants, arrivez avec priorité, vivez une
              expérience conçue pour les nuits d’exception.
            </p>
            <div className="mt-8">
              <Link
                href="/reserve"
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#C9973A] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508] transition-all duration-150 ease-out hover:brightness-105"
              >
                Réserver maintenant
              </Link>
            </div>
          </div>

          <Link
            href="#clubs-partenaires"
            aria-label="Descendre vers les clubs partenaires"
            className="hidden items-end pb-2 text-[#F7F6F3]/40 transition-opacity duration-150 hover:text-[#F7F6F3]/70 md:inline-flex"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Link>
        </div>
      </section>

      <section id="clubs-partenaires" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-8 md:mb-10">
          <p className="text-[11px] uppercase tracking-[0.04em] text-[#888888]">
            Clubs partenaires
          </p>
          <h2 className="nt-heading mt-3 text-[36px] font-light leading-[1.1] tracking-[-0.02em] md:text-[48px]">
            Les adresses les plus convoitées
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {partnerClubs.map((club) => (
            <Link
              key={club.name}
              href={club.href}
              className="group relative aspect-video overflow-hidden rounded-[4px] border border-[#C9973A]/15"
            >
              <Image
                src={club.image}
                alt={`${club.name} à ${club.city}`}
                fill
                placeholder="blur"
                blurDataURL={placeholderBlurDataUrl}
                className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#050508]/0 transition-all duration-[400ms] ease-out group-hover:bg-[#050508]/60" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-[#F7F6F3] opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100">
                <p className="nt-heading text-2xl font-light leading-tight">{club.name}</p>
                <p className="mt-1 text-sm text-[#F7F6F3]/75">{club.city}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.08em] text-[#C9973A]">
                  Voir les tables
                </p>
              </div>
            </Link>
          ))}
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
            <p className="mt-10 text-xs text-[#888888]">© 2026 NightTable. Tous droits réservés.</p>
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
