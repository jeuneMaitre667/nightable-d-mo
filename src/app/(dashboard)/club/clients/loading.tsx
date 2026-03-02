export default function ClubClientsLoading(): React.JSX.Element {
  return (
    <section className="space-y-6">
      <div className="h-12 w-52 rounded-lg bg-[#12172B] animate-pulse" />

      <div className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <div className="h-44 rounded-xl bg-[#12172B] animate-pulse" />
        <div className="h-44 rounded-xl bg-[#12172B] animate-pulse" />
      </div>

      <div className="rounded-xl bg-[#12172B] p-4 animate-pulse">
        <div className="mb-4 h-10 w-full rounded bg-[#0A0F2E]" />
        <div className="space-y-3">
          <div className="h-14 rounded bg-[#0A0F2E]" />
          <div className="h-14 rounded bg-[#0A0F2E]" />
          <div className="h-14 rounded bg-[#0A0F2E]" />
          <div className="h-14 rounded bg-[#0A0F2E]" />
        </div>
      </div>
    </section>
  );
}
