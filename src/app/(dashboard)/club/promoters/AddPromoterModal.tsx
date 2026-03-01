"use client";

// Component: AddPromoterModal
// Reference: component.gallery/components/modal
// Inspired by: Atlassian modal form pattern
// NightTable usage: Club dashboard promoter creation flow

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { createPromoterAction } from "@/lib/promoter.actions";

export function AddPromoterModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("commission_rate", String(commissionRate));
    const result = await createPromoterAction(formData);

    if (!result.success) {
      setErrorMessage(result.error ?? "Impossible de créer ce promoteur.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Promoteur créé avec succès.");
    setIsSubmitting(false);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
      >
        Ajouter un promoteur
      </button>

      {successMessage ? (
        <p className="mt-3 rounded-lg border border-[#3A9C6B]/30 bg-[#3A9C6B]/10 px-3 py-2 text-sm text-[#3A9C6B]">
          {successMessage}
        </p>
      ) : null}

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Ajouter un promoteur"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#C9973A]/20 bg-[#12172B] p-6 transition-all duration-200 ease-in-out"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-xl font-semibold text-[#F7F6F3]">Nouveau promoteur</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-[#2A2F4A] text-[#888888] transition-all duration-200 ease-in-out hover:border-[#C9973A]/30 hover:text-[#F7F6F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="first_name"
                  required
                  placeholder="Prénom"
                  className="h-11 rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
                />
                <input
                  name="last_name"
                  required
                  placeholder="Nom"
                  className="h-11 rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
                />
              </div>

              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className="h-11 w-full rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
              />

              <input
                name="phone"
                placeholder="Téléphone (optionnel)"
                className="h-11 w-full rounded-lg border border-[#2A2F4A] bg-[#0A0F2E] px-3 text-[#F7F6F3] transition-all duration-200 ease-in-out focus:border-[#C9973A] focus:outline-none focus:ring-2 focus:ring-[#C9973A]/15"
              />

              <div>
                <label
                  htmlFor="commission-rate"
                  className="mb-2 block text-[11px] uppercase tracking-widest text-[#888888]"
                >
                  Commission: {commissionRate}%
                </label>
                <input
                  id="commission-rate"
                  type="range"
                  min={5}
                  max={15}
                  step={1}
                  value={commissionRate}
                  onChange={(event) => setCommissionRate(Number(event.target.value))}
                  className="h-11 w-full accent-[#C9973A]"
                />
              </div>

              {errorMessage ? (
                <p className="rounded-lg border border-[#C4567A]/30 bg-[#C4567A]/10 px-3 py-2 text-sm text-[#C4567A]">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-[#C9973A] px-4 py-2 text-sm font-semibold text-[#050508] transition-all duration-200 ease-in-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Création..." : "Créer"}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
