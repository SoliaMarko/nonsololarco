# RECIPES — step-by-step guides for common tasks

> Each recipe is an exact list of files in an exact order. The goal is to avoid
> re-exploring the project on every session.
>
> Code style rules live in the `nonsololarco-conventions` skill. This file
> covers **what** to do, not **how the result should look**.

---

## Contents

0. [Decide: extend or create](#0-decide-extend-or-create)
1. [Design system component](#1-design-system-component)
2. [Feature component](#2-feature-component)
3. [API endpoint](#3-api-endpoint)
4. [Database schema change](#4-database-schema-change)
5. [Translation key](#5-translation-key)
6. [React Query hook](#6-react-query-hook)
7. [Design token](#7-design-token)
8. [Bug fix](#8-bug-fix)
9. [Page](#9-page)

---

## 0. Decide: extend or create

**Run this before every "add a component" task.** Skipping it is how design
systems die.

```
Task: "add a dropdown / chip / filter pill / …"
│
├─ 1. Search MAP.md + src/components/ui/ + src/lib/variants/
│     + the sibling feature folder
│
├─ 2. Found something that does the job functionally?
│     │
│     ├─ Yes, but it looks different
│     │  → EXTEND IT. Add a variant / size / prop to the existing component.
│     │    A visual difference is never a reason for a second component —
│     │    that is what CVA variants exist for.
│     │
│     └─ Yes, and the behaviour differs too (different interaction model,
│        different a11y contract)
│        → build new, and record in the JSDoc why the DS option was rejected.
│
└─ 3. Nothing suitable exists → where does it go?
      │
      ├─ More than one feature will want it, or it is a generic primitive
      │  (button, field, overlay, indicator)
      │  → src/components/ui/<Name>/  + a story        → recipe 1
      │
      └─ Specific to this one feature
         → src/components/<feature>/<Name>/            → recipe 2
```

When unsure, start in the feature folder. Promoting to the design system later
is cheap; extracting a half-general component back out of it is not.

**Extending in practice:**

```tsx
// ❌ a second dropdown because the design has a dashed border
function FilterDropdown() { /* portalling, outside-click, Escape, arrow keys… */ }

// ✅ a variant on the existing Radix-based one
const dropdownVariants = cva(base, {
  variants: {
    tone: { default: 'border-border-primary', filter: 'border-dashed border-edge' },
  },
  defaultVariants: { tone: 'default' },
});
```

The DS `Dropdown` already handles portalling, outside-click, Escape, arrow keys
and typeahead. A hand-rolled one starts at ~150 lines and has none of it.

---

## 1. Design system component

For primitives more than one feature uses. Only after [recipe 0](#0-decide-extend-or-create).

```
apps/web/
  src/lib/variants/<name>.variants.ts      1. CVA variants
  src/lib/types/ui/<name>.types.ts         2. prop types, if non-trivial
  src/components/ui/<Name>/
    <Name>.tsx                             3. component, default export
    index.ts                               4. barrel
    <Name>.test.tsx                        5. test
  stories/ui/<Name>.stories.tsx            6. story — CENTRAL folder
```

**Stories are not co-located.** They live in `apps/web/stories/<category>/`,
which is the only path `.storybook/main.ts` globs. Categories in use: `ui/`,
`form/`, `typography/`, `layout/`, `icons/`, `shared/`, `unique/`.

**The barrel is exactly this shape:**

```ts
export { default } from './Pagination';
export type { PaginationProps } from './Pagination';
```

**Order of work:**

1. CVA variants in their own file, even if there is only one variant — that
   way they are visible up front and reusable.
2. Component: `'use client'` only if it has state, an effect or an event
   handler.
3. Props: required first, then optional, alphabetical within each group.
4. `cn()` for class merging; the external `className` is always the last
   argument.
5. Test: default render, every CVA variant, every boolean prop in both states,
   interaction, `aria` attributes.
6. Story: one per variant axis, so Chromatic catches visual regressions and
   `addon-a11y` checks contrast in both themes.
7. `pnpm ai:map`.

**Docs:** not required (not a user-facing feature) — but say so explicitly in
the summary.

---

## 2. Feature component

For something belonging to a single page: a table row, a filter bar.

```
apps/web/src/components/<feature>/<Name>/
  <Name>.tsx
  index.ts
  <Name>.test.tsx
  <SubName>/            ← every sub-component gets its own folder
    <SubName>.tsx
    index.ts
```

**Key rule:** a sub-component used by exactly one parent **still** lives in its
own folder with its own barrel. The parent imports it as
`import PageButton from './PageButton'`, never as a `function PageButton()`
declared above it in the same file.

Component constants (grid columns, status maps) go in
`<feature>/<feature>.const.ts` — not inside the component, not in a hook file.

**Translations:** any visible text goes through `useTranslations('pages')` —
see [recipe 5](#5-translation-key). `aria-label` stays English and never enters
the message files.

A feature component gets a story only if it has interesting visual states worth
reviewing in isolation. Design system components always get one.

---

## 3. API endpoint

```
apps/api/src/<module>/
  dto/<name>.dto.ts                    1. input/output + validation
  dto/index.ts                         2. re-export
  <module>.service.ts                  3. business logic
  <module>.service.spec.ts             4. unit (Prisma mocked)
  <module>.service.int-spec.ts         5. integration (real database)
  controllers/<scope>.controller.ts    6. HTTP layer
  controllers/<scope>.controller.spec.ts
  <module>.module.ts                   7. registration
packages/types/src/<domain>/           8. response types, if web needs them
docs/architecture/api-<module>.md      9. REQUIRED
```

**Controller template — modelled on `user-repertoire.controller.ts`:**

```ts
@ApiTags('repertoire')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me/repertoire')
export class UserRepertoireController {
  constructor(private readonly repertoireService: RepertoireService) {}

  @Get()
  @ApiOperation({ summary: '…' })
  @ApiOkResponse({ type: PaginatedTracksDto, description: '…' })
  getMyRepertoire(
    @CurrentUser() user: SessionUser,
    @Query() query: RepertoireQueryDto,
  ): Promise<PaginatedResult<Track>> {
    return this.repertoireService.getByUser(user.id, query);
  }
}
```

**Required:**

- Current user via `@CurrentUser()` from
  `auth/decorators/current-user.decorator`, never from `@Req()`.
- Protection via `@UseGuards(JwtAuthGuard)` on the class.
- Validation in the DTO with `class-validator`; enums are exported from the DTO
  and reused by the service, not duplicated there.
- Query params in camelCase, named after the field being filtered
  (`?status=new`, not `?filter=new`). Booleans are `true`/`false`.
- An explicit `Promise<…>` return type.
- Sorting and pagination on the server. Always append `{ id: 'asc' }` as the
  final `orderBy` criterion, or ordering is non-deterministic across pages.

**E2E is needed** if the endpoint touches permissions, ownership or multi-step
state — which is almost always. `apps/api/test/`, supertest: status codes,
response shape, guard behaviour.

---

## 4. Database schema change

```
packages/db/prisma/schema.prisma       1. the model
                                       2. pnpm --filter @nonsololarco/db db:migrate
                                       3. pnpm --filter @nonsololarco/db db:generate
packages/db/prisma/seed.ts             4. seed for the new field
packages/types/src/<domain>/           5. shared type
apps/api/src/<module>/                 6. service + DTO
apps/api/.../int-spec.ts               7. integration test
docs/architecture/data-model.md        8. REQUIRED
docs/adr/NNNN-<slug>.md                9. if there was a real alternative
```

**Steps 2 and 3 are both mandatory.** A migration without `db:generate` gives
`Cannot read properties of undefined` at runtime; `db:generate` without a
migration gives a missing table. This is the single most common source of
"mysterious" errors here.

**Schema conventions:**

- Every multi-word field gets `@map("snake_case")`; every model gets
  `@@map("table_name")`.
- A `///` comment above a model explains **why** it is shaped that way, not
  what it contains.
- An index for every real access pattern. Remember the leftmost-prefix rule:
  `@@unique([bandId, order])` already covers filtering by `bandId` alone.
- **The NULL trap:** unique constraints in Postgres do not apply to rows with
  NULL. `@@unique([bandId, order])` does not stop two solo tracks
  (`bandId = null`) from sharing an `order`. If they need uniqueness too, add a
  partial index in a hand-written migration.

**Data-breaking changes** go in three migrations: add the column → backfill →
make it `NOT NULL` and drop the old one. That way the deploy has no downtime.

---

## 5. Translation key

```
apps/web/messages/en/pages.json        1. English — the source of truth
apps/web/messages/it/pages.json        2. Italian
apps/web/messages/uk/pages.json        3. Ukrainian
```

**All three files together, in one commit.** A missing key is a bug, not a
fallback. `pnpm ai:map` reports key-count mismatches between locales.

- Namespaces: `common.json` (navigation, shared buttons), `auth.json` (login),
  `pages.json` (all page content, grouped by feature).
- Keys are camelCase, **alphabetical at every level**, groups alphabetical too.
- **Maximum nesting depth 2** (`group.key`). Instead of
  `repertoire.track.status.archived`, write `repertoire.trackStatusArchived`.
- Placeholders use ICU: `"greeting": "Hello, {userName}"`.
- Dates, numbers and relative time go through `useFormatter()`, never
  hand-rolled.

**Usage:**

```tsx
// server component
const t = await getTranslations('pages');

// client component
const t = useTranslations('pages');
```

`aria-label` is **not translated** — screen readers get a stable English
identifier regardless of locale.

---

## 6. React Query hook

```
apps/web/src/lib/api/<domain>.api.ts     1. fetch function
apps/web/src/lib/hooks/use<Domain>.ts    2. hook
apps/web/src/lib/hooks/use<Domain>.test.ts
```

- `lib/api/` — plain fetch, no React. Built on `lib/api/client.ts`.
- `lib/hooks/` — the React Query wrapper. Server state lives only here.
- Query keys go from general to specific:
  `['repertoire', bandId, { status, sort, order, page }]`. That way
  invalidating the `['repertoire']` prefix clears the whole tree.
- Domain constants (`SOLO_BAND_ID` and friends) belong in `lib/constants/`,
  **not** in the hook file — otherwise a component that needs one constant
  pulls in the whole React Query module.

Frequently changing client UI state (metronome BPM) is Zustand, not React
Query. URL state (filters, sorting, page) is `useSearchParams`, and the page
must be wrapped in `<Suspense>`.

---

## 7. Design token

Three steps. Skip the second and the token exists with no utility, which is
what drives people to the `text-[var(--…)]` escape hatch.

```
apps/web/src/styles/tokens.css     1. value in BOTH blocks:
                                      :root (dark) and [data-theme='light']
apps/web/app/globals.css           2. mapping in @theme → creates the utility
<component>                        3. use the utility
```

```css
/* 1. tokens.css — both themes */
--banner-label: #6b6055;

/* 2. globals.css @theme */
--color-banner-label: var(--banner-label);
```

```tsx
/* 3. component */
<span className="text-banner-label">…</span>
```

Namespace prefixes: `--color-*`, `--font-*`, `--spacing-*`, `--radius-*`,
`--text-*`.

**A definition missing from one theme** silently falls back and usually shows
up as invisible text in whichever theme was tested less.

---

## 8. Bug fix

1. **Write the failing test first.** It proves the bug is reproduced, and that
   the fix actually fixes it.
2. Fix it.
3. Test green — in the **same commit** as the fix.
4. Docs: per the table in `CLAUDE.md` a bug fix needs none — **unless** the
   documentation described the old, wrong behaviour. Then fix that too.

If the bug slipped past a unit test with a mocked Prisma, that is a signal an
integration test is needed, not another unit test.

---

## 9. Page

```
apps/web/app/[locale]/<route>/page.tsx    the page
apps/web/src/components/<feature>/        its components
apps/web/messages/{en,it,uk}/pages.json   copy
apps/web/e2e/<route>.spec.ts              e2e, if stateful or permissioned
docs/features/<feature>.md                REQUIRED for user-facing work
```

- Every page lives under the `[locale]` segment.
- Reading `useSearchParams()` requires a `<Suspense>` wrapper.
- The band route is `/band/[id]`, singular.
- To remove a param use `params.delete()`, not `params.set('', '')`.

---

## Before saying "done"

```sh
pnpm typecheck && pnpm lint && pnpm test
pnpm ai:map          # if files were added or removed
```

Then walk the documentation table in `CLAUDE.md` against the **real** diff, not
the original plan — by the end you can also see what was not planned. Any new
doc file must be linked from `docs/README.md` or nobody will find it.
