type ReservePageProps = {
  searchParams: Promise<{
    promo?: string;
    club?: string;
    event?: string;
    table?: string;
    guests?: string;
  }>;
};

const clubs = [
  { slug: "l-arc-paris", label: "L'Arc Paris" },
  { slug: "raspoutine", label: "Raspoutine" },
  { slug: "bridge-club", label: "Bridge Club" },
  { slug: "manko", label: "Manko" },
];

const events = [
  { id: "fashion-week-afterparty", label: "Fashion Week Afterparty", min: 1500 },
  { id: "midnight-society", label: "Midnight Society", min: 900 },
  { id: "noir-signature", label: "Noir Signature", min: 650 },
  { id: "velvet-closing", label: "Velvet Closing", min: 1100 },
];

const tables = [
  { id: "standard-4", label: "Table Standard (4 pers)", multiplier: 1 },
  { id: "vip-6", label: "Table VIP (6 pers)", multiplier: 1.35 },
  { id: "loge-8", label: "Loge Premium (8 pers)", multiplier: 1.8 },
];

function getById<T extends { id: string }>(items: T[], id: string, fallback: T) {
  return items.find((item) => item.id === id) ?? fallback;
}

export default async function ReservePage({ searchParams }: ReservePageProps) {
  const params = await searchParams;

  const promoCode = params.promo ?? null;
  const selectedClub = params.club ?? clubs[0].slug;
  const selectedEventId = params.event ?? events[0].id;
  const selectedTableId = params.table ?? tables[0].id;
  const guestsCount = Math.max(1, Number(params.guests ?? "4") || 4);

  const event = getById(events, selectedEventId, events[0]);
  const table = getById(tables, selectedTableId, tables[0]);

  const minimum = Math.round(event.min * table.multiplier);
  const prepaid = Math.round(minimum * 0.4);
  const insurance = 5;
  const totalNow = prepaid + insurance;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-zinc-900 px-4 py-10 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-fuchsia-950/40 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">NightTable · Réservation</p>
          <h1 className="mt-3 text-3xl font-bold md:text-5xl">Réserver une table VIP</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Sélectionne ton club, ta soirée et ton format de table. Le récapitulatif met à jour le minimum conso et le
            prépaiement estimé.
          </p>
          <p className="mt-4 rounded-md border border-zinc-700 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-200">
            Code promoteur détecté: <span className="font-semibold">{promoCode ?? "aucun"}</span>
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Configurer ma réservation</h2>

            <form className="mt-5 grid gap-4" method="GET" action="/reserve">
              {promoCode ? <input type="hidden" name="promo" value={promoCode} /> : null}

              <div>
                <label htmlFor="club" className="mb-1 block text-sm font-medium">Club</label>
                <select id="club" name="club" defaultValue={selectedClub} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
                  {clubs.map((club) => (
                    <option key={club.slug} value={club.slug}>{club.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="event" className="mb-1 block text-sm font-medium">Soirée</label>
                <select id="event" name="event" defaultValue={selectedEventId} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
                  {events.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="table" className="mb-1 block text-sm font-medium">Format table</label>
                <select id="table" name="table" defaultValue={selectedTableId} className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2">
                  {tables.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="guests" className="mb-1 block text-sm font-medium">Nombre de personnes</label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  defaultValue={guestsCount}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
                />
              </div>

              <button type="submit" className="rounded-md bg-white px-4 py-2 font-medium text-black">
                Mettre à jour le récapitulatif
              </button>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-lg font-semibold">Récapitulatif estimé</h3>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-300"><span>Événement</span><span>{event.label}</span></div>
                <div className="flex justify-between text-zinc-300"><span>Table</span><span>{table.label}</span></div>
                <div className="flex justify-between text-zinc-300"><span>Participants</span><span>{guestsCount}</span></div>
                <div className="flex justify-between text-zinc-300"><span>Minimum conso</span><span>{minimum}€</span></div>
                <div className="flex justify-between text-zinc-300"><span>Prépaiement (40%)</span><span>{prepaid}€</span></div>
                <div className="flex justify-between text-zinc-300"><span>Assurance no-show</span><span>{insurance}€</span></div>
              </div>

              <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-emerald-300">
                Total à payer maintenant: <span className="font-semibold">{totalNow}€</span>
              </div>
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="text-lg font-semibold">Prochaine étape</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Le paiement final Stripe et la création serveur de la réservation seront branchés sur cette sélection.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <a href="/register" className="rounded-md bg-white px-3 py-2 text-black">Continuer (inscription)</a>
                <a href="/login" className="rounded-md border border-zinc-700 px-3 py-2">J&apos;ai déjà un compte</a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
