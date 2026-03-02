"use client";

import { useEffect } from "react";

export default function VipDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[VipDashboardError]", error);
  }, [error]);

  return (
    <section className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Femme VIP</p>
      <h1 className="nt-heading mt-2 text-2xl text-[#F7F6F3]">Impossible de charger l’espace</h1>
      <p className="mt-3 text-sm text-[#888888]">
        Une erreur temporaire est survenue. Vous pouvez réessayer immédiatement.
      </p>
      <button
        type="button"
        onClick={reset}
        className="nt-btn nt-btn-secondary mt-5 min-h-11 px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
      >
        Réessayer
      </button>
    </section>
  );
}
