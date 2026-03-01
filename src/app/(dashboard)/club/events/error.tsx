"use client";

import type { ReactElement } from "react";

type ClubEventsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ClubEventsError({ error, reset }: ClubEventsErrorProps): ReactElement {
  return (
    <section className="rounded-xl border border-[#C4567A]/35 bg-[#12172B] p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Erreur événements</p>
      <h2 className="nt-heading mt-2 text-3xl text-[#F7F6F3]">Impossible de charger les événements</h2>
      <p className="mt-3 text-sm text-[#888888]">
        {error.message || "Une erreur inattendue est survenue pendant le chargement des événements."}
      </p>
      <button type="button" onClick={reset} className="nt-btn nt-btn-secondary mt-6 px-5 py-2.5">
        Réessayer
      </button>
    </section>
  );
}
