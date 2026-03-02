'use client'

import { HeroUIProvider } from '@heroui/react'

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return <HeroUIProvider>{children}</HeroUIProvider>
}