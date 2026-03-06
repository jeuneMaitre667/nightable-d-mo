'use client'


type ProvidersProps = {
  children: React.ReactNode
}

// Pré-configuration HeroUI pour le thème Banani NightTable Booking (réservé)
const _heroUITheme = {
  colors: {
    primary: {
      DEFAULT: '#7C3AED',
      foreground: '#FFFFFF',
    },
    background: '#09090B',
    foreground: '#FAFAFA',
  },
};

export function Providers({ children }: ProvidersProps): React.JSX.Element {
  // HeroUIProvider désactivé pour debug crash
  // <HeroUIProvider theme={heroUITheme}>{children}</HeroUIProvider>
  return <>{children}</>;
}