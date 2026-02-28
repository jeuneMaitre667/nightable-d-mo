import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NightTable — Réservation de tables VIP à Paris',
  description:
    'Réservez votre table dans les clubs les plus exclusifs de Paris. Prix dynamiques, expérience VIP, réservation instantanée.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="bg-[#050508] antialiased">{children}</body>
    </html>
  )
}
