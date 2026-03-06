"use client";
import { Button } from '@/components/ui/button';

// Component: ClubReservationsError
// Reference: component.gallery/components/card
// Inspired by: Shopify Polaris error state pattern
// NightTable usage: reservations route error fallback

type ClubReservationsErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ClubReservationsError({ error, reset }: ClubReservationsErrorProps): React.JSX.Element {
  return (
    <section className="rounded-xl border border-[#C4567A]/35 bg-[#1A1D24] p-8">
      <p className="text-xs uppercase tracking-[0.18em] text-[#C4567A]">Erreur réservations</p>
      <h2 className="mt-2 text-lg font-semibold text-[#F7F6F3] md:text-xl">Impossible de charger les réservations</h2>
      <p className="mt-3 text-sm text-[#888888]">
        {error.message || "Une erreur inattendue est survenue pendant le chargement des réservations."}
      </p>
      <Button variant="outline" className="mt-6 min-h-12 px-5 text-sm font-semibold" onClick={reset}>
        Réessayer
      </Button>
    </section>
  );
}
