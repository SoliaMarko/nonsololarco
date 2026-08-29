# CLAUDE.md

**nonsololarco** — a shared repertoire and gig-preparation tool for bands, retro
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
| Add a write endpoint, end to end, nine commits                     | [`docs/RECIPE-endpoint.md`](./docs/RECIPE-endpoint.md)                |
| Branches, commit messages, commit size, rebase vs merge            | [`docs/ai/GIT.md`](./docs/ai/GIT.md)                                  |
| Does this component / util / route / type already exist?           | [`docs/ai/MAP.md`](./docs/ai/MAP.md) — generated, `pnpm ai:map`       |
| How code should look: styles, tokens, CVA, naming                  | `nonsololarco-conventions` skill                                      |
| **Why a feature exists, or why it was cut**                        | [`docs/product/PRINCIPLES.md`](./docs/product/PRINCIPLES.md)          |
| What is being built now, and in what order                         | [`docs/ROADMAP.md`](./docs/ROADMAP.md)                                |
| Features, API, DB schema, decisions                                | `docs/features/`, `docs/architecture/`, `docs/adr/`                   |
| What is planned to change and why                                  | [`docs/REFACTORING-PLAN.md`](./docs/REFACTORING-PLAN.md)              |

**Before writing anything, check `MAP.md` for an existing implementation.**
A duplicate drifts from the original and doubles the maintenance.

**Before adding a feature, check `PRINCIPLES.md`.** Several obvious-looking
features were deliberately cut, each with a condition that would bring it back.
Re-adding one by accident wastes a sprint.

## Definition of done

A task is not finished when the code works. It is finished when the next
person can find it, understand it and change it.

