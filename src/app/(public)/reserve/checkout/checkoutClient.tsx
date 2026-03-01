"use client";

// Component: CheckoutClient
// Reference: component.gallery/components/accordion
// Inspired by: Shopify Polaris pattern
// NightTable usage: multi-step reservation checkout and payment initialization

import { useMemo, useState, useTransition } from "react";
import { createReservationAction } from "@/lib/reservation.actions";

import type { ReactElement } from "react";

type CheckoutClientProps = {
  /** Event summary linked to selected reservation context. */
  event: {
    id: string;
    name: string;
    eventDate: string;
  };
  /** Selected table details and dynamic pricing metadata. */
  table: {
    eventTableId: string;
    name: string;
    capacity: number;
    zone: string | null;
    dynamicPrice: number;
    occupancyRate: number;
  };
  /** Reservation prepayment amount to collect immediately. */
  prepaymentAmount: number;
  /** Optional utility classes for wrapper composition. */
  className?: string;
};

type ClientDetails = {
  firstName: string;
  lastName: string;
  phone: string;
  guestsCount: number;
};

type Options = {
  includeInsurance: boolean;
  specialRequests: string;
};

function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutClient({
  event,
  table,
  prepaymentAmount,
  className,
}: CheckoutClientProps): ReactElement {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<number>(1);
  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    firstName: "",
    lastName: "",
    phone: "",
    guestsCount: Math.min(4, table.capacity),
  });
  const [options, setOptions] = useState<Options>({
    includeInsurance: true,
    specialRequests: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const insuranceAmount = options.includeInsurance ? 5 : 0;
  const totalNow = prepaymentAmount + insuranceAmount;

  const stepLabel = useMemo(() => {
    if (step === 1) return "Infos client";
    if (step === 2) return "Options";
    return "Paiement";
  }, [step]);

  function submitReservation(): void {
    setSubmitError(null);

    if (!clientDetails.firstName || !clientDetails.lastName || !clientDetails.phone) {
      setSubmitError("Merci de compléter vos informations client.");
      setStep(1);
      return;
    }

    startTransition(async () => {
      const result = await createReservationAction({
        eventId: event.id,
        eventTableId: table.eventTableId,
        guestsCount: clientDetails.guestsCount,
        firstName: clientDetails.firstName,
        lastName: clientDetails.lastName,
        phone: clientDetails.phone,
        includeInsurance: options.includeInsurance,
        specialRequests: options.specialRequests,
      });

      if (!result.success || !result.data) {
        setSubmitError(result.error ?? "Impossible de démarrer le paiement.");
        return;
      }

      setReservationId(result.data.reservationId);
      setClientSecret(result.data.clientSecret);
    });
  }

  return (
    <>
      <section className={`rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6 ${className ?? ""}`.trim()}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="nt-heading text-3xl text-[#F7F6F3]">Finaliser votre réservation</h1>
          <span className="rounded-full border border-[#C9973A]/30 bg-[#0A0F2E] px-3 py-1 text-xs text-[#C9973A]">
            Étape {step}/3 · {stepLabel}
          </span>
        </div>

        <ol className="mb-6 flex gap-2">
          {[1, 2, 3].map((item) => (
            <li key={item} className={`h-1 flex-1 rounded-full ${item <= step ? "bg-[#C9973A]" : "bg-[#2A2F45]"}`} />
          ))}
        </ol>

        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-[#888888]">Prénom</span>
              <input
                value={clientDetails.firstName}
                onChange={(eventValue) =>
                  setClientDetails((prev) => ({ ...prev, firstName: eventValue.target.value }))
                }
                className="w-full rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3] outline-none focus:border-[#C9973A]"
                placeholder="Sara"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-[#888888]">Nom</span>
              <input
                value={clientDetails.lastName}
                onChange={(eventValue) => setClientDetails((prev) => ({ ...prev, lastName: eventValue.target.value }))}
                className="w-full rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3] outline-none focus:border-[#C9973A]"
                placeholder="Dupont"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-[#888888]">Téléphone</span>
              <input
                value={clientDetails.phone}
                onChange={(eventValue) => setClientDetails((prev) => ({ ...prev, phone: eventValue.target.value }))}
                className="w-full rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3] outline-none focus:border-[#C9973A]"
                placeholder="+33 6 12 34 56 78"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-[#888888]">Nombre d’invités</span>
              <input
                type="number"
                min={1}
                max={table.capacity}
                value={clientDetails.guestsCount}
                onChange={(eventValue) =>
                  setClientDetails((prev) => ({
                    ...prev,
                    guestsCount: Number(eventValue.target.value),
                  }))
                }
                className="w-full rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3] outline-none focus:border-[#C9973A]"
              />
            </label>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-4">
              <div>
                <p className="text-sm text-[#F7F6F3]">Assurance annulation</p>
                <p className="text-xs text-[#888888]">Couvre l’imprévu et protège votre acompte</p>
              </div>
              <input
                type="checkbox"
                checked={options.includeInsurance}
                onChange={(eventValue) =>
                  setOptions((prev) => ({ ...prev, includeInsurance: eventValue.target.checked }))
                }
                className="h-4 w-4 accent-[#C9973A]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-[#888888]">Demandes spéciales</span>
              <textarea
                value={options.specialRequests}
                onChange={(eventValue) =>
                  setOptions((prev) => ({ ...prev, specialRequests: eventValue.target.value }))
                }
                className="min-h-24 w-full rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] px-3 py-2 text-[#F7F6F3] outline-none focus:border-[#C9973A]"
                placeholder="Ex: anniversaire, bouteille préférée, arrivée tardive..."
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-4">
              <p className="text-sm text-[#F7F6F3]">Paiement sécurisé Stripe</p>
              <p className="mt-1 text-xs text-[#888888]">
                Le formulaire Stripe final sera injecté ici lors de la prochaine étape backend.
              </p>
              <div className="mt-3 rounded-md border border-dashed border-[#C9973A]/30 p-3 text-xs text-[#888888]">
                Card Number · Expiry · CVC
              </div>
            </div>

            {submitError ? <p className="text-sm text-[#C4567A]">{submitError}</p> : null}

            {clientSecret ? (
              <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3 text-xs text-[#888888]">
                Réservation créée ({reservationId}).
                <br />
                Client secret Stripe prêt: {clientSecret.slice(0, 20)}...
              </div>
            ) : null}

            <button
              type="button"
              className="nt-btn nt-btn-primary min-h-11 w-full px-4 py-3 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={submitReservation}
              disabled={isPending}
            >
              {isPending ? "Initialisation..." : "Confirmer et payer"}
            </button>
          </div>
        ) : null}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            className="nt-btn min-h-11 border border-[#C9973A]/30 px-4 py-2 text-sm text-[#F7F6F3] transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Retour
          </button>
          {step < 3 ? (
            <button
              type="button"
              className="nt-btn nt-btn-primary ml-auto min-h-11 px-4 py-2 text-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
              onClick={() => setStep((prev) => Math.min(3, prev + 1))}
            >
              Continuer
            </button>
          ) : null}
        </div>
      </section>

      <aside className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-5">
        <h2 className="nt-heading text-2xl text-[#F7F6F3]">Récapitulatif</h2>
        <div className="mt-4 space-y-3 text-sm text-[#F7F6F3]">
          <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
            <p className="font-semibold">{event.name}</p>
            <p className="text-xs text-[#888888]">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(
                new Date(event.eventDate)
              )}
            </p>
          </div>

          <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-[#888888]">Table</p>
            <p className="mt-1 font-semibold">{table.name}</p>
            <p className="text-xs text-[#888888]">
              Zone {table.zone ?? "vip"} · {table.capacity} pers.
            </p>
          </div>

          <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[#888888]">Prix table</span>
              <span>{formatEuros(table.dynamicPrice)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[#888888]">Acompte (40%)</span>
              <span>{formatEuros(prepaymentAmount)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[#888888]">Assurance</span>
              <span>{formatEuros(insuranceAmount)}</span>
            </div>
            <div className="mt-3 border-t border-[#C9973A]/20 pt-2 text-base font-semibold text-[#C9973A]">
              <div className="flex items-center justify-between">
                <span>À payer maintenant</span>
                <span>{formatEuros(totalNow)}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
