"use client";

// Component: CheckoutClient
// Reference: component.gallery/components/accordion
// Inspired by: Shopify Polaris pattern
// NightTable usage: multi-step reservation checkout and payment initialization

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Accordion, AccordionItem, Button, Chip, Input, Textarea } from "@heroui/react";
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
  email: string;
  phone: string;
};

type Options = {
  includeInsurance: boolean;
  specialRequests: string;
};

type StripePaymentFormProps = {
  reservationId: string;
  eventId: string;
  tableId: string;
  formId: string;
  hideInternalButton?: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

function StripePaymentForm({
  reservationId,
  eventId,
  tableId,
  formId,
  hideInternalButton,
  onSuccess,
  onError,
}: StripePaymentFormProps): ReactElement {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState<boolean>(false);

  async function handlePaymentSubmit(eventValue: React.FormEvent<HTMLFormElement>): Promise<void> {
    eventValue.preventDefault();
    onError("");

    if (!stripe || !elements) {
      onError("Le module de paiement n’est pas encore prêt. Réessayez dans quelques secondes.");
      return;
    }

    setIsPaying(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/reserve/checkout?eventId=${eventId}&tableId=${tableId}`,
      },
      redirect: "if_required",
    });

    setIsPaying(false);

    if (error) {
      onError(error.message ?? "Le paiement a échoué. Merci de vérifier vos informations.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(`Paiement confirmé. Réservation ${reservationId} validée.`);
      return;
    }

    if (paymentIntent?.status === "processing") {
      onSuccess("Paiement en cours de validation. Confirmation imminente.");
      return;
    }

    onError("Le paiement n’a pas pu être confirmé. Merci de réessayer.");
  }

  return (
    <form id={formId} className="space-y-3" onSubmit={handlePaymentSubmit}>
      <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-4">
        <PaymentElement />
      </div>

      {!hideInternalButton ? (
        <Button
          type="submit"
          color="primary"
          radius="none"
          fullWidth
          isDisabled={isPaying || !stripe || !elements}
          className="h-12 min-h-[48px] font-semibold"
        >
          {isPaying ? "Paiement en cours..." : "Payer maintenant"}
        </Button>
      ) : null}
    </form>
  );
}

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
    email: "",
    phone: "",
  });
  const [options, setOptions] = useState<Options>({
    includeInsurance: true,
    specialRequests: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const stripeFormId = "checkout-stripe-payment-form";
  const insuranceAmount = options.includeInsurance ? Math.round(prepaymentAmount * 0.1) : 0;
  const totalNow = prepaymentAmount + insuranceAmount;

  const clubName = "NightTable Paris";
  const eventDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(event.eventDate)),
    [event.eventDate]
  );

  const isStepOne = step === 1;
  const isStepTwo = step === 2;
  const isStepThree = step === 3;

  const canContinueStepOne =
    Boolean(clientDetails.firstName.trim()) &&
    Boolean(clientDetails.lastName.trim()) &&
    Boolean(clientDetails.email.trim()) &&
    Boolean(clientDetails.phone.trim());

  const stepItems = [
    { id: 1, label: "1 · Vos informations" },
    { id: 2, label: "2 · Paiement" },
    { id: 3, label: "3 · Confirmation" },
  ];

  const fieldClassNames = {
    inputWrapper: "min-h-[48px] rounded-lg border border-white/10 bg-[#0A0F2E]",
    input: "text-sm leading-5 text-[#F7F6F3]",
  };

  function submitReservation(): void {
    setSubmitError(null);
    setPaymentError(null);
    setPaymentMessage(null);

    if (!clientDetails.firstName || !clientDetails.lastName || !clientDetails.phone) {
      setSubmitError("Merci de compléter vos informations client.");
      setStep(1);
      return;
    }

    if (!clientDetails.email || !clientDetails.email.includes("@")) {
      setSubmitError("Merci de renseigner un email valide.");
      setStep(1);
      return;
    }

    startTransition(async () => {
      const result = await createReservationAction({
        eventId: event.id,
        eventTableId: table.eventTableId,
        guestsCount: table.capacity,
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
      setStep(2);
    });
  }

  function goToNextStep(): void {
    if (!canContinueStepOne) {
      setSubmitError("Merci de compléter toutes vos informations.");
      return;
    }

    if (!clientDetails.email.includes("@")) {
      setSubmitError("Merci de renseigner un email valide.");
      return;
    }

    setSubmitError(null);
    setStep(2);
  }

  const summaryCard = (
    <div className="rounded-2xl border border-[#C9973A]/15 bg-[#1A1D24]/95 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
        <Image
          src="https://images.unsplash.com/photo-1571266028243-d220c9c3f14f?auto=format&fit=crop&w=1200&q=80"
          alt="Ambiance du club"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>

      <p className="text-[11px] uppercase tracking-[0.18em] text-[#C9973A]">{clubName}</p>
      <p className="mt-1 text-base font-semibold text-[#F7F6F3]">{event.name}</p>

      <div className="mt-3">
        <Chip color="primary" variant="flat">
          {table.name}
        </Chip>
      </div>

      <p className="mt-3 text-sm text-[#F7F6F3]">{eventDateLabel}</p>
      <p className="mt-1 text-xs text-[#888888]">
        {table.capacity} pers{table.zone ? ` · ${table.zone}` : ""}
      </p>

      <div className="my-4 border-t border-[#C9973A]/10" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-[#888888]">
          <span>Acompte</span>
          <span className="text-[#F7F6F3]">{formatEuros(prepaymentAmount)}</span>
        </div>
        {options.includeInsurance ? (
          <div className="flex items-center justify-between text-[#888888]">
            <span>Assurance</span>
            <span className="text-[#F7F6F3]">{formatEuros(insuranceAmount)}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-[18px] font-semibold text-[#F7F6F3]">Total</p>
        <p className="font-[Cormorant_Garamond] text-[28px] leading-none text-[#C9973A]">{formatEuros(totalNow)}</p>
      </div>

      <p className="mt-4 text-[11px] text-[#666666]">
        En poursuivant, vous acceptez nos conditions de réservation et la politique d’annulation NightTable.
      </p>
    </div>
  );

  const mobilePrimaryAction = (() => {
    if (isStepOne) {
      return (
        <Button
          color="primary"
          radius="none"
          fullWidth
          className="h-14 min-h-[56px] font-semibold"
          isDisabled={!canContinueStepOne}
          onPress={goToNextStep}
        >
          Continuer vers paiement
        </Button>
      );
    }

    if (isStepTwo && !clientSecret) {
      return (
        <Button
          color="primary"
          radius="none"
          fullWidth
          className="h-14 min-h-[56px] font-semibold"
          isDisabled={isPending}
          onPress={submitReservation}
        >
          {isPending ? "Initialisation..." : "Initialiser le paiement"}
        </Button>
      );
    }

    if (isStepTwo && clientSecret) {
      return (
        <Button
          type="submit"
          form={stripeFormId}
          color="primary"
          radius="none"
          fullWidth
          className="h-14 min-h-[56px] font-semibold"
        >
          Payer et confirmer
        </Button>
      );
    }

    return null;
  })();

  return (
    <section className={`bg-[#050508] pb-24 md:pb-0 ${className ?? ""}`.trim()}>
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[60%_40%] lg:gap-8">
        <div>
          <div className="md:hidden">
            <Accordion selectionMode="multiple" defaultExpandedKeys={["summary"]}>
              <AccordionItem
                key="summary"
                aria-label="Récapitulatif"
                title={<span className="text-sm font-semibold text-[#F7F6F3]">Récapitulatif de votre commande</span>}
                classNames={{
                  base: "rounded-2xl border border-[#C9973A]/15 bg-[#1A1D24] px-0",
                  trigger: "px-4 py-3",
                  content: "px-4 pb-4",
                }}
              >
                {summaryCard}
              </AccordionItem>
            </Accordion>
          </div>

          <section className="mt-4 rounded-2xl border border-[#C9973A]/15 bg-[#1A1D24] p-4 md:mt-0 md:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#C9973A]">Tunnel NightTable</p>
            <h1 className="mt-2 font-[Cormorant_Garamond] text-[34px] font-light leading-[1.06] text-[#F7F6F3] md:text-5xl">
              Finaliser votre réservation
            </h1>
            <p className="mt-2 text-sm text-[#888888]">{event.name} · {eventDateLabel}</p>

            <ol className="mt-4 grid gap-2 md:mt-5 md:grid-cols-3">
              {stepItems.map((item) => {
                const isPast = item.id < step;
                const isActive = item.id === step;

                return (
                  <li
                    key={item.id}
                    className={`flex min-h-[44px] items-center justify-center gap-2 rounded-lg border px-3 py-2 text-center text-[13px] transition-all duration-200 md:text-sm ${
                      isActive
                        ? "border-[#C9973A] bg-[#C9973A]/8 text-[#C9973A]"
                        : isPast
                          ? "border-[#3A9C6B]/60 bg-[#3A9C6B]/10 text-[#3A9C6B]"
                          : "border-white/10 bg-[#0A0F2E] text-[#888888]"
                    }`}
                  >
                    {isPast ? <span aria-hidden="true">✓</span> : null}
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ol>

            {submitError ? <p className="mt-4 text-sm text-[#C4567A]">{submitError}</p> : null}
            {paymentError ? <p className="mt-2 text-sm text-[#C4567A]">{paymentError}</p> : null}
            {paymentMessage ? <p className="mt-2 text-sm text-[#3A9C6B]">{paymentMessage}</p> : null}

            {isStepOne ? (
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888888]">Prénom</p>
                    <Input
                      value={clientDetails.firstName}
                      onValueChange={(value) => setClientDetails((prev) => ({ ...prev, firstName: value }))}
                      variant="bordered"
                      color="primary"
                      radius="sm"
                      classNames={fieldClassNames}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888888]">Nom</p>
                    <Input
                      value={clientDetails.lastName}
                      onValueChange={(value) => setClientDetails((prev) => ({ ...prev, lastName: value }))}
                      variant="bordered"
                      color="primary"
                      radius="sm"
                      classNames={fieldClassNames}
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888888]">Email</p>
                  <Input
                    type="email"
                    value={clientDetails.email}
                    onValueChange={(value) => setClientDetails((prev) => ({ ...prev, email: value }))}
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    classNames={fieldClassNames}
                  />
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888888]">Téléphone</p>
                  <Input
                    value={clientDetails.phone}
                    onValueChange={(value) => setClientDetails((prev) => ({ ...prev, phone: value }))}
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    classNames={fieldClassNames}
                  />
                </div>

                <div className="rounded-lg border border-[#C9973A]/10 bg-[#0A0F2E] p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={options.includeInsurance}
                      onChange={(eventValue) => {
                        const isChecked = eventValue.currentTarget.checked;
                        setOptions((prev) => ({
                          ...prev,
                          includeInsurance: isChecked,
                        }));
                      }}
                      className="sr-only"
                      aria-label="Activer l'assurance annulation"
                    />
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[12px] font-bold leading-none transition-all duration-200 ${
                        options.includeInsurance
                          ? "border-[#C9973A] bg-[#C9973A] text-[#050508]"
                          : "border-[#C9973A]/50 bg-[#050508] text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[#F7F6F3]">Assurance annulation</span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#888888]">
                        Ajouter la couverture annulation (10% de l’acompte)
                      </span>
                    </span>
                  </label>
                </div>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#888888]">Demande spéciale</p>
                  <Textarea
                    minRows={3}
                    value={options.specialRequests}
                    onValueChange={(value) => setOptions((prev) => ({ ...prev, specialRequests: value }))}
                    variant="bordered"
                    color="primary"
                    radius="sm"
                    classNames={fieldClassNames}
                  />
                </div>
              </div>
            ) : null}

            {isStepTwo ? (
              <div className="mt-6 space-y-4">
                {!stripePromise ? (
                  <div className="rounded-lg border border-[#C4567A]/30 bg-[#0A0F2E] p-3 text-xs text-[#C4567A]">
                    Clé Stripe publishable absente. Définissez `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
                  </div>
                ) : null}

                {!clientSecret ? (
                  <div className="rounded-lg border border-[#C9973A]/20 bg-[#0A0F2E] p-4">
                    <p className="text-sm text-[#F7F6F3]">Paiement prêt à être initialisé</p>
                    <p className="mt-1 text-xs text-[#888888]">
                      Nous créons d’abord votre réservation, puis Stripe active le formulaire de paiement.
                    </p>
                  </div>
                ) : null}

                {clientSecret && stripePromise && reservationId ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "night",
                        variables: {
                          colorPrimary: "#C9973A",
                          colorBackground: "#0A0F2E",
                          colorText: "#F7F6F3",
                          colorDanger: "#C4567A",
                          borderRadius: "8px",
                        },
                      },
                    }}
                  >
                    <StripePaymentForm
                      reservationId={reservationId}
                      eventId={event.id}
                      tableId={table.eventTableId}
                      formId={stripeFormId}
                      hideInternalButton
                      onSuccess={(message) => {
                        setPaymentMessage(message);
                        setStep(3);
                      }}
                      onError={(message) => setPaymentError(message)}
                    />
                  </Elements>
                ) : null}

                <p className="mt-4 text-center text-xs text-[#888888]">🔒 Paiement 100% sécurisé · Stripe</p>
              </div>
            ) : null}

            {isStepThree ? (
              <div className="mt-8 text-center">
                <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-[#3A9C6B]/30 bg-[#3A9C6B]/15 text-3xl text-[#3A9C6B]">
                  ✓
                </div>
                <h2 className="mt-4 font-[Cormorant_Garamond] text-[40px] font-light text-[#C9973A]">
                  Réservation confirmée !
                </h2>

                <div className="mx-auto mt-5 max-w-md space-y-1 rounded-xl border border-white/5 bg-[#0A0F2E] p-4 text-left text-sm text-[#F7F6F3]">
                  <p>{clubName}</p>
                  <p>{event.name}</p>
                  <p>{table.name}</p>
                  <p>{eventDateLabel}</p>
                  <p className="font-semibold text-[#C9973A]">{formatEuros(totalNow)}</p>
                </div>

                <Button
                  as={Link}
                  href="/dashboard/client/reservations"
                  color="primary"
                  radius="none"
                  className="mt-6 h-12 min-h-[48px] px-8 font-semibold"
                >
                  Voir ma réservation
                </Button>
              </div>
            ) : null}

            <div className="mt-6 hidden items-center gap-3 md:flex">
              <Button
                variant="bordered"
                radius="none"
                  className="h-12 min-h-[48px] border-[#C9973A]/40 bg-transparent text-[#F7F6F3]"
                isDisabled={step === 1 || isPending}
                onPress={() => setStep((prev) => Math.max(1, prev - 1))}
              >
                Retour
              </Button>

              {isStepOne ? (
                <Button
                  color="primary"
                  radius="none"
                  className="ml-auto h-12 min-h-[48px] px-8 font-semibold"
                  isDisabled={!canContinueStepOne}
                  onPress={goToNextStep}
                >
                  Continuer
                </Button>
              ) : null}

              {isStepTwo && !clientSecret ? (
                <Button
                  color="primary"
                  radius="none"
                  className="ml-auto h-12 min-h-[48px] px-8 font-semibold"
                  isDisabled={isPending}
                  onPress={submitReservation}
                >
                  {isPending ? "Initialisation..." : "Initialiser le paiement"}
                </Button>
              ) : null}

              {isStepTwo && clientSecret ? (
                <Button
                  type="submit"
                  form={stripeFormId}
                  color="primary"
                  radius="none"
                  className="ml-auto h-12 min-h-[48px] px-8 font-semibold"
                >
                  Payer et confirmer
                </Button>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">{summaryCard}</aside>
      </div>

      {!isStepThree ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#C9973A]/20 bg-[#050508]/95 p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          {mobilePrimaryAction}
        </div>
      ) : null}
    </section>
  );
}
