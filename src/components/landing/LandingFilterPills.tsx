"use client";

// Pills "Ce soir" / "Ce week-end" pour la section clubs de la landing (aligné design Velvet Rope).

type Filter = "tonight" | "weekend";

export function LandingFilterPills({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (v: Filter) => void;
}) {
  return (
    <div className="flex rounded-full p-0.5 bg-[#111118] border border-[#2A2A35]">
      <button
        type="button"
        onClick={() => onChange("tonight")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          value === "tonight"
            ? "bg-[#111118] text-[#FAFAFA] border border-[#7C3AED]"
            : "text-[#A1A1AA] hover:text-[#FAFAFA]"
        }`}
      >
        Ce soir
      </button>
      <button
        type="button"
        onClick={() => onChange("weekend")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          value === "weekend"
            ? "bg-[#111118] text-[#FAFAFA] border border-[#7C3AED]"
            : "text-[#A1A1AA] hover:text-[#FAFAFA]"
        }`}
      >
        Ce week-end
      </button>
    </div>
  );
}
