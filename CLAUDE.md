# CLAUDE.md

Guidance for Claude Code when working in this repository.

> Styling, design tokens, component patterns and naming conventions live in the
> **`nonsololarco-conventions` skill**. This file covers repo layout, commands,
> code quality rules, testing policy and documentation policy.

---

## Definition of done

**Run this checklist before reporting any task complete.** A task is not
finished when the code works — it's finished when the next person can find,
trust and change it.

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
const color = isSelected ? 'red' : isArchived ? 'grey' : 'green';

// ✅ lookup map
const STATUS_COLOR = { selected: 'red', archived: 'grey', default: 'green' } as const;
const color = STATUS_COLOR[resolveState(track)];

// ✅ or a small named helper
function borderColor(track: Track, isSelected: boolean): string {
  if (isSelected) return 'red';
  if (track.status === 'archived') return 'grey';
  return 'green';
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

### Prefer `const`

Use `const` by default. Reach for `let` only when the variable truly needs
reassignment — loop counters, accumulators inside `reduce` callbacks, or
values that change across branches where restructuring would hurt readability.
If a `let` can be replaced by destructuring, a ternary, or a helper that
returns the value, prefer that.

### No JSX in variables

Don't store JSX fragments in local variables (`const header = <div>…</div>`).
Extract them into their own component file instead — this keeps render trees
scannable and makes each piece testable and reusable.

**Exception:** a tiny, single-use fragment (2–3 lines) that won't be reused
may stay in the parent file as a plain variable when extracting a full
component folder would be overkill.

```tsx
// ❌ JSX stashed in a variable
const checkmark = item.selected ? (
  <CheckIcon size={16} className="text-emerald-main" />
) : null;
return <MenuItem>{label}{checkmark}</MenuItem>;

// ✅ inline when trivial
return (
  <MenuItem>
    {label}
    {item.selected && <CheckIcon size={16} className="text-emerald-main" />}
  </MenuItem>
);

// ✅ extract when non-trivial
import SelectionMark from './SelectionMark';
return <MenuItem>{label}<SelectionMark selected={item.selected} /></MenuItem>;
```

### Self-descriptive variable names

Use full, meaningful names — not single-letter abbreviations. A callback
parameter should read as what it represents, not as a cryptic shorthand.

```tsx
// ❌
groups.map((g) => <HistoryGroup key={g.songNumber} group={g} />)

// ✅
groups.map((group) => <HistoryGroup key={group.songNumber} group={group} />)
```

Short names are acceptable only for universally understood idioms: `i`/`j` in
numeric loops, `_` for intentionally unused parameters, and `a`/`b` in sort
comparators.

### General

- TypeScript strict mode; no `any`, no non-null `!` unless provably safe.
- Shared types go in `packages/types` and are imported by both apps. Never
  duplicate a shape that already exists there.
- Sort interface keys alphabetically (enforced by
  `eslint-plugin-typescript-sort-keys`).
- Prefer named exports; default export only for React components and
  Nest modules.
- Comments explain *why*, not *what*. Delete commented-out code.

### Localized accessible names

User-facing `aria-label`, `aria-description`, and `aria-placeholder` values
must be **translated** via `useTranslations()`, just like visible UI text.
A hardcoded English aria-label on an Italian or Ukrainian page is announced
using the document's language, which can mispronounce the label or make the
control unclear. Add new keys to all three locale files (`en`, `it`, `uk`).

`role` names (e.g. `"row"`, `"cell"`) are **spec-defined English tokens** —
never translate those.

### English-only in tests

In test files, everything is English: `describe()` and `it()` descriptions,
variable names, comments, and mock data labels. The only place non-English
text may appear is in assertions or queries that match **rendered UI
content** (e.g. `getByText('Без трекінгу')`) — that must match whatever the
component actually renders.

---

## Testing policy

### Unit tests — required for everything

Every new module ships with unit tests in the same commit. No exceptions for
"simple" code.

| What | Where | Tool |
| --- | --- | --- |
| React components | `Component.test.tsx` next to the component | Vitest + Testing Library |
| Hooks | `useThing.test.ts` next to the hook | Vitest + `renderHook` |
| Utils | `thing.utils.test.ts` next to the util | Vitest |
| Nest services | `thing.service.spec.ts` next to the service | Vitest + `@nestjs/testing` |
| Nest controllers | `thing.controller.spec.ts` | Vitest, service mocked |

Cover the happy path, the empty/zero case, and each error branch. When fixing a
bug, add the test that would have caught it — in the same commit as the fix.

Tests render with the `en` locale so that `getByText` assertions match English
translation strings. Since `aria-label` values are now translated via
`useTranslations()`, test assertions use the `en` locale's translated keys.

Prisma is mocked via `src/test/mocks/prisma.mock.ts`; never hit a real database
in a unit test.

### E2E tests — required for complex features

A feature needs e2e coverage when **any** of these is true:

- it spans frontend and backend (a user action that round-trips to the API),
- it involves auth, permissions or ownership,
- it has multi-step or stateful UI (filters, sorting, wizards, drag-and-drop),
- it reads or writes URL state,
- a regression would be silent — wrong data shown rather than a crash.

CRUD on a single field, a presentational component, or a pure formatting helper
do **not** need e2e.

- **Web:** Playwright, in `apps/web/e2e/`. Test user-visible behaviour through
  the UI, not implementation details. See `apps/web/e2e/README.md`.
- **API:** supertest, in `apps/api/test/`. Test the HTTP contract — status
  codes, response shape, query-param handling, auth guards.

Before opening a PR:

```sh
pnpm lint && pnpm stylelint && pnpm typecheck && pnpm test && pnpm --filter web e2e && pnpm build
```

CI runs lint, stylelint, typecheck, unit tests, **e2e** and build; all six gate
the final `ci` check, so none of them can be skipped on the way to merge.

---

## Documentation policy

Docs live in `docs/`. See `docs/README.md` for the index.

```text
docs/
  features/       One file per user-facing feature — what it does, how to use it
  architecture/   Data model, API reference, diagrams (Mermaid)
  adr/            Architecture Decision Records — why we chose X over Y
```

**When to write what:**

| Change | Doc required |
| --- | --- |
| New user-facing feature | `docs/features/<feature>.md` |
| New/changed API endpoint or query param | Update `docs/architecture/api-repertoire.md` (or the relevant file) |
| Prisma schema change | Update `docs/architecture/data-model.md` |
| Non-obvious technical decision with alternatives | New `docs/adr/NNNN-<slug>.md` |
| Bug fix, refactor, styling tweak | None |

Use the templates: `docs/features/_template.md`, `docs/adr/_template.md`.

**Run this check at the end of every task, not the start.** By then you know
what actually changed, including the things that weren't in the original plan.
Walk the table above against the real diff:

- Touched a query param, endpoint or response shape? → `architecture/`
- Changed what a user sees or can do? → `features/`
- Changed `schema.prisma`? → `architecture/data-model.md`
- Picked one approach over a real alternative? → new `adr/`
- Created any doc file? → link it from `docs/README.md`

Keep docs short and current. A stale doc is worse than no doc — it actively
misleads. If you change behaviour, update the doc in the same PR; if you
rename something, grep the docs for the old name.

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
    "name": "..."
  },
  "calendar": {
    "noEvents": "...",
    "title": "..."
  },
  "repertoire": {
    "addTrack": "...",
    "title": "..."
  }
}
```

### Rules

- **Max nesting depth: 2 levels** (`group.key`). If you want
  `repertoire.track.status.archived`, flatten it to
  `repertoire.trackStatusArchived` or promote `repertoire` to its own namespace.
- **English is the source of truth.** `it.json` and `uk.json` must contain an
  identical set of keys. A missing key is a bug, not a fallback.
- **Placeholders** use ICU syntax: `"greeting": "Hello, {userName}"`.
- **`aria-label` values are translated** — add keys to the message files and
  use `useTranslations()`. Screen readers announce them in the document
  language, so a mismatch between the label's language and the page language
  causes mispronunciation.
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
- **No `px` sizing.** Reach for the Tailwind scale first (`p-3`, `gap-2`,
  `size-8`, `text-sm`), then arbitrary `rem` for in-between values
  (`text-[0.6875rem]`). `px` is only for things that must *not* scale with the
  reader's font size: border widths, hairline dividers, `box-shadow` offsets and
  1px optical nudges. Prefer classes over inline `style` — that's where `px`
  creeps back in, and inline styles bypass `tailwind-merge`.
- **Design tokens go through `@theme`.** A new custom property in
  `src/styles/tokens.css` is only half the job: map it in the `@theme` block of
  `app/globals.css` (`--color-banner-label: var(--banner-label)`) and consume the
  generated utility (`text-banner-label`). Never reach into the raw variable from
  a component with `text-(--banner-label)` or `text-[var(--banner-label)]`.
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
