type ReservePageProps = {
  searchParams: Promise<{ promo?: string }>;
};

export default async function ReservePage({ searchParams }: ReservePageProps) {
  const params = await searchParams;
  const promoCode = params.promo ?? null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold">Réserver une table</h1>
      <p className="mt-3 text-zinc-600">
        Code promoteur détecté: {promoCode ?? "aucun"}
      </p>
    </main>
  );
}
