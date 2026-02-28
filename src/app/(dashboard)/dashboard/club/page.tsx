import { createClient } from "@/lib/supabase/server";
import { createEventAction, createTableAction } from "@/lib/club.actions";

type ClubDashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ClubDashboardPage({ searchParams }: ClubDashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const clubId = user?.id ?? "";

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date, start_time, status")
    .eq("club_id", clubId)
    .order("date", { ascending: true })
    .limit(10);

  const { data: tables } = await supabase
    .from("tables")
    .select("id, name, capacity, base_price, zone")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold">Dashboard Club</h1>
        <p className="mt-1 text-sm text-zinc-400">Phase 1 — gestion événements et tables.</p>
        {params.error ? (
          <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{params.error}</p>
        ) : null}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <form action={createEventAction} className="space-y-3 rounded border border-zinc-800 p-4">
          <h2 className="text-lg font-medium">Créer un événement</h2>
          <input name="title" placeholder="Titre" required className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <textarea name="description" placeholder="Description" className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input name="date" type="date" required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
            <input name="start_time" type="time" required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </div>
          <button type="submit" className="rounded bg-white px-4 py-2 text-black">Ajouter événement</button>
        </form>

        <form action={createTableAction} className="space-y-3 rounded border border-zinc-800 p-4">
          <h2 className="text-lg font-medium">Créer une table</h2>
          <input name="name" placeholder="Nom table" required className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <div className="grid grid-cols-2 gap-3">
            <input name="capacity" type="number" min={1} defaultValue={4} required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
            <input name="base_price" type="number" min={1} step="0.01" required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          </div>
          <input name="zone" placeholder="Zone (vip, loge, terrasse...)" className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <button type="submit" className="rounded bg-white px-4 py-2 text-black">Ajouter table</button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-zinc-800 p-4">
          <h2 className="mb-3 text-lg font-medium">Événements récents</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            {(events ?? []).map((event) => (
              <li key={event.id} className="rounded bg-zinc-900 px-3 py-2">
                <p className="font-medium text-zinc-100">{event.title}</p>
                <p>{event.date} • {event.start_time} • {event.status}</p>
              </li>
            ))}
            {(events ?? []).length === 0 ? <li className="text-zinc-500">Aucun événement pour le moment.</li> : null}
          </ul>
        </div>

        <div className="rounded border border-zinc-800 p-4">
          <h2 className="mb-3 text-lg font-medium">Tables</h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            {(tables ?? []).map((table) => (
              <li key={table.id} className="rounded bg-zinc-900 px-3 py-2">
                <p className="font-medium text-zinc-100">{table.name}</p>
                <p>Capacité {table.capacity} • {table.base_price}€ {table.zone ? `• ${table.zone}` : ""}</p>
              </li>
            ))}
            {(tables ?? []).length === 0 ? <li className="text-zinc-500">Aucune table pour le moment.</li> : null}
          </ul>
        </div>
      </section>
    </div>
  );
}
