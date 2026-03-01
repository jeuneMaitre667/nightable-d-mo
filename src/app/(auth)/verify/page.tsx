// Component: VerifyPage
// Reference: component.gallery/components/toast
// Inspired by: Atlassian Design System pattern
// NightTable usage: post-registration email confirmation notice

import type { ReactElement } from "react";

type VerifyPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps): Promise<ReactElement> {
  const params = await searchParams;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#050508] px-6 py-20 text-[#F7F6F3]">
      <section className="rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-6">
      <h1 className="nt-heading text-3xl text-[#F7F6F3]">Vérification</h1>
      <p className="mt-2 text-sm text-[#888888]">
        Un email de confirmation a été envoyé à {params.email ?? "votre adresse"}.
      </p>
      </section>
    </main>
  );
}
