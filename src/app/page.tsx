import Link from "next/link";

const featuredEvents = [
  {
    title: "Midnight Society",
    club: "Raspoutine",
    date: "Sam 07 Mars · 23:45",
    price: "Min. conso 900€",
    image:
      "https://images.unsplash.com/photo-1574391884720-bbc7d4f6f444?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Noir Signature",
    club: "Bridge Club",
    date: "Sam 07 Mars · 23:00",
    price: "Min. conso 650€",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Velvet Closing",
    club: "Manko",
    date: "Dim 08 Mars · 23:59",
    price: "Min. conso 1100€",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  },
];

const valuePillars = [
  "Réservation table VIP en quelques taps",
  "Prépaiement sécurisé Stripe anti no-show",
  "Attribution promoteur trackée automatiquement",
  "Dashboard club en temps réel",
  "Parcours premium clients & femmes validées",
  "IA concierge NightTable",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-white">
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-violet-950/60 p-7 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Paris</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold md:text-6xl">
            Le standard premium pour réserver une table VIP en club.
          </h1>
          <p className="mt-5 max-w-3xl text-zinc-300 md:text-lg">
            NightTable connecte clients, clubs, promoteurs et parcours VIP dans une seule plateforme:
            découverte événements, paiement sécurisé, opérations club et performance commerciale.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {valuePillars.map((item) => (
              <span key={item} className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-zinc-200">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-md bg-white px-5 py-3 text-black" href="/register">
              Créer un compte
            </Link>
            <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/login">
              Connexion
            </Link>
            <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/demo">
              Voir la démo complète
            </Link>
            <Link className="rounded-md border border-zinc-700 px-5 py-3" href="/final-pages">
              Voir toutes les pages finales
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Événements en avant</h2>
          <Link href="/demo" className="text-sm text-zinc-300 underline">
            Voir tous les événements
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <article
              key={event.title}
              className="relative min-h-72 overflow-hidden rounded-2xl border border-zinc-800"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(9,9,11,0.88), rgba(9,9,11,0.22)), url(${event.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute bottom-0 p-4">
                <p className="text-sm text-zinc-300">{event.club}</p>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="mt-1 text-sm text-zinc-200">{event.date}</p>
                <p className="mt-2 inline-block rounded-md border border-zinc-700 bg-zinc-950/70 px-2 py-1 text-sm">
                  {event.price}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Pour les clubs</p>
          <h3 className="mt-2 text-2xl font-semibold">Pilote ton opérationnel de soirée</h3>
          <p className="mt-2 text-zinc-300">
            Gère événements, tables, réservations, promoteurs et performance dans un seul cockpit.
          </p>
          <Link href="/dashboard/club" className="mt-4 inline-block rounded-md border border-zinc-700 px-4 py-2 text-sm">
            Explorer le dashboard club
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Pour les clients</p>
          <h3 className="mt-2 text-2xl font-semibold">Réserve vite, vis une expérience premium</h3>
          <p className="mt-2 text-zinc-300">
            Découvre les meilleures nuits parisiennes, sécurise ta table et partage ton expérience.
          </p>
          <Link href="/dashboard/client" className="mt-4 inline-block rounded-md border border-zinc-700 px-4 py-2 text-sm">
            Voir l’expérience client
          </Link>
        </div>
      </section>
    </main>
  );
}
