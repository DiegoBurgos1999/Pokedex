interface QueryMatchable {
  id: number
  name: string
}

/** Whether an already-trimmed, lowercased query matches by name or numeric id. */
export const matchesPokemonQuery = (entry: QueryMatchable, query: string): boolean =>
  entry.name.toLowerCase().includes(query) || String(entry.id).includes(query)
