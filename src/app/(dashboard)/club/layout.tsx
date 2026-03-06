// layout.tsx — Club dashboard section (parent layout)
import type { ReactNode } from 'react'

export default function ClubDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-[#050508]">
      {children}
    </section>
  )
}
