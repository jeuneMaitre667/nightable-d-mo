// Page: Femmes VIP (Club)
// NightTable usage: dashboard club, gestion des profils Femmes VIP
import type { ReactElement } from "react"

export default function ClubFemmesVipPage(): ReactElement {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#C9973A] mb-4">Femmes VIP</h1>
      <p className="text-[#F7F6F3] mb-2">Gérez ici les profils Femmes VIP associés à votre club.</p>
      {/* TODO: Ajouter la liste, l’invitation et la gestion des profils Femmes VIP */}
      <div className="bg-[#12172B] border border-[#C9973A]/15 rounded-xl p-6 mt-6">
        <span className="text-[#888]">Aucune Femme VIP pour le moment.</span>
      </div>
    </div>
  )
}
