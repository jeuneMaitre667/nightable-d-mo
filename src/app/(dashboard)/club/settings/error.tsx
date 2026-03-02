"use client";

// Component: ClubSettingsError
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris error state pattern
// NightTable usage: settings route error boundary

import type { ReactElement } from "react";

type ClubSettingsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ClubSettingsError({ error, reset }: ClubSettingsErrorProps): ReactElement {
  return (
    <section className="rounded-xl border border-[#C4567A]/35 bg-[#1A1D24] p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-[#C4567A]">Erreur paramètres</p>
      <h2 className="mt-2 text-lg font-semibold text-[#F7F6F3] md:text-xl">Impossible de charger les paramètres</h2>
      <p className="mt-3 text-sm text-[#888888]">
        {error.message || "Une erreur inattendue est survenue pendant le chargement des paramètres."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-12 rounded-lg border border-[#C9973A]/40 px-5 py-2 text-sm font-semibold text-[#C9973A] transition-all duration-200 ease-in-out hover:bg-[#C9973A]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1D24]"
      >
        Réessayer
      </button>
    </section>
  );
}
