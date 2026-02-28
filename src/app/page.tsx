import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">NightTable</p>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl">
          Réservation de tables VIP pour la nuit parisienne.
        </h1>
        <p className="mt-6 max-w-2xl text-zinc-300">
          MVP initial prêt: auth multi-rôles, dashboards, réservations, Stripe et API publique.
        </p>
        <div className="mt-10 flex gap-4">
          <Link className="rounded-md bg-white px-5 py-3 text-black" href="/login">
            Connexion
          </Link>
          <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/register">
            Créer un compte
          </Link>
          <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/demo">
            Voir la démo
          </Link>
        </div>
      </section>
    </main>
  );
}
