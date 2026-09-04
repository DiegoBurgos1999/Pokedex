import { formatDecimal } from '@/shared/utils/formatDecimal'
import { formatPokemonNumber } from '@/shared/utils/pad'

import type { PokemonDetail } from '../model/pokemon.model'
import { TYPE_NAME_ES } from '../model/typeCopy'

/**
 * Text copied to the clipboard by the detail page's share button: the
 * Pokémon's name followed by its visible attributes, comma-separated, in
 * the same order they appear on the page.
 */
export const buildShareText = (detail: PokemonDetail): string =>
  [
    detail.name,
    formatPokemonNumber(detail.id),
    ...detail.types.map((type) => TYPE_NAME_ES[type]),
    `${formatDecimal(detail.weightKg)} kg`,
    `${formatDecimal(detail.heightM)} m`,
    detail.category,
    detail.ability,
  ]
    .filter(Boolean)
    .join(', ')
