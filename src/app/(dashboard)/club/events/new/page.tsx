"use client";

// Component: NewClubEventPage
// Reference: component.gallery/components/text-input
// Inspired by: Atlassian Design System pattern
// NightTable usage: club form to create and configure new events

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { createEventAction } from "@/lib/club.actions";

import type { FormEvent, ReactElement } from "react";

const eventSchema = z.object({
  title: z.string().trim().min(2),
  date: z.string().trim().min(1),
  startTime: z.string().trim().min(1),
  endTime: z.string().trim().optional(),
  dressCode: z.string().trim().optional(),
  description: z.string().trim().optional(),
  coverUrl: z.string().trim().url().optional().or(z.literal("")),
  isVipPromoActive: z.boolean(),
  isAuction: z.boolean(),
  notoriety: z.number().min(1).max(2.5),
});

export default function NewClubEventPage(): ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [djInput, setDjInput] = useState<string>("");
  const [djLineup, setDjLineup] = useState<string[]>([]);
  const [isVipPromoActive, setIsVipPromoActive] = useState<boolean>(false);
  const [isAuction, setIsAuction] = useState<boolean>(false);
  const [notoriety, setNotoriety] = useState<number>(1);

  function addDjTag(): void {
    const value = djInput.trim();
    if (!value) {
      return;
    }

    if (djLineup.includes(value)) {
      setDjInput("");
      return;
    }

    setDjLineup((current) => [...current, value]);
    setDjInput("");
  }

  function removeDjTag(tag: string): void {
    setDjLineup((current) => current.filter((item) => item !== tag));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      date: String(formData.get("date") ?? "").trim(),
      startTime: String(formData.get("startTime") ?? "").trim(),
      endTime: String(formData.get("endTime") ?? "").trim(),
      dressCode: String(formData.get("dressCode") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      coverUrl: String(formData.get("coverUrl") ?? "").trim(),
      isVipPromoActive,
      isAuction,
      notoriety,
    };

    const parsed = eventSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Veuillez vérifier les champs obligatoires du formulaire.");
      return;
    }

    startTransition(async () => {
      const result = await createEventAction({
        ...parsed.data,
        coverUrl: parsed.data.coverUrl || undefined,
        endTime: parsed.data.endTime || undefined,
        dressCode: parsed.data.dressCode || undefined,
        description: parsed.data.description || undefined,
        djLineup,
      });

      if (!result.success || !result.data?.redirectTo) {
        setError(result.error ?? "Impossible de créer l'événement pour le moment.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#888888]">Club Events</p>
        <h1 className="nt-heading mt-2 text-3xl text-[#F7F6F3] md:text-4xl">Créer un événement</h1>
        <p className="mt-2 text-sm text-[#888888]">
          Prépare la soirée avec tous les paramètres opérationnels du club.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
        {error ? (
          <p className="rounded-md border border-[#C4567A]/45 bg-[#C4567A]/12 px-3 py-2 text-sm text-[#f2c7d5]">{error}</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="nt-label mb-1 block">Titre</label>
            <input id="title" name="title" type="text" required className="nt-input" disabled={isPending} />
          </div>

          <div>
            <label htmlFor="date" className="nt-label mb-1 block">Date</label>
            <input id="date" name="date" type="date" required className="nt-input" disabled={isPending} />
          </div>

          <div>
            <label htmlFor="startTime" className="nt-label mb-1 block">Heure début</label>
            <input id="startTime" name="startTime" type="time" required className="nt-input" disabled={isPending} />
          </div>

          <div>
            <label htmlFor="endTime" className="nt-label mb-1 block">Heure fin</label>
            <input id="endTime" name="endTime" type="time" className="nt-input" disabled={isPending} />
          </div>

          <div>
            <label htmlFor="dressCode" className="nt-label mb-1 block">Dress code</label>
            <input id="dressCode" name="dressCode" type="text" className="nt-input" disabled={isPending} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="coverUrl" className="nt-label mb-1 block">Cover image URL</label>
            <input id="coverUrl" name="coverUrl" type="url" className="nt-input" disabled={isPending} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="nt-label mb-1 block">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="nt-input"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-[#C9973A]/15 bg-[#0A0F2E] p-4">
          <label className="nt-label block">DJ lineup</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={djInput}
              onChange={(event) => setDjInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addDjTag();
                }
              }}
              className="nt-input"
              placeholder="Ajouter un DJ"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={addDjTag}
              className="nt-btn nt-btn-secondary min-h-11 px-4 py-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {djLineup.map((dj) => (
              <button
                type="button"
                key={dj}
                onClick={() => removeDjTag(dj)}
                className="min-h-11 rounded-md border border-[#C9973A]/40 bg-[#C9973A]/12 px-3 py-1 text-xs font-medium text-[#E8C96A] transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B]"
                disabled={isPending}
              >
                {dj} ×
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-[#C9973A]/15 bg-[#0A0F2E] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#F7F6F3]">Activer module femmes VIP</span>
            <button
              type="button"
              onClick={() => setIsVipPromoActive((value) => !value)}
              className={`h-11 w-12 rounded-full border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F2E] ${isVipPromoActive ? "border-[#C4567A] bg-[#C4567A]/40" : "border-[#2A2F4A] bg-[#12172B]"}`}
              disabled={isPending}
              aria-label="Activer le module femmes VIP"
              aria-pressed={isVipPromoActive}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-[#F7F6F3] transition-all duration-200 ease-in-out ${isVipPromoActive ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[#F7F6F3]">Activer mode enchères</span>
            <button
              type="button"
              onClick={() => setIsAuction((value) => !value)}
              className={`h-11 w-12 rounded-full border transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F2E] ${isAuction ? "border-[#C9973A] bg-[#C9973A]/35" : "border-[#2A2F4A] bg-[#12172B]"}`}
              disabled={isPending}
              aria-label="Activer le mode enchères"
              aria-pressed={isAuction}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-[#F7F6F3] transition-all duration-200 ease-in-out ${isAuction ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-[#C9973A]/15 bg-[#0A0F2E] p-4">
          <label htmlFor="notoriety" className="nt-label block">Coefficient notoriété DJ</label>
          <input
            id="notoriety"
            type="range"
            min={1}
            max={2.5}
            step={0.1}
            value={notoriety}
            onChange={(event) => setNotoriety(Number(event.target.value))}
            className="w-full accent-[#C9973A]"
            disabled={isPending}
          />
          <p className="text-sm text-[#E8C96A]">{notoriety.toFixed(1)}x</p>
        </div>

        <button
          type="submit"
          className="nt-btn nt-btn-primary min-h-11 w-full px-5 py-3 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9973A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12172B] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? "Création en cours..." : "Créer l’événement"}
        </button>
      </form>
    </div>
  );
}
