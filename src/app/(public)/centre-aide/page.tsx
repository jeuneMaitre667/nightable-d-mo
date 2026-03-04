import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centre d’aide | NightTable",
  description: "Guides et assistance NightTable pour clubs et équipes opérationnelles.",
};

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Ressources</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">Centre d’aide</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Cette page centralisera bientôt la documentation d’utilisation NightTable pour les clubs.
        </p>
        <div className="mt-8">
          <Link
            href="/demo"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-[#C9973A]/40 px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#C9973A] transition-all duration-150 ease-out hover:border-[#C9973A]/70 hover:text-[#E8C96A]"
          >
            Voir la démo
          </Link>
        </div>
      </div>
    </main>
  );
}
