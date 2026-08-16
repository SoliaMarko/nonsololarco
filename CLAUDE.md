# CLAUDE.md

**nonsololarco** — a social platform and practice tool for musicians, retro
aesthetic. Turborepo + pnpm: `apps/web` (Next.js 15, React 19, Tailwind v4),
`apps/api` (NestJS 11), `packages/db` (Prisma 7 + PostgreSQL),
`packages/types` (shared types — the source of truth), `packages/ui`.

This file is **process**. It is deliberately short because it loads into every
session. Detail lives elsewhere and is read on demand.

## Where to look

| You need                                                           | File                                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Cold start: core rules, repo traps, routing                        | **[`docs/ai/ORIENTATION.md`](./docs/ai/ORIENTATION.md)** ← start here |
| Step by step: add a component / endpoint / migration / translation | [`docs/ai/RECIPES.md`](./docs/ai/RECIPES.md)                          |
| Branches, commit messages, commit size, rebase vs merge            | [`docs/ai/GIT.md`](./docs/ai/GIT.md)                                  |
| Does this component / util / route / type already exist?           | [`docs/ai/MAP.md`](./docs/ai/MAP.md) — generated, `pnpm ai:map`       |
| How code should look: styles, tokens, CVA, naming                  | `nonsololarco-conventions` skill                                      |
| Features, API, DB schema, decisions                                | `docs/features/`, `docs/architecture/`, `docs/adr/`                   |
| What is planned to change and why                                  | [`docs/REFACTORING-PLAN.md`](./docs/REFACTORING-PLAN.md)              |

**Before writing anything, check `MAP.md` for an existing implementation.**
A duplicate drifts from the original and doubles the maintenance.

## Definition of done

A task is not finished when the code works. It is finished when the next
person can find it, understand it and change it.

