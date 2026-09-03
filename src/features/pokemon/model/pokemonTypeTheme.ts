/**
 * Visual theme for each Pokemon type.
 *
 * Values point at CSS custom properties declared in tokens.css rather than
 * hard-coded hex, so the palette has a single source of truth. Tailwind
 * extracts class names statically, which rules out `bg-type-${type}`; these
 * variables are meant to be bound through inline styles instead.
 */

export const POKEMON_TYPES = [
  'grass',
  'poison',
  'fire',
  'water',
  'bug',
  'flying',
  'normal',
  'electric',
  'ground',
  'fairy',
  'fighting',
  'psychic',
  'rock',
  'ice',
  'ghost',
  'dragon',
  'steel',
  'dark',
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]

export interface PokemonTypeTheme {
  /** Solid fill: chips, badges, accent bars. */
  base: string
  /** Tinted background: card surfaces, detail hero. */
  soft: string
  /** Gradient end and hover state. */
  strong: string
}

const cssVar = (name: string) => `var(${name})`

/**
 * PokeAPI can return types outside this list (`stellar`, `unknown`). Callers
 * must go through `getTypeTheme`, which falls back to `normal` instead of
 * rendering an unresolved CSS variable.
 */
const THEMES = Object.fromEntries(
  POKEMON_TYPES.map((type) => [
    type,
    {
      base: cssVar(`--color-type-${type}`),
      soft: cssVar(`--color-type-${type}-soft`),
      strong: cssVar(`--color-type-${type}-strong`),
    },
  ]),
) as Record<PokemonType, PokemonTypeTheme>

const FALLBACK_TYPE: PokemonType = 'normal'

export const isKnownType = (value: string): value is PokemonType =>
  POKEMON_TYPES.includes(value as PokemonType)

/** Maps an unrecognized PokéAPI type (`stellar`, `unknown`) to the fallback theme instead of dropping it. */
export const toKnownType = (value: string): PokemonType =>
  isKnownType(value) ? value : FALLBACK_TYPE

export const getTypeTheme = (type: string): PokemonTypeTheme =>
  THEMES[isKnownType(type) ? type : FALLBACK_TYPE]

/** Hero gradient used by the card and the detail header. */
export const getTypeGradient = (type: string): string => {
  const { base, strong } = getTypeTheme(type)
  return `linear-gradient(135deg, ${strong} 0%, ${base} 100%)`
}
