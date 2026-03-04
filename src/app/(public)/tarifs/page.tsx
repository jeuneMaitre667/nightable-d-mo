import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs | NightTable",
  description: "Découvrez les offres NightTable pour clubs et établissements premium.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Produit</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">Tarifs</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Les plans NightTable sont adaptés à la taille de votre établissement et à votre volume de réservations.
        </p>
        <div className="mt-8">
          <Link
            href="/register?role=club"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#C9973A] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508] transition-all duration-150 ease-out hover:brightness-105"
          >
            Démarrer avec NightTable
          </Link>
        </div>
      </div>
    </main>
  );
}
