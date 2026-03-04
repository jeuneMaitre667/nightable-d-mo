import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API & intégrations | NightTable",
  description: "Connectez NightTable à vos outils métier via API et intégrations.",
};

export default function ApiIntegrationsPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Ressources</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">API & intégrations</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Les informations API publiques seront publiées ici pour faciliter les intégrations partenaires.
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-[#C9973A]/40 px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#C9973A] transition-all duration-150 ease-out hover:border-[#C9973A]/70 hover:text-[#E8C96A]"
          >
            Contacter l’équipe
          </Link>
        </div>
      </div>
    </main>
  );
}
