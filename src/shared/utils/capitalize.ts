/** PokéAPI names are all lowercase; this capitalizes just the first letter. */
export const capitalize = (value: string): string =>
  value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1)
