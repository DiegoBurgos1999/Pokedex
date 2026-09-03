# Pokédex

Vue 3 single-page application built on top of the public
[PokéAPI](https://pokeapi.co/).

Read [`CLAUDE.md`](./CLAUDE.md) before contributing. It documents the
architecture, conventions and the decisions behind them.

## Requirements

Node 22 (see `.nvmrc`) and pnpm.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Development server                      |
| `pnpm build`         | Type-check and production build         |
| `pnpm preview`       | Serve the production build              |
| `pnpm lint`          | ESLint, fails on any warning            |
| `pnpm format`        | Prettier write                          |
| `pnpm typecheck`     | `vue-tsc` across all project references |
| `pnpm test`          | Vitest, single run                      |
| `pnpm test:coverage` | Vitest with coverage report             |

## Structure

```
design/     Claude Design export, read-only visual reference
src/app/    Application shell: router, providers, layouts
src/features/   Feature modules, each owning its api, model, state and views
src/shared/     Cross-feature primitives: http client, ui atoms, tokens
```

## Status

All screens in `CLAUDE.md`'s table are implemented against the live PokéAPI:
splash, onboarding, Pokedex (search, type filters, pagination, all four list
states), Pokémon detail (weaknesses, gender ratio, share-to-clipboard),
favorites (in-memory, with remove confirmation) and the coming-soon
placeholders for Regiones and Perfil.
