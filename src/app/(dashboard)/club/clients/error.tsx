"use client";

type ClubClientsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ClubClientsError({ error, reset }: ClubClientsErrorProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-[#C4567A]/30 bg-[#12172B] p-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#C4567A]">Clients & VIPs</p>
      <h2 className="mt-3 text-2xl font-semibold text-[#F7F6F3]">Impossible de charger la page</h2>
      <p className="mt-2 text-sm text-[#888888]">{error.message || "Une erreur inattendue est survenue."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 min-h-11 rounded-lg border border-[#C4567A]/45 bg-[#C4567A]/16 px-5 py-2 text-sm font-semibold text-[#F7F6F3] transition-all duration-200 ease-in-out hover:bg-[#C4567A]/26 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
      >
        Réessayer
      </button>
    </section>
  );
}
