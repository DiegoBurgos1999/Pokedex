import onboardingStep1 from '@/assets/illustrations/onboarding-step-1.png'
import onboardingStep2 from '@/assets/illustrations/onboarding-step-2.png'

export const onboardingCopy = {
  loading: 'Cargando Pokédex',
  steps: [
    {
      eyebrow: 'Paso 1 de 2',
      title: 'Todos los Pokémon en un solo lugar',
      body: 'Accede a una amplia lista de Pokémon de todas las generaciones creadas por Nintendo.',
      illustration: onboardingStep1,
    },
    {
      eyebrow: 'Paso 2 de 2',
      title: 'Mantén tu Pokédex actualizada',
      body: 'Regístrate y guarda tu perfil, Pokémon favoritos, configuraciones y mucho más en la aplicación.',
      illustration: onboardingStep2,
    },
  ],
  continueLabel: 'Continuar',
  startLabel: 'Empecemos',
} as const
