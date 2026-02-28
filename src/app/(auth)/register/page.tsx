"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import {
  registerClientAction,
  registerClubAction,
  registerFemaleVipAction,
} from "@/lib/auth.actions";

type RegisterRole = "client" | "club" | "female_vip";

function normalizeRegisterRole(value: string | null): RegisterRole {
  if (value === "club" || value === "female_vip") {
    return value;
  }

  return "client";
}

export default function RegisterPage() {
  const router = useRouter();
  const query = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RegisterRole>(normalizeRegisterRole(query.get("role")));

  const queryError = useMemo(() => query.get("error"), [query]);
  const visibleError = error ?? queryError;

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "").trim();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const clubName = String(formData.get("clubName") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const instagramHandle = String(formData.get("instagramHandle") ?? "").trim();

    startTransition(async () => {
      if (selectedRole === "club") {
        const result = await registerClubAction({
          email,
          password,
          clubName,
          slug: slug || undefined,
          city: city || undefined,
          phone: phone || undefined,
        });

        if (!result.success || !result.data?.redirectTo) {
          setError(result.error ?? "Inscription club impossible.");
          return;
        }

        router.push(result.data.redirectTo);
        return;
      }

      if (selectedRole === "female_vip") {
        const result = await registerFemaleVipAction({
          email,
          password,
          firstName,
          lastName: lastName || undefined,
          phone: phone || undefined,
          instagramHandle: instagramHandle || undefined,
        });

        if (!result.success || !result.data?.redirectTo) {
          setError(result.error ?? "Inscription Femme VIP impossible.");
          return;
        }

        router.push(result.data.redirectTo);
        return;
      }

      const result = await registerClientAction({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
      });

      if (!result.success || !result.data?.redirectTo) {
        setError(result.error ?? "Inscription client impossible.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0a0f2e] to-[#050508] px-4 py-10 text-[#f7f6f3] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="nt-section p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Register</p>
          <h1 className="nt-heading mt-3 text-3xl font-semibold md:text-5xl">Entre dans l’écosystème NightTable.</h1>
          <p className="mt-4 max-w-xl text-[#c9c9c9]">
            Choisis ton parcours et active ton compte en moins d&apos;une minute.
          </p>

          <div className="mt-6 grid gap-3">
            <button type="button" onClick={() => setSelectedRole("client")} className={`nt-card p-4 text-left ${selectedRole === "client" ? "border-[#c9973a]/70" : ""}`}>
              <p className="text-sm text-[#888888]">Compte Client</p>
              <p className="mt-1 font-medium">Réservation, historique, expérience VIP</p>
            </button>
            <button type="button" onClick={() => setSelectedRole("club")} className={`nt-card p-4 text-left ${selectedRole === "club" ? "border-[#c9973a]/70" : ""}`}>
              <p className="text-sm text-[#888888]">Compte Club</p>
              <p className="mt-1 font-medium">Événements, tables, commissions, analytics</p>
            </button>
            <button type="button" onClick={() => setSelectedRole("female_vip")} className={`nt-card p-4 text-left ${selectedRole === "female_vip" ? "border-[#c4567a]/70" : ""}`}>
              <p className="text-sm text-[#888888]">Compte Femme VIP</p>
              <p className="mt-1 font-medium">Parcours premium avec validation par club</p>
            </button>
          </div>
        </section>

        <section className="nt-card p-6 md:p-8">
          <h2 className="text-xl font-semibold">Inscription</h2>
          <p className="mt-1 text-sm text-[#888888]">Formulaire dynamique selon le type de compte.</p>

          {visibleError ? (
            <p className="mt-4 rounded-md border border-[#c4567a]/50 bg-[#c4567a]/10 px-3 py-2 text-sm text-[#f2c7d5]">{visibleError}</p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input type="hidden" name="role" value={selectedRole} />

            <div>
              <label htmlFor="email" className="nt-label mb-1 block">Email</label>
              <input id="email" name="email" type="email" required className="nt-input" placeholder="you@nighttable.fr" disabled={isPending} />
            </div>

            <div>
              <label htmlFor="password" className="nt-label mb-1 block">Mot de passe</label>
              <input id="password" name="password" type="password" minLength={8} required className="nt-input" placeholder="8 caractères minimum" disabled={isPending} />
            </div>

            {selectedRole === "club" ? (
              <>
                <div>
                  <label htmlFor="clubName" className="nt-label mb-1 block">Nom du club</label>
                  <input id="clubName" name="clubName" type="text" required className="nt-input" placeholder="Night Club Paris" disabled={isPending} />
                </div>
                <div>
                  <label htmlFor="slug" className="nt-label mb-1 block">Slug (optionnel)</label>
                  <input id="slug" name="slug" type="text" className="nt-input" placeholder="night-club-paris" disabled={isPending} />
                </div>
                <div>
                  <label htmlFor="city" className="nt-label mb-1 block">Ville</label>
                  <input id="city" name="city" type="text" className="nt-input" placeholder="Paris" disabled={isPending} />
                </div>
                <div>
                  <label htmlFor="phone" className="nt-label mb-1 block">Téléphone</label>
                  <input id="phone" name="phone" type="tel" className="nt-input" placeholder="+33..." disabled={isPending} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="firstName" className="nt-label mb-1 block">Prénom</label>
                  <input id="firstName" name="firstName" type="text" required={selectedRole === "female_vip"} className="nt-input" placeholder="Prénom" disabled={isPending} />
                </div>
                <div>
                  <label htmlFor="lastName" className="nt-label mb-1 block">Nom</label>
                  <input id="lastName" name="lastName" type="text" className="nt-input" placeholder="Nom" disabled={isPending} />
                </div>
                <div>
                  <label htmlFor="phone" className="nt-label mb-1 block">Téléphone</label>
                  <input id="phone" name="phone" type="tel" className="nt-input" placeholder="+33..." disabled={isPending} />
                </div>
                {selectedRole === "female_vip" ? (
                  <div>
                    <label htmlFor="instagramHandle" className="nt-label mb-1 block">Instagram (optionnel)</label>
                    <input id="instagramHandle" name="instagramHandle" type="text" className="nt-input" placeholder="@username" disabled={isPending} />
                  </div>
                ) : null}
              </>
            )}

            <button type="submit" className="nt-btn nt-btn-primary w-full px-4 py-2 disabled:opacity-70" disabled={isPending}>
              {isPending ? "Création du compte..." : "Créer le compte"}
            </button>
          </form>

          <p className="mt-4 text-sm text-[#888888]">
            Déjà inscrit ? <Link href="/login" className="text-[#e8c96a] underline">Se connecter</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
