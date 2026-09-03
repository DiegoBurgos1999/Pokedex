# CLAUDE.md

Guidance for AI agents and humans working in this repository.
Read this file completely before writing any code.

## Project

A Pokédex single-page application built with Vue 3. Data comes from the public
[PokéAPI](https://pokeapi.co/). The goal of this project is to demonstrate
excellent frontend craft: architecture, readability, component separation and
testing. Feature breadth is secondary to code quality.

The visual reference is the Claude Design export in `design/`. It is a source
of truth for layout, tokens and states — it is not code to copy, and it is not
Vue.

## Language policy

- **Code is English.** Identifiers, file names, types, comments, test names,
  commit messages, documentation.
- **User-facing copy is Spanish.** Every visible string matches the design
  exactly: `Pokedex`, `Regiones`, `Favoritos`, `Perfil`, `Filtros`,
  `Buscar Pókemon...`, `Próximamente`, and so on.

Do not translate the UI. Do not write Spanish identifiers. No i18n library —
Spanish strings live in a `copy.ts` constant per feature so they are not
scattered through templates.

## Screens

All screens in the design are implemented, including the ones without
behaviour behind them.

| Route          | View                | Status                                |
| -------------- | ------------------- | ------------------------------------- |
| `/`            | `SplashView`        | Boot screen, then redirects           |
| `/onboarding`  | `OnboardingView`    | Shown once per session                |
| `/pokedex`     | `PokedexView`       | Full behaviour: search, filters, list |
| `/pokemon/:id` | `PokemonDetailView` | Full behaviour                        |
| `/favorites`   | `FavoritesView`     | Full behaviour                        |
| `/regions`     | `ComingSoonView`    | Static "Próximamente" state           |
| `/profile`     | `ComingSoonView`    | Static "Próximamente" state           |

`ComingSoonView` is a single shared component parameterised by title and
illustration. Two nearly identical views would violate DRY for no benefit.

Splash and onboarding follow the design's flow: splash on boot, onboarding once,
then the Pokédex. The "already onboarded" flag lives in memory, consistent with
the favorites decision below — a reload replays the flow.

The sidebar is collapsible (`268px` expanded, `92px` collapsed) and its
Favoritos entry shows a live counter badge.

## Stack

| Concern      | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | Vue 3, Composition API, `<script setup>` |
| Language     | TypeScript (strict)                      |
| Build        | Vite                                     |
| Routing      | Vue Router 5                             |
| Server state | TanStack Vue Query                       |
| Client state | Pinia (setup stores)                     |
| Styling      | Tailwind CSS v4 + design tokens          |
| Testing      | Vitest + @vue/test-utils                 |
| Linting      | ESLint (flat config) + Prettier          |

## Commands

```bash
pnpm dev            # start dev server
pnpm build          # type-check + production build
pnpm preview        # preview production build
pnpm lint           # ESLint, fails on warnings
pnpm format         # Prettier write
pnpm typecheck      # vue-tsc --noEmit
pnpm test           # Vitest run
pnpm test:watch     # Vitest watch mode
pnpm test:coverage  # Vitest with coverage report
```

Before considering any task complete, `pnpm lint`, `pnpm typecheck` and
`pnpm test` must all pass.

## Architecture

Feature-based. A feature owns its data access, domain model, state, components
and views. Anything used by more than one feature moves to `shared/`.

```
design/                # Claude Design export, read-only reference
src/
  app/
    App.vue
    router/            # route definitions, lazy-loaded views
    providers/         # Vue Query client, Pinia instance
    layouts/           # AppLayout with the collapsible sidebar
  features/
    pokemon/
      api/             # endpoint functions, raw DTO types
      mappers/         # DTO -> domain model
      model/           # domain types, pokemonTypeTheme.ts
      composables/     # usePokemonList, usePokemonDetail, usePokemonSearch
      components/      # PokemonCard, PokemonFilters, PokemonList
      views/           # PokedexView, PokemonDetailView
      copy.ts          # Spanish UI strings
    favorites/
      store/           # useFavoritesStore
      composables/     # useFavoriteToggle
      components/      # FavoriteButton, FavoritesEmptyState
      views/           # FavoritesView
      copy.ts
    onboarding/
      views/           # SplashView, OnboardingView
      copy.ts
  shared/
    api/               # http client, base URL, error normalization
    ui/                # BaseButton, BaseInput, BaseCard, BaseSpinner,
                       # BaseSkeleton, TypeChip, ComingSoonView
    composables/       # generic, feature-agnostic composables
    utils/
    styles/            # tokens.css
  main.ts
```

### Layer rules

Data flows in one direction:

```
api/ -> mappers/ -> composables/ -> components/ -> views/
```

- Components and views **never** call `fetch` or an API function directly. They
  consume composables.
- API functions return raw PokéAPI DTOs. Nothing outside `api/` and `mappers/`
  may reference a DTO shape.
- Mappers translate DTOs into domain models. The rest of the app only knows
  domain models, so a change in PokéAPI's response shape is contained to one
  file.
- `shared/ui` components are presentational: props in, events out, no store
  access, no data fetching.

## Coding conventions

- Component files are `PascalCase.vue`; every other file is `camelCase.ts`.
- Component names are always multi-word (`PokemonCard`, never `Card`).
- Composables are `useSomething.ts` and return an object, never a bare value.
- Prefer named exports. Default exports only for `.vue` files.
- No `any`. Use `unknown` plus narrowing when a type is genuinely open.
- Props and emits are typed with `defineProps<T>()` and `defineEmits<T>()`.
- Use `defineModel()` for two-way bindings instead of manual `update:*` events.
- A file over ~200 lines is a signal to extract. Propose the split rather than
  letting it grow.

## State management

- **Server state lives in Vue Query.** Anything fetched from PokéAPI is a query.
  Do not copy query results into Pinia.
- **Client state lives in Pinia.** Currently: favorites, sidebar collapsed,
  onboarding seen.
- Favorites are held **in memory only** and are intentionally lost on reload.
  This is a deliberate scope decision, not an oversight. Persistence would be a
  one-line addition (`pinia-plugin-persistedstate` or `useLocalStorage`); do not
  add it without being asked.
- Favorites store a `PokemonSummary` (id, name, sprite, types), not the full
  detail payload, so the Favorites view renders without extra requests.
- Stores are written as setup stores and expose intent-revealing actions
  (`toggleFavorite`, `isFavorite`), never raw state mutation from outside.

## Data layer

The design was built against a hard-coded mock. **The app uses the live API.**
No fixture data ships in `src/` — mocks exist only inside tests.

Base URL: `https://pokeapi.co/api/v2`, configured through an env variable.

Scope: **generation 1, 151 Pokémon**, matching the design's own copy
("151 Pokémon de la primera generación disponibles").

Query key convention: `['pokemon', 'index']`, `['pokemon', 'detail', id]`,
`['pokemon', 'types']`.

### Index and search

`GET /pokemon?limit=151&offset=0` returns names and URLs for the whole scope in
one cheap request, cached with `staleTime: Infinity`. Search filters that index
client-side with a debounced input (~300ms) — PokéAPI has no search endpoint.

### Detail

`GET /pokemon/{id}` per card, resolved lazily as batches become visible, and
`GET /pokemon-species/{id}` on the detail view for description and category.
Vue Query deduplicates and caches these, so navigating list -> detail -> back is
instant and refetch-free.

### Pagination

A **"Load more" button**, 12 items per batch (`--page-size` in tokens.css),
matching the design. Implemented by growing a page counter over the cached
index, not by paginating the API.

### Filters

Type filters use `GET /type/{name}`, which returns its own list and therefore
replaces the index-driven list rather than filtering it. Keep the two modes
explicitly separated in `usePokemonList` instead of unifying them with
conditionals. Active filters render as removable chips.

### Loading, empty and error states

The design specifies four list states — `ready`, `skeleton`, `empty`, `error` —
and all four must be implemented, on every screen that fetches:

- **Skeleton**: shimmer placeholders matching card geometry, never a spinner.
- **Empty**: distinct copy for "no results for this search" and "no favorites
  yet".
- **Error**: message plus a retry action wired to Vue Query's `refetch`.

There is no fifth silent state. A component that can fetch must handle all four.

## Styling

- Tailwind v4, configured CSS-first with `@theme` in
  `src/shared/styles/tokens.css`, generated from the design export.
- **Never** write a literal color, spacing, radius, shadow or font-size in a
  component — use a token.
- Type colors come from `getTypeTheme()` in `pokemonTypeTheme.ts`. Never build
  class names dynamically (`bg-type-${type}`); Tailwind extracts statically and
  would drop them.
- Desktop-first, since the export is the desktop breakpoint. Degrade gracefully
  below `1024px`; the sidebar collapses to icons.
- Dark mode is out of scope.

## Accessibility

Baseline, non-negotiable:

- Semantic elements: real `<button>`, `<a>`, `<ul>`, `<nav>`.
- The favorite toggle exposes state via `aria-pressed` and has an accessible
  Spanish label.
- All images have meaningful `alt` text.
- Visible focus states on every interactive element.
- Full keyboard operability, including the filter modal (focus trap, Escape to
  close, focus returned to the trigger).
- `prefers-reduced-motion` is honoured; tokens.css already disables the hover
  lifts, shimmer and float animations.

## Testing

Vitest with `@vue/test-utils` and `happy-dom`. HTTP is stubbed with simple
manual mocks (`vi.mock` on the api module) — no MSW in this project.

Tests are colocated in `__tests__/` folders next to the code under test.

What must be tested:

- **Mappers** — every DTO-to-domain transformation, including missing fields.
- **Stores** — favorites add, remove, toggle, `isFavorite`, duplicate handling.
- **Composables** — filtering, debounced search, load-more logic, the four
  fetch states.
- **UI components with logic or conditional rendering** — `PokemonCard`,
  `FavoriteButton`, `PokemonFilters`, `PokemonList` state switching.

Not tested: trivial presentational wrappers, `ComingSoonView`, and views
(covered indirectly by their components).

Test the observable behavior, not the implementation. Assert on rendered output
and emitted events, never on internal refs or private methods. Test names read
as sentences: `it('marks a pokemon as favorite when the button is clicked')`.

## Comments

Comment the _why_, never the _what_. A comment is warranted for a non-obvious
algorithm, an API workaround, or a decision a future reader would otherwise
undo. Do not annotate self-evident lines, do not add file headers, do not write
JSDoc for functions whose signature already says everything.

## Git

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`,
  `docs:`.
- Branches: `feat/pokemon-list`, `fix/favorites-toggle`.
- `lint-staged` runs ESLint and Prettier on staged files via a pre-commit hook.
- Never commit commented-out code or `console.log`.

## Working agreement for agents

1. **Plan first.** For anything beyond a trivial edit, produce a short plan and
   wait for confirmation before writing code.
2. **Do not install dependencies** without proposing them and explaining the
   tradeoff first.
3. **One screen or one layer per task.** Do not implement the whole app in a
   single pass.
4. **Build bottom-up:** api + mappers + types, then store, then `shared/ui`
   atoms, then feature components, then views, then routing.
5. **Finish green.** Run lint, typecheck and tests before declaring a task done,
   and report the result.
6. **Never port the mock.** The design's hard-coded arrays are illustrative.
   Every value on screen comes from the API or from user state.
7. **Ask when the spec is ambiguous** instead of inventing product behavior.

## Out of scope

Authentication, custom backend, i18n, SSR, E2E tests, dark mode, favorites
persistence, offline support, and behaviour behind Regiones and Perfil.