1. **Tests written.** Per the [Testing policy](#testing-policy), in the same
   commit. E2E if the feature meets the criteria there.
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

**nonsololarco** ("non solo arco" — not only the bow) is a shared repertoire
and gig-preparation tool for bands, with a retro/vintage aesthetic. Turborepo
monorepo, pnpm workspaces.

```text
apps/
  web/            Next.js 15 App Router, React 19, Tailwind v4
  api/            NestJS 11, Prisma 7, PostgreSQL
packages/
  types/          @nonsololarco/types — shared TS types (source of truth)
  db/             @nonsololarco/db — Prisma schema, migrations, seed
  ui/             @repo/ui — shared React components
docs/             Feature docs, architecture, ADRs, product principles
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
pnpm --filter api test:int        # api integration tests (testcontainers)
pnpm --filter api test:e2e        # api e2e (supertest)
pnpm --filter api start:dev
```

Database — **all from the repo root**, not from `packages/db`:

```sh
pnpm db:up          # start Postgres in Docker, wait for its healthcheck
pnpm db:down        # stop it (-v also drops the volume)
pnpm db:setup       # db:up + db:migrate + db:generate + db:seed
pnpm db:migrate     # create + apply migration
pnpm db:generate    # regenerate Prisma client
pnpm db:seed        # seed dev data
pnpm db:studio      # Prisma Studio
pnpm db:reset       # drop, re-migrate, regenerate
```

`P1001: Can't reach database server` means Postgres is not running — it is not
a code problem. See the table in `README.md` for the other connection errors.

**After any `schema.prisma` change:** `db:migrate` (applies to DB) **and**
`db:generate` (regenerates the TS client). Running only one of them produces
confusing runtime errors — a missing table, or `Cannot read properties of
undefined`.

Seeding preserves your OAuth account when `SEED_USER_EMAIL` is set:

```sh
SEED_USER_EMAIL=you@example.com pnpm db:seed
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

### Discriminated unions for variant shapes

When a type has variants, model them as a union with a literal tag, not one
interface with optional fields. Optional fields make impossible states
representable; the union makes them a compile error.

```ts
// ❌ compiles, and is nonsense
interface SetlistItem {
  kind: 'track' | 'break';
  trackId?: string;
  label?: string;
}
const bad: SetlistItem = { kind: 'track', label: 'Interval' };

// ✅
type SetlistItem =
  | { kind: 'track'; id: string; position: string; trackId: string }
  | { kind: 'break'; id: string; position: string; label: string; durationSeconds: number };
```

Close every `switch` over a union with an exhaustiveness check, so adding a
variant fails the build in every place that needs updating rather than
silently falling through:

```ts
const assertNever = (value: never): never => {
  throw new Error(`Unhandled variant: ${JSON.stringify(value)}`);
};

switch (item.kind) {
  case 'track':
    return renderTrack(item);
  case 'break':
    return renderBreak(item);
  default:
    return assertNever(item);
}
```

Applies to `SetlistItem`, attachment kinds, event types, and any request state
modelled as `loading | error | success`.

### Size and complexity limits

Enforced as **warnings** — they guide, they don't block a commit.

| Scope   | Rule                     | Limit |
| ------- | ------------------------ | ----- |
| `*.ts`  | `max-lines-per-function` | 60    |
| `*.tsx` | `max-lines-per-function` | 150   |
| `*.tsx` | `react/jsx-max-depth`    | 5     |
| any     | `max-lines` (file)       | 250   |
| any     | `complexity`             | 12    |
| any     | `max-depth` (statements) | 3     |

**Why components get a bigger budget.** Line count is a proxy for cognitive
load, and the proxy holds for imperative code. JSX is declarative: a form with
eight fields runs past 120 lines at a cyclomatic complexity of 1 — long, not
complex. Forcing it under 60 means extracting sub-components that exist only to
satisfy a counter, and under our one-component-per-folder convention every
extraction costs a directory, a barrel and new prop threading.

Exempt from these limits: tests, stories, `icons/`, `svg/`, `illustrations/`.
`jsx-max-depth` is also off in `components/ui/` and `components/form/`, where
Radix dictates the tree (`Root > Portal > Content > Viewport > Item` is four
levels before any of our markup) and depth measures the library, not a decision
we made.

**Calibrating a rule.** If a newly added rule flags more than ~10% of files,
the rule is wrong, not the code. Adjust the threshold or scope it, and note the
reason here. A rule that is routinely violated devalues every other rule in
this file.

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
- Sort interface keys with required properties first, then alphabetically within each group (enforced by
  `typescript-sort-keys/interface` with `requiredFirst: true`).
- Prefer named exports; default export only for React components and
  Nest modules.
- Comments explain _why_, not _what_. Delete commented-out code.

---

## Testing policy

Tests are mandatory where behaviour can regress silently, optional where the
only failure mode is a visible layout change. The rule below is narrower than
"test everything" on purpose: a policy that is routinely ignored is worse than
no policy, because it teaches that the rules in this file are decorative.

**Mandatory, in the same commit as the code:**

| What                                                   | Where                             | Tool                       |
| ------------------------------------------------------ | --------------------------------- | -------------------------- |
| Hooks                                                  | `useThing.test.ts` alongside      | Vitest + `renderHook`      |
| Utils                                                  | `thing.utils.test.ts` alongside   | Vitest                     |
| Nest services                                          | `thing.service.spec.ts` alongside | Vitest + `@nestjs/testing` |
| Nest controllers                                       | `thing.controller.spec.ts`        | Vitest, service mocked     |
| Components with behaviour — state, handlers, branching | `Component.test.tsx` alongside    | Vitest + Testing Library   |

**Optional:** purely presentational components — no state, no handlers, props
straight to markup. A Storybook story covers those better than a test that
asserts a `<div>` rendered.

Cover the happy path, the empty/zero case, and each error branch. When fixing a
bug, add the test that would have caught it — in the same commit as the fix.

**Coverage must not go down.** The CI ratchet enforces this; it is the honest
version of a percentage target.

Tests render with the `en` locale so that `getByText` assertions match English
translation strings. `aria-label` values stay in English and are not translated.

Prisma is mocked in unit tests via `src/test/mocks/prisma.mock.ts` — never
touch a real database there.

**An integration test** is needed wherever a mock proves nothing: real sort
order, pagination boundaries, unique constraints, cascading deletes, Prisma ↔
API enum mapping, and **tenant isolation** — that user A cannot read or write
user B's data. A mocked unit test verifies "did I call Prisma correctly"; an
integration test verifies "is the answer correct".

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
  product/        PRINCIPLES — what we decided not to build, and why
```

| Change                                       | Doc required                      |
| -------------------------------------------- | --------------------------------- |
| New user-facing feature                      | `docs/features/<feature>.md`      |
| New or changed endpoint / query param        | `docs/architecture/api-*.md`      |
| `schema.prisma` change                       | `docs/architecture/data-model.md` |
| Non-trivial decision with a real alternative | new `docs/adr/NNNN-<slug>.md`     |
| A feature considered and rejected            | `docs/product/PRINCIPLES.md`      |
| Bug fix, refactor, styling tweak             | none                              |

Templates: `docs/features/_template.md`, `docs/adr/_template.md`.

**Walk this table at the end of a task, not the start.** By then you know what
actually changed, including the things that were not in the plan.

Keep docs short and current. A stale doc is worse than no doc — it actively
misleads. If you rename something, grep the docs for the old name.

**`docs/journal.md`** — three lines at the end of each working session: what
was done, what is next, where you got stuck. Read it at the start of the next
session. Most of the cost of solo work is reloading context, and this removes it.

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

Legal copy — terms, privacy, cookies — does **not** live in message files. It is
too long and versioned separately; keep it as MDX under `apps/web/content/legal/`.

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
- The band route is `/band/[id]` (singular). Event and setlist routes follow the
  same singular form: `/event/[id]`, `/setlist/[id]`.

---

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

### Error contract

Every error response has the same shape, produced by the global exception
filter:

```jsonc
{ "code": "VALIDATION_FAILED", "message": "Track title is required", "details": {} }
```

`code` is machine-readable and is what the client maps to a translated string.
`message` is English, for logs and for the developer. Never render `message`
to the user.

### Method semantics

| Method   | Use for                                                   | Must be idempotent |
| -------- | --------------------------------------------------------- | ------------------ |
| `GET`    | reads                                                     | yes                |
| `POST`   | create, or an action that is not a write of a known state | no                 |
| `PATCH`  | partial update of an entity                               | no                 |
| `PUT`    | set a value to a known state                              | **yes**            |
| `DELETE` | remove                                                    | yes                |

`PUT /tracks/:id/my-status` and `PUT /events/:id/attendance` are `PUT` because
setting the same value twice must not be an error. Repeating
`POST /invites/:token/accept` returns `200`, not `409` — the caller's intent is
already satisfied.

**Where a repeated `POST` would duplicate data, make it idempotent explicitly.**
A practice session is keyed on `(userId, startedAt)`, so a retry after a lost
response cannot create a second thirty-minute session. For anything without a
natural key, accept an `Idempotency-Key` header and store the result against it.

### Resource shape

Collections are nested under their owner, because the owner determines both
access and the list: `POST /bands/:bandId/repertoire`. Individual items are flat,
because the id is globally unique and nesting adds nothing:
`PATCH /tracks/:id`. This hybrid is deliberate — record the reason here rather
than "fixing" it into consistency.

### Ordering

Ordered lists use **fractional positions** (`position String`), never an integer
`order` column. A move is one `UPDATE` and two concurrent moves cannot collide.

The client sends **neighbours**, not a computed key:

```jsonc
PATCH /setlists/:id/items/:itemId/position
{ "afterId": "clx…", "beforeId": "clx…" }
```

The server computes the key between them. Keeping the fractional-index algorithm
out of the client means it lives in one place and can be changed.

### Pagination

Cursor-based wherever the underlying set can change between requests —
repertoire, comments, activity. With `offset`, deleting two rows on page 1
makes `page=2` skip two rows the user never saw.

```
GET /users/me/repertoire?cursor=<position>&limit=20
```

Offset is acceptable only for stable, short lists such as reference data.

### Computation belongs to the server

Setlist duration, readiness counts and practice statistics are computed in the
service and returned as fields. The client formats, it does not calculate.
Otherwise three places in the UI produce three different numbers, and someone
walks on stage with the wrong one.

---

## Mutations and cache

**Optimistic updates are the default** for any user-initiated write whose result
is predictable — status chips, reordering, adding a track. A mutation round trip
is 100–500 ms; waiting for it makes the app feel slow.

```ts
onMutate: async (input) => {
  // Cancel in-flight queries first. A response already on the wire will
  // otherwise land after the optimistic write and overwrite it with stale data.
  await queryClient.cancelQueries({ queryKey: KEY });
  const previous = queryClient.getQueryData(KEY);
  queryClient.setQueryData(KEY, (old) => applyChange(old, input));
  return { previous };
},
onError: (_err, _input, context) => queryClient.setQueryData(KEY, context.previous),
onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
```

Skip the optimism when the server decides the outcome — anything involving
payment, invite acceptance, or a value the client cannot predict.

Query keys are arrays, most general first: `['repertoire', bandId, filters]`.

---

## Working with AI in this repo

`CLAUDE.md`, `docs/ai/*` and `MAP.md` are not documentation about the
toolchain — for this repo they **are** part of the toolchain. An assistant reads
them and generates code from them, so a stale line here produces wrong code
rather than mild confusion. Fix discrepancies in the same PR that creates them.

Two working rules:

- **Do not merge what you cannot explain out loud.** Generated code that is a
  black box is debt with no test coverage and no owner. If verifying it would
  take ten minutes, write it by hand instead; if you can check it in thirty
  seconds, generate it.
- **First instance of a pattern by hand, tenth with AI.** The first endpoint,
  the first mutation, the first migration. Everything that will be repeated
  twenty times is worth owning once.

Reviewing is a good use of assistance — "what did I miss in this service
method?" — and it costs nothing in ownership.
