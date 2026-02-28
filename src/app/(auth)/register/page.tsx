import Link from "next/link";
import { registerAction } from "@/lib/auth.actions";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-fuchsia-950/40 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Register</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Entre dans l’écosystème NightTable.</h1>
          <p className="mt-4 max-w-xl text-zinc-300">
            Crée ton compte en moins d’une minute et choisis ton rôle pour accéder au bon dashboard dès la connexion.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-sm text-zinc-400">Parcours Client</p>
              <p className="mt-1 font-medium">Réservation, historique, expériences VIP</p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/60 p-4">
              <p className="text-sm text-zinc-400">Parcours Pro</p>
              <p className="mt-1 font-medium">Club, promoteur, pilotage business</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="text-xl font-semibold">Inscription</h2>
          <p className="mt-1 text-sm text-zinc-400">Création de compte multi-rôles.</p>

          {params.error ? (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/15 px-3 py-2 text-sm text-red-200">{params.error}</p>
          ) : null}

          <form action={registerAction} className="mt-6 space-y-4">
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
                minLength={8}
                required
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                placeholder="8 caractères minimum"
              />
            </div>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium">Rôle</label>
              <select id="role" name="role" className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
                <option value="client">Client</option>
                <option value="club">Club</option>
                <option value="promoter">Promoteur</option>
                <option value="female_vip">Femme VIP</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-2 font-medium text-black"
            >
              Créer le compte
            </button>
          </form>

          <p className="mt-4 text-sm text-zinc-400">
            Déjà inscrit ? <Link href="/login" className="underline text-zinc-100">Se connecter</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
