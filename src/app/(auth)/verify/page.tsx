type VerifyPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-semibold">Vérification</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Un email de confirmation a été envoyé à {params.email ?? "votre adresse"}.
      </p>
    </main>
  );
}
