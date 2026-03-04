import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | NightTable",
  description: "Contactez l’équipe NightTable pour vos questions commerciales et produit.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Entreprise</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">Contact</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Besoin d’aide ou d’une présentation produit ? Écrivez-nous à
          <span className="text-[#C9973A]"> contact@nighttable.app</span>.
        </p>
      </div>
    </main>
  );
}
