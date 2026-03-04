import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité | NightTable",
  description: "Politique de confidentialité NightTable.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Entreprise</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">Confidentialité</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Cette page accueillera la politique de confidentialité et de traitement des données NightTable.
        </p>
      </div>
    </main>
  );
}
