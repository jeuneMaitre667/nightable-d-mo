export default function ClubReservationsLoading(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#C9973A]/15 bg-[linear-gradient(135deg,rgba(10,15,46,0.9)_0%,rgba(18,23,43,0.96)_100%)] p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[#2A2F4A]" />
        <div className="mt-3 h-8 w-56 animate-pulse rounded bg-[#2A2F4A]" />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`reservation-kpi-${index}`} className="rounded-xl border border-white/5 bg-[#1A1D24] p-5">
            <div className="h-3 w-28 animate-pulse rounded bg-[#2A2F4A]" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-[#2A2F4A]" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/5 bg-[#1A1D24] p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`reservation-row-${index}`} className="mb-3 h-12 w-full animate-pulse rounded bg-[#2A2F4A]" />
        ))}
      </div>
    </div>
  );
}
