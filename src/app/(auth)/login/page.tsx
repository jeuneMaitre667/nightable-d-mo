import Link from "next/link";
import { loginAction } from "@/lib/auth.actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/40 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Login</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Reprends la main sur ta nuit.</h1>
          <p className="mt-4 max-w-xl text-zinc-300">
            Connecte-toi pour accéder à ton espace NightTable : réservations, suivi soirées, dashboard club ou promoteur.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-sm text-zinc-400">Client</p>
              <p className="mt-1 font-medium">Réserve vite et suis tes soirées</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-sm text-zinc-400">Club / Promoteur</p>
              <p className="mt-1 font-medium">Pilote tes performances en temps réel</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="text-xl font-semibold">Connexion</h2>
          <p className="mt-1 text-sm text-zinc-400">Accède à ton espace sécurisé.</p>

          {params.error ? (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-200">{params.error}</p>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                placeholder="you@nighttable.fr"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-2 font-medium text-black"
            >
              Se connecter
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-400">
            Pas encore de compte ? <Link href="/register" className="underline text-zinc-100">Créer un compte</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
