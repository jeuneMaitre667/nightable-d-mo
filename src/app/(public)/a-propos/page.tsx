import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos | NightTable",
  description: "Découvrez la vision NightTable pour moderniser les réservations en club.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Entreprise</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">À propos</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          NightTable accompagne les établissements premium avec une plateforme dédiée à la réservation, au pilotage et à la relation client.
        </p>
        <div className="mt-8">
          <Link
            href="/demo"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#C9973A] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508] transition-all duration-150 ease-out hover:brightness-105"
          >
            Voir la démo
          </Link>
        </div>
      </div>
    </main>
  );
}
