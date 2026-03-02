export default function VipDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-28 rounded-xl bg-[#12172B] animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-56 rounded-xl bg-[#12172B] animate-pulse" />
        <div className="h-56 rounded-xl bg-[#12172B] animate-pulse" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-xl bg-[#12172B] animate-pulse" />
        <div className="h-80 rounded-xl bg-[#12172B] animate-pulse" />
      </div>
    </div>
  );
}