1. **Tests written.** Unit tests for every new module, in the same commit. E2E
   if the feature meets the criteria in [Testing policy](#testing-policy).
2. **JSDoc written.** Every utility, hook and service method — see
   [JSDoc](#jsdoc--required-on-every-utility).
3. **Docs updated.** Check the table in
   [Documentation policy](#documentation-policy) against what changed, and
   update or create the file it points to. This is not optional and not
   "later".
4. **Index updated.** A new doc file must be linked from `docs/README.md`,
   or nobody will find it.
5. **Checks pass.** `pnpm typecheck && pnpm lint && pnpm test`.

If a step doesn't apply — a pure refactor needs no feature doc — say so
explicitly in the summary rather than skipping it silently. That way the person
reviewing knows it was considered, not forgotten.

Never mark work complete with a failing typecheck, a skipped test, or a doc
that now describes behaviour the code no longer has.

---

## Project

**nonsololarco** ("non solo arco" — not only the bow) is a musician social
platform and practice tool with a retro/vintage aesthetic. Turborepo monorepo,
pnpm workspaces.

```text
apps/
  web/            Next.js 15 App Router, React 19, Tailwind v4
  api/            NestJS 11, Prisma 7, PostgreSQL
packages/
  types/          @nonsololarco/types — shared TS types (source of truth)
  db/             @nonsololarco/db — Prisma schema, migrations, seed
  ui/             @repo/ui — shared React components
docs/             Feature docs, architecture, ADRs
```

## Commands

Run from the repo root unless noted.

```sh
pnpm dev                  # all apps (web :3000, api :3001)
pnpm build                # build everything
pnpm typecheck            # tsc --noEmit across the monorepo
pnpm lint
pnpm test                 # unit tests, all packages
pnpm format               # prettier
```

Per-app:

```sh
pnpm --filter web test            # web unit tests (vitest, jsdom)
pnpm --filter web test:watch
pnpm --filter web storybook
pnpm --filter web e2e             # Playwright e2e
pnpm --filter api test            # api unit tests (vitest)
pnpm --filter api test:e2e        # api e2e (supertest)
pnpm --filter api start:dev
```

Database (`packages/db`):

```sh
pnpm --filter @nonsololarco/db db:migrate    # create + apply migration
pnpm --filter @nonsololarco/db db:generate   # regenerate Prisma client
pnpm --filter @nonsololarco/db db:seed       # seed dev data
pnpm --filter @nonsololarco/db db:studio     # Prisma Studio
pnpm --filter @nonsololarco/db db:reset      # drop, re-migrate, regenerate
```

**After any `schema.prisma` change:** `db:migrate` (applies to DB) **and**
`db:generate` (regenerates the TS client). Running only one of them produces
confusing runtime errors — a missing table, or `Cannot read properties of
undefined`.

Seeding preserves your OAuth account when `SEED_USER_EMAIL` is set:

```sh
SEED_USER_EMAIL=you@example.com pnpm --filter @nonsololarco/db db:seed
```

---

## Code quality rules

### No nested ternaries

A ternary may not contain another ternary in either branch. Extract a helper,
a lookup map, or an early return instead.

```tsx
// ❌
const color = isSelected ? "red" : isArchived ? "grey" : "green";

// ✅ lookup map
const STATUS_COLOR = {
  selected: "red",
  archived: "grey",
  default: "green",
} as const;
const color = STATUS_COLOR[resolveState(track)];

// ✅ or a small named helper
function borderColor(track: Track, isSelected: boolean): string {
  if (isSelected) return "red";
  if (track.status === "archived") return "grey";
  return "green";
}
```

A single ternary is fine, including in JSX (`{cond ? <A /> : null}`).

### No nested `if`

Do not nest an `if` inside another `if`. Use guard clauses, early returns, or
combine the conditions.

```ts
// ❌
if (user) {
  if (user.isActive) {
    doThing();
  }
}

// ✅
if (!user?.isActive) return;
doThing();
```

Applies to the JSX equivalent too — don't nest conditional blocks. If a
component needs three or more branches of markup, split it into components.

### Arrow functions for local helpers

Inside React components, local helper functions use arrow function expressions
(`const fn = () => {}`), not function declarations. This prevents hoisting
surprises and keeps a consistent style. Component declarations themselves
remain function declarations (`export default function Component`).

```tsx
// ❌
function handleSort(field: SortField) { ... }

// ✅
const handleSort = (field: SortField) => { ... };
```

### JSX conditional rendering — ternary only

Always use the ternary pattern for conditional rendering in JSX, never `&&`.
Enforced by `react/jsx-no-leaked-render` in ESLint.

```tsx
// ❌
{
  isVisible && <Panel />;
}

// ✅
{
  isVisible ? <Panel /> : null;
}
```

### JSDoc — required on every utility

Every exported utility, hook, service method and non-trivial helper carries a
JSDoc block. No exceptions for one-liners: if it's worth exporting, it's worth
explaining.

**Document what the types can't say.** TypeScript already states the shapes —
repeating them adds noise. Spend the comment on intent, units, edge-case
behaviour, and the reason the function exists at all.

```ts
// ❌ restates the signature, says nothing
/**
 * Formats a duration.
 * @param totalSeconds The total seconds
 * @returns A string
 */

// ✅ says what the caller can't infer
/**
 * Formats a second count as human-readable text — `"3 hr 20 min"`, or
 * `"45 min"` under an hour.
 *
 * Rounds to the nearest minute, carrying 60 up to the next hour so callers
 * never see `"2 hr 60 min"`.
 */
export function formatDuration(totalSeconds: number): string {
```

**Rules**

- Open with one sentence saying what it does, in the present tense.
- State units and formats explicitly — `"m:ss"`, seconds, basis points. Most
  bugs in this repo have come from an ambiguous duration.
- Document the empty, zero and error cases: what does it return for `[]`, for
  an unknown id, for `null`?
- Use `@param` / `@returns` **only** when the name doesn't already make it
  obvious. Don't pad.
- Add `@example` for anything with non-obvious call shape or output.
- Note surprising constraints or coupling: "the lead member is not included",
  "must be called after the query, not in `orderBy`".
- React components take a JSDoc on the component plus comments on any prop
  whose purpose isn't clear from its name.

Applies to: `*.utils.ts`, hooks, Nest service and controller methods, exported
constants whose meaning isn't self-evident, and any shared type where a field
has a constraint the type can't express.

### General

- TypeScript strict mode; no `any`, no non-null `!` unless provably safe.
- Shared types go in `packages/types` and are imported by both apps. Never
  duplicate a shape that already exists there.
- Sort interface keys alphabetically (enforced by
  `eslint-plugin-typescript-sort-keys`).
- Prefer named exports; default export only for React components and
  Nest modules.
- Comments explain _why_, not _what_. Delete commented-out code.

---

## Testing policy

**Unit tests for everything.** Every new module ships with tests in the same
commit, with no exception for "simple" code. Cover the happy path, the
empty/zero case, and every error branch. When fixing a bug, write the failing
test first.

| What             | Where                             | Tool                       |
| ---------------- | --------------------------------- | -------------------------- |
| React components | `Component.test.tsx` alongside    | Vitest + Testing Library   |
| Hooks            | `useThing.test.ts` alongside      | Vitest + `renderHook`      |
| Utils            | `thing.utils.test.ts` alongside   | Vitest                     |
| Nest services    | `thing.service.spec.ts` alongside | Vitest + `@nestjs/testing` |
| Nest controllers | `thing.controller.spec.ts`        | Vitest, service mocked     |

Cover the happy path, the empty/zero case, and each error branch. When fixing a
bug, add the test that would have caught it — in the same commit as the fix.

Tests render with the `en` locale so that `getByText` assertions match English
translation strings. `aria-label` values stay in English and are not translated.

Prisma is mocked in unit tests via `src/test/mocks/prisma.mock.ts` — never
touch a real database there.

**An integration test** is needed wherever a mock proves nothing: real sort
order, pagination boundaries, unique constraints, cascading deletes, Prisma ↔
API enum mapping. A mocked unit test verifies "did I call Prisma correctly";
an integration test verifies "is the answer correct".

**E2E** is needed if any of these hold: the feature round-trips from frontend
to backend; auth, permissions or ownership are involved; the UI is multi-step
or stateful (filters, sorting, wizards, drag-and-drop); URL state is read or
written; a regression would be silent — wrong data shown rather than a crash.

Single-field CRUD, a presentational component and a pure formatting helper do
**not** need e2e.

Before opening a PR:

```sh
pnpm check        # lint + stylelint + typecheck + test + build
pnpm check:full   # the above plus e2e
```

`pnpm pr` runs `check` for you before opening the PR.

## Documentation policy

```text
docs/
  ai/             ORIENTATION, RECIPES, MAP — context for AI
  features/       one file per user-facing feature
  architecture/   data model, API, diagrams (Mermaid)
  adr/            why X over Y (immutable once accepted)
```

| Change                                       | Doc required                      |
| -------------------------------------------- | --------------------------------- |
| New user-facing feature                      | `docs/features/<feature>.md`      |
| New or changed endpoint / query param        | `docs/architecture/api-*.md`      |
| `schema.prisma` change                       | `docs/architecture/data-model.md` |
| Non-trivial decision with a real alternative | new `docs/adr/NNNN-<slug>.md`     |
| Bug fix, refactor, styling tweak             | none                              |

Templates: `docs/features/_template.md`, `docs/adr/_template.md`.

**Walk this table at the end of a task, not the start.** By then you know what
actually changed, including the things that were not in the plan.

Keep docs short and current. A stale doc is worse than no doc — it actively
misleads. If you rename something, grep the docs for the old name.

---

## Internationalization (i18n)

Library: `next-intl`. Routing: URL prefix (`/en`, `/it`, `/uk`) with
browser auto-detect on first visit. Default locale: `en`.

### Translation files

Three namespace files in `apps/web/messages/`:

```text
messages/
  common.json    → navigation, shared buttons (Save, Cancel, Search), general UI
  auth.json      → login, signup, auth errors
  pages.json     → all page-specific content, grouped by feature
```

When a group inside `pages.json` grows past ~200 keys and becomes unwieldy,
extract it into its own namespace file (e.g. `repertoire.json`). Until then,
keep it together.

### Key structure and sorting

Keys use **camelCase** and are sorted **alphabetically at every level**. Within
each namespace, related keys are grouped under a top-level object named after
the feature. Groups themselves are also sorted alphabetically.

```jsonc
// pages.json
{
  "band": {
    "memberCount": "...",
    "name": "...",
  },
  "calendar": {
    "noEvents": "...",
    "title": "...",
  },
  "repertoire": {
    "addTrack": "...",
    "title": "...",
  },
}
```

### Rules

- **Max nesting depth: 2 levels** (`group.key`). If you want
  `repertoire.track.status.archived`, flatten it to
  `repertoire.trackStatusArchived` or promote `repertoire` to its own namespace.
- **English is the source of truth.** `it.json` and `uk.json` must contain an
  identical set of keys. A missing key is a bug, not a fallback.
- **Placeholders** use ICU syntax: `"greeting": "Hello, {userName}"`.
- **`aria-label` stays in English** — not translated, not in message files.
  Screen readers get consistent identifiers regardless of locale.
- Dates, numbers and relative time are formatted via `useFormatter()` from
  next-intl, not hand-rolled.

---

## Conventions quick reference

Full detail is in the `nonsololarco-conventions` skill. The rules most often
missed:

- **One component per file, one file per folder.** Every component — including a
  sub-component used by a single parent — gets its own folder with a matching
  `PascalCase.tsx` and a barrel `index.ts`. Never declare a second component in
  the same file; extract it to its own folder and import it
  (`import PageButton from './PageButton'`).
- **Logical CSS properties only**: `pli-`/`plb-`/`mli-`/`mbs-`/`mbe-`, never
  `pl-`/`pr-`/`pt-`/`pb-`/`px-`/`py-`/`ml-`/`mt-`.
- **`cn()`** for all className merging; the external `className` prop goes last.
- **CVA** for component variants, not ad-hoc conditional strings.
- **Radix primitives** directly — this project does not use shadcn.
- **React Query** for server state, **Zustand** for client UI state.
- Never animate with bare `transition-all` — it animates `cursor` as a discrete
  property and causes flicker. Name the properties:
  `transition-[background-color,border-color]`.
- The band route is `/band/[id]` (singular).

## API conventions

- Global prefix `api`; Swagger UI at `/api/docs`.
- Query params are camelCase and self-describing: `?status=new&onlyMine=true`.
  Prefer the field name being filtered (`status`) over a generic `filter`.
  Booleans are `true`/`false`, not `1`/`0`.
- Validation lives in DTOs with `class-validator`; enums are exported from the
  DTO and reused by the service.
- Filtering and sorting are **server-side** — the frontend passes params
  through and never sorts a fetched list, so pagination can be added without
  reworking the UI.
