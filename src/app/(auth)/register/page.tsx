import Link from "next/link";
import { registerAction } from "@/lib/auth.actions";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-semibold">Inscription</h1>
      <p className="mt-2 text-sm text-zinc-600">Création de compte NightTable (5 rôles).</p>

      {params.error ? (
        <p className="mt-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{params.error}</p>
      ) : null}

      <form action={registerAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
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
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium">Rôle</label>
          <select id="role" name="role" className="w-full rounded-md border border-zinc-300 px-3 py-2">
            <option value="client">Client</option>
            <option value="club">Club</option>
            <option value="promoter">Promoteur</option>
            <option value="female_vip">Femme VIP</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 font-medium text-white"
        >
          Créer le compte
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-600">
        Déjà inscrit ? <Link href="/login" className="underline">Se connecter</Link>
      </p>
    </main>
  );
}
