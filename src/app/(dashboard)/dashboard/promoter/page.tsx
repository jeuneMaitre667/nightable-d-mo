import { addGuestAction } from "@/lib/promoter.actions";
import { createClient } from "@/lib/supabase/server";

type PromoterDashboardPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function PromoterDashboardPage({ searchParams }: PromoterDashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const promoterId = user?.id ?? "";

  const { data: events } = await supabase
    .from("events")
    .select("id, title, date")
    .eq("status", "published")
    .order("date", { ascending: true })
    .limit(30);

  const { data: guestList } = await supabase
    .from("guest_lists")
    .select("id, guest_name, guest_phone, status, added_at, events(title)")
    .eq("promoter_id", promoterId)
    .order("added_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold">Dashboard Promoteur</h1>
        <p className="mt-1 text-sm text-zinc-400">Phase 1 — guest list digitale.</p>
        {params.error ? (
          <p className="mt-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">{params.error}</p>
        ) : null}
      </section>

      <section className="rounded border border-zinc-800 p-4">
        <h2 className="text-lg font-medium">Ajouter un invité</h2>
        <form action={addGuestAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <select name="event_id" required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2">
            <option value="">Sélectionner un événement</option>
            {(events ?? []).map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} — {event.date}
              </option>
            ))}
          </select>
          <input name="guest_name" placeholder="Nom invité" required className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <input name="guest_phone" placeholder="Téléphone (optionnel)" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2" />
          <button type="submit" className="rounded bg-white px-4 py-2 text-black md:col-span-3 md:w-fit">Ajouter à la guest list</button>
        </form>
      </section>

      <section className="rounded border border-zinc-800 p-4">
        <h2 className="mb-3 text-lg font-medium">Mes invités récents</h2>
        <ul className="space-y-2 text-sm text-zinc-300">
          {(guestList ?? []).map((guest) => (
            <li key={guest.id} className="rounded bg-zinc-900 px-3 py-2">
              <p className="font-medium text-zinc-100">{guest.guest_name}</p>
              <p>
                {guest.events?.[0]?.title ?? "Événement"} • {guest.status}
                {guest.guest_phone ? ` • ${guest.guest_phone}` : ""}
              </p>
            </li>
          ))}
          {(guestList ?? []).length === 0 ? <li className="text-zinc-500">Aucun invité ajouté pour le moment.</li> : null}
        </ul>
      </section>
    </div>
  );
}
