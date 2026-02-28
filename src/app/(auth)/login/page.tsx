import Link from "next/link";
import { loginAction } from "@/lib/auth.actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

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
            <div className="nt-card p-4">
              <p className="text-sm text-[#888888]">Client</p>
              <p className="mt-1 font-medium">Réserve vite et suis tes soirées</p>
            </div>
            <div className="nt-card p-4">
              <p className="text-sm text-[#888888]">Club / Promoteur</p>
              <p className="mt-1 font-medium">Pilote tes performances en temps réel</p>
            </div>
          </div>
        </section>

        <section className="nt-card p-6 md:p-8">
          <h2 className="text-xl font-semibold">Connexion</h2>
          <p className="mt-1 text-sm text-[#888888]">Accède à ton espace sécurisé.</p>

          {params.error ? (
            <p className="mt-4 rounded-md border border-[#c4567a]/50 bg-[#c4567a]/10 px-3 py-2 text-sm text-[#f2c7d5]">{params.error}</p>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="nt-label mb-1 block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="nt-input"
                placeholder="you@nighttable.fr"
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
              />
            </div>

            <button
              type="submit"
              className="nt-btn nt-btn-primary w-full px-4 py-2"
            >
              Se connecter
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
