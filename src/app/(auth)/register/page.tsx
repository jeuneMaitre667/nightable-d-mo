import Link from "next/link";
import { registerAction } from "@/lib/auth.actions";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#050508] via-[#0a0f2e] to-[#050508] px-4 py-10 text-[#f7f6f3] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="nt-section p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#888888]">NightTable · Register</p>
          <h1 className="nt-heading mt-3 text-3xl font-semibold md:text-5xl">Entre dans l’écosystème NightTable.</h1>
          <p className="mt-4 max-w-xl text-[#c9c9c9]">
            Crée ton compte en moins d’une minute et choisis ton rôle pour accéder au bon dashboard dès la connexion.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="nt-card p-4">
              <p className="text-sm text-[#888888]">Parcours Client</p>
              <p className="mt-1 font-medium">Réservation, historique, expériences VIP</p>
            </div>
            <div className="nt-card p-4">
              <p className="text-sm text-[#888888]">Parcours Pro</p>
              <p className="mt-1 font-medium">Club, promoteur, pilotage business</p>
            </div>
          </div>
        </section>

        <section className="nt-card p-6 md:p-8">
          <h2 className="text-xl font-semibold">Inscription</h2>
          <p className="mt-1 text-sm text-[#888888]">Création de compte multi-rôles.</p>

          {params.error ? (
            <p className="mt-4 rounded-md border border-[#c4567a]/50 bg-[#c4567a]/10 px-3 py-2 text-sm text-[#f2c7d5]">{params.error}</p>
          ) : null}

          <form action={registerAction} className="mt-6 space-y-4">
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
                minLength={8}
                required
                className="nt-input"
                placeholder="8 caractères minimum"
              />
            </div>

            <div>
              <label htmlFor="role" className="nt-label mb-1 block">Rôle</label>
              <select id="role" name="role" className="nt-input">
                <option value="client">Client</option>
                <option value="club">Club</option>
                <option value="promoter">Promoteur</option>
                <option value="female_vip">Femme VIP</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="nt-btn nt-btn-primary w-full px-4 py-2"
            >
              Créer le compte
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
