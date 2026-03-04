import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | NightTable",
  description: "Actualités produit et bonnes pratiques pour les clubs partenaires NightTable.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#050508] px-6 py-16 text-[#F7F6F3]">
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.12em] text-[#888888]">Ressources</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-tight">Blog</h1>
        <p className="mt-4 text-base leading-relaxed text-[#888888]">
          Le blog NightTable sera bientôt disponible avec des contenus dédiés à l’exploitation club.
        </p>
        <div className="mt-8">
          <Link
            href="/register?role=club"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-[#C9973A] px-8 py-[14px] text-sm font-semibold uppercase tracking-[0.08em] text-[#050508] transition-all duration-150 ease-out hover:brightness-105"
          >
            Créer un compte club
          </Link>
        </div>
      </div>
    </main>
  );
}
