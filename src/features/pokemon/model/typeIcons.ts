import fuegoIcon from '@/assets/icons/fuego.png'
import plantaIcon from '@/assets/icons/planta.png'
import venenoIcon from '@/assets/icons/veneno.png'

import type { PokemonType } from './pokemonTypeTheme'

/**
 * PokéAPI has no type-icon asset. Three types ship a designed PNG glyph;
 * the rest use a simple vector silhouette so every type still renders an
 * icon inside its chip. Values are `background-image` CSS values, never
 * built from a dynamically-interpolated class name (Tailwind can't extract
 * those statically).
 */
const PNG_ICONS: Partial<Record<PokemonType, string>> = {
  grass: plantaIcon,
  poison: venenoIcon,
  fire: fuegoIcon,
}

const SVG_PATHS: Partial<Record<PokemonType, string>> = {
  water: 'M12 2C12 2 5 10.4 5 14.6 5 18.7 8.1 22 12 22s7-3.3 7-7.4C19 10.4 12 2 12 2z',
  bug: 'M12 2l2.2 2.2-1.2 1.2h-2L9.8 4.2 12 2zm-1 5h2c3 0 5 2.4 5 5.6 0 4-2.2 7.4-6 7.4s-6-3.4-6-7.4C6 9.4 8 7 11 7zM3 10l3 1.6-3 1.6V10zm18 0v3.2L18 11.6 21 10zM3.6 17l2.8-1v2.4L3.6 17zm16.8 0l-2.8 1.4V16l2.8 1z',
  flying:
    'M2 9c5-.6 9 .4 11.4 3.2C15 14 15.6 16.4 15.4 19c-1.6-2.2-3.4-3.6-5.6-4.4 1.6 1.6 2.6 3.4 3 5.4C9.4 18 6 14.6 2 9zm12.6-2c2.8-.6 5.4.4 7.4 3-2.4-.4-4.4 0-6 1.2-.4-1.6-.9-3-1.4-4.2z',
  normal: 'M12 3l2.6 5.4 6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.3l6-.9L12 3z',
  electric: 'M13.4 2L5 13.4h4.6L8.6 22 19 10.2h-5L15.4 2h-2z',
  ground: 'M4 15h16l2 6H2l2-6zm3-4h10l1.4 3H5.6L7 11zm3-4h4l1.2 3H8.8L10 7z',
  fairy:
    'M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2zm6 12l1.2 2.6L22 18l-2.8 1.4L18 22l-1.2-2.6L14 18l2.8-1.4L18 14z',
  fighting:
    'M7 6h6.4c1.6 0 2.6.8 2.6 2.2 0 .8-.4 1.4-1 1.8 1 .4 1.6 1.2 1.6 2.4 0 1.8-1.4 3-3.4 3H7V6zm-3 4h2v6H4c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2zm14 0h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2v-6z',
  psychic:
    'M12 2c4.4 0 8 3.4 8 7.6 0 3-1.6 4.6-3 6-1 1-1.6 1.8-1.7 3.2L15.2 22H8.8l-.1-3.2C8.6 17.4 8 16.6 7 15.6c-1.4-1.4-3-3-3-6C4 5.4 7.6 2 12 2zm0 4a3.6 3.6 0 100 7.2A3.6 3.6 0 0012 6z',
  rock: 'M9 3h7l5 6-4 12H7L2 12l7-9zm.6 3.4L5 12l3.4 6h7l2.8-8.4L14 6.4H9.6z',
  ice: 'M11 2h2v20h-2V2zM3.4 6.4l1-1.7L21.6 15l-1 1.7L3.4 6.4zm0 11.2L20.6 7.3l1 1.7L4.4 19.3l-1-1.7z',
  ghost:
    'M12 2c4.4 0 7 3.2 7 7.6V22l-2.4-2-2.3 2-2.3-2-2.3 2L7.4 20 5 22V9.6C5 5.2 7.6 2 12 2zM9.6 8a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zm4.8 0a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z',
  dragon:
    'M2 7l5-2 3 3h5l3-3 4 3-3 4 2 3-6 2-1 3-4-2-4 2 .6-4L3 14l2-3L2 7zm8 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  steel:
    'M12 2l4 2.4v4.8L12 11.6 8 9.2V4.4L12 2zM4 8.6l4 2.4v4.8L4 18.2 0 15.8V11L4 8.6zm16 0L24 11v4.8l-4 2.4-4-2.4V11l4-2.4zM12 14l4 2.4v4.8L12 23.6 8 21.2v-4.8L12 14z',
  dark: 'M15 2a10 10 0 100 20 8 8 0 010-20zm5 3l1.2 2.4L23.6 8.6 21.2 9.8 20 12.2l-1.2-2.4L16.4 8.6l2.4-1.2L20 5z',
}

export interface TypeIcon {
  /** Ready-to-use CSS `background-image` value. */
  backgroundImage: string
  /** PNG glyphs render slightly smaller/offset than the vector ones in the design. */
  isRaster: boolean
}

const buildSvgDataUrl = (path: string, color: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${path}" fill="${color}"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Returns null for a type with neither a PNG nor a vector glyph (none currently). */
export const getTypeIcon = (type: PokemonType, color: string): TypeIcon | null => {
  const png = PNG_ICONS[type]
  if (png) return { backgroundImage: `url(${png})`, isRaster: true }

  const path = SVG_PATHS[type]
  if (path) return { backgroundImage: buildSvgDataUrl(path, color), isRaster: false }

  return null
}
