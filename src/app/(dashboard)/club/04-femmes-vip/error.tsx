"use client";
export default function ErrorFemmesVip() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#C4567A] mb-4">Erreur</h1>
      <p className="text-[#F7F6F3] mb-2">Impossible de charger la page Femmes VIP.</p>
      <button className="mt-4 px-4 py-2 bg-[#C9973A] text-[#050508] rounded-lg font-semibold" onClick={() => location.reload()}>Réessayer</button>
    </div>
  )
}
