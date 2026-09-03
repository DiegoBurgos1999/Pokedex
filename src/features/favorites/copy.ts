export const favoritesCopy = {
  eyebrow: 'Tu colección',
  title: 'Favoritos',
  backToPokedex: 'Volver a Pokedex',
  emptyTitle: 'Aún no tienes favoritos',
  emptyDescription:
    'Toca el corazón en cualquier Pokémon para guardarlo aquí y encontrarlo más rápido.',
  exploreAction: 'Explorar Pokedex',
  confirmTitle: (name: string) => `¿Quitar a ${name} de favoritos?`,
  confirmDescription:
    'Dejará de aparecer en tu lista de favoritos. Podrás volver a agregarlo cuando quieras.',
  confirmYes: 'Sí, quitar de favoritos',
  confirmCancel: 'Cancelar',
  addedToast: (name: string) => `${name} añadido a favoritos`,
  removedToast: (name: string) => `${name} quitado de favoritos`,
} as const
