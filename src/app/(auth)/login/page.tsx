"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import { loginAction } from "@/lib/auth.actions";

export default function LoginPage() {
  const router = useRouter();
  const query = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const queryError = useMemo(() => query.get("error"), [query]);
  const visibleError = error ?? queryError;

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success || !result.data?.redirectTo) {
        setError(result.error ?? "Connexion impossible pour le moment.");
        return;
      }

      router.push(result.data.redirectTo);
    });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0a0f2e] to-[#050508] px-4 py-10 text-[#f7f6f3] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="nt-section p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Login</p>
          <h1 className="nt-heading mt-3 text-3xl font-semibold md:text-5xl">Reprends la main sur ta nuit.</h1>
          <p className="mt-4 max-w-xl text-[#c9c9c9]">
            Connecte-toi pour accéder à ton espace NightTable : réservations, suivi soirées, dashboard club ou promoteur.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/register?role=client" className="nt-card block p-4">
              <p className="text-sm text-[#888888]">Inscription Client</p>
              <p className="mt-1 font-medium">Réserve vite et suis tes soirées</p>
            </Link>
            <Link href="/register?role=club" className="nt-card block p-4">
              <p className="text-sm text-[#888888]">Inscription Club</p>
              <p className="mt-1 font-medium">Pilote ton activité en temps réel</p>
            </Link>
          </div>
          <div className="mt-3">
            <Link href="/register?role=female_vip" className="nt-card block p-4">
              <p className="text-sm text-[#888888]">Inscription Femme VIP</p>
              <p className="mt-1 font-medium">Rejoins le parcours VIP validé par les clubs</p>
            </Link>
          </div>
        </section>

        <section className="nt-card p-6 md:p-8">
          <h2 className="text-xl font-semibold">Connexion</h2>
          <p className="mt-1 text-sm text-[#888888]">Accède à ton espace sécurisé.</p>

          {visibleError ? (
            <p className="mt-4 rounded-md border border-[#c4567a]/50 bg-[#c4567a]/10 px-3 py-2 text-sm text-[#f2c7d5]">{visibleError}</p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="nt-label mb-1 block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="nt-input"
                placeholder="you@nighttable.fr"
                disabled={isPending}
              />
            </div>

            <div>
              <label htmlFor="password" className="nt-label mb-1 block">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="nt-input"
                placeholder="••••••••"
                disabled={isPending}
              />
            </div>

            <button type="submit" className="nt-btn nt-btn-primary w-full px-4 py-2 disabled:opacity-70" disabled={isPending}>
              {isPending ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-4 text-sm text-[#888888]">
            Pas encore de compte ? <Link href="/register" className="text-[#e8c96a] underline">Créer un compte</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
