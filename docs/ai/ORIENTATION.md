# ORIENTATION — cold start

> You are reading this because the context is empty. This page is a **router**,
> not a reference. Its job: in ~1k tokens, get you to the two or three files
> that actually matter for the task at hand, and load nothing else.

## What this project is

**nonsololarco** ("non solo arco" — not only the bow) is a social platform and
practice tool for musicians. Retro aesthetic: vinyl, postage stamps, dotted
textures, monospace labels.

Turborepo + pnpm. `apps/web` — Next.js 15 App Router, React 19, Tailwind v4.
`apps/api` — NestJS 11. `packages/db` — Prisma 7 + PostgreSQL.
`packages/types` — shared types, the source of truth for both apps.

## Where to go, by task

| Task                                                   | Read this                                           |
| ------------------------------------------------------ | --------------------------------------------------- |
| "Does component / util X already exist?"               | [`MAP.md`](./MAP.md) — full inventory               |
| "Add a component / endpoint / translation / migration" | [`RECIPES.md`](./RECIPES.md) — file lists, in order |
| How code should look (styles, tokens, CVA, naming)     | `nonsololarco-conventions` skill                    |
| Process: DoD, commands, tests, docs                    | `CLAUDE.md`                                         |
| What a feature does for the user                       | `docs/features/<feature>.md`                        |
| API shape, query params                                | `docs/architecture/api-repertoire.md`               |
| DB schema, relations, constraints                      | `docs/architecture/data-model.md`                   |
| Why something was built this way                       | `docs/adr/`                                         |
| Branches, commits, rebase vs merge                     | [`GIT.md`](./GIT.md)                                |
| What is planned to change                              | `docs/REFACTORING-PLAN.md`                          |

**Do not read everything.** `MAP.md` is ~4k tokens, the skill ~8k. Take what
the task calls for.

## Before you build a component: the decision tree

**Never write a new component before checking whether one exists.** This
project has a design system of 14 primitives plus a util layer. Reimplementing
a piece of it is the most expensive mistake here: the duplicate drifts from the
original, loses the accessibility work already done, and doubles maintenance.

Work through this in order:

**1. Search.** Look in [`MAP.md`](./MAP.md), then in these places:

- `src/components/ui/` — the design system: `Avatar`, `AvatarButton`, `Badge`,
  `Button`, `Card`, `Chip`, `Divider`, `Dropdown`, `Logo`, `NavLink`,
  `Pagination`, `Skeleton`, `Spinner`, `Tabs`.
- `src/lib/variants/` — CVA definitions worth reusing even when the component
  itself does not fit.
- `src/utils/`, `src/hooks/`, `src/icons/base/`.
- A sibling feature folder — repertoire or profile often solved it first.

**2. Found something that does the job functionally, but looks different?**
**Extend it.** Add a `variant`, a `size`, or a prop. Visual difference alone is
never a reason for a second component — that is exactly what CVA variants are
for.

```tsx
// ❌ a second dropdown because the design has a different border
function FilterDropdown() {
  /* 150 lines of portalling, outside-click, Escape */
}

// ✅ a new variant on the existing one
const dropdownVariants = cva(base, {
  variants: { tone: { default: '…', filter: 'border-dashed border-edge' } },
});
```

Only fork when the **behaviour** genuinely differs — different interaction
model, different accessibility contract. If you do build something bespoke,
say why in the component's JSDoc, so the next reader knows the DS option was
considered and rejected.

**3. Nothing suitable exists? Decide where it goes.**

| Will more than one feature want it?                        | Where                                 |
| ---------------------------------------------------------- | ------------------------------------- |
| Yes, or it is a generic primitive (button, field, overlay) | `src/components/ui/<Name>/` + a story |
| No, it is specific to this feature                         | `src/components/<feature>/<Name>/`    |

When unsure, start in the feature folder. Promoting to the design system later
is a cheap move; pulling a half-general component back out of it is not.

## Nine rules that are not up for discussion

Breaking any of these is grounds for a rewrite, not an explanation in the PR.

1. **Logical CSS properties.** `pli-` / `plb-` / `mli-` / `mbs-` / `mbe-`.
   Never `pl-` `pr-` `pt-` `pb-` `px-` `py-` `ml-` `mt-`.
2. **One component, one file, one folder** with an `index.ts` barrel. A second
   component in the same file is forbidden, even a three-line one.
3. **Tokens go through `@theme`.** A variable in `tokens.css` without a mapping
   in `@theme` generates no utility. Never reach for the raw variable from a
   component.
4. **No nested ternaries, no nested `if`.** Guard clause, early return, or a
   lookup map.
5. **`const` by default.** `let` only for genuine reassignment.
6. **Interface keys:** required fields first, then optional; alphabetical
   within each group.
7. **Tests and `aria-label` are always English**, whatever locale the UI
   renders. Never assert on CSS classes, `data-testid` or DOM structure.
8. **Sorting and filtering happen on the server.** The frontend passes params
   through and never sorts a fetched list.
9. **Never `transition-all`** — name the properties:
   `transition-[background-color,border-color]`.

## Traps specific to this repo

Not general advice — things that have already gone wrong here.

- **Logical utilities are static; core utilities are dynamic.** `w-59` compiles
  to `calc(var(--spacing) * 59)` and works for any number. `pli-59` compiles to
  **nothing at all**: the class lands in the markup and the padding silently
  vanishes. See [Sizing](#sizing-scale-number-or-arbitrary-value).
- **A semantic token plus a fixed brand colour** can collapse to the same value
  in one theme. `bg-fg-primary` + `text-primary-light` looks fine in light mode
  and renders invisible in dark. For an inverted surface use `bg-contrast` +
  `text-on-contrast`.
- **`next/font` families have obfuscated names.** A literal
  `fontFamily: "'Space Mono', monospace"` silently falls back to the system
  font. Only `font-display` / `font-ui` / `font-label` / `font-prose`.
- **Radix menu items expose `role="menuitem"`**, not `option`. A test querying
  `option` finds nothing.
- **After changing `schema.prisma` you need both commands** — `db:migrate`
  **and** `db:generate`. One without the other gives a missing table or
  `Cannot read properties of undefined`.
- **Animation tied to audio or a clock must not use CSS keyframes or React
  state** — both restart on every tick and drift. Sample the clock in a
  `requestAnimationFrame` loop and write the style to the node via a ref.
- **Stories are centralised** in `apps/web/stories/<category>/`, not next to
  the component. `.storybook/main.ts` only globs that folder.
- **The band route is `/band/[id]`**, singular.

## Sizing: scale number or arbitrary value

**Rule: try a scale number first.** `w-59` beats `w-[14.75rem]` — shorter,
consistent with everything else, and **rem is preserved**:

```css
.w-59 {
  width: calc(var(--spacing) * 59);
} /* --spacing = 0.25rem → 14.75rem */
```

The number is a count of `0.25rem` steps, not pixels, so it scales with the
reader's font-size setting exactly like the arbitrary value would. Conversion:
`rem × 4 = number`. `14.75rem → w-59`, `21.25rem → w-85`.

**But this only holds for Tailwind's core utilities.** Logical properties come
from the `tailwindcss-logical` plugin, which generates a **fixed** set.

| Group            | Examples                                                                            | Accepts                                    |
| ---------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| Tailwind v4 core | `w-` `h-` `size-` `gap-` `min-w-` `inset-`                                          | **any** number: `w-59`, `w-85`, `size-8.5` |
| Logical plugin   | `pli-` `plb-` `pis-` `pie-` `pbs-` `pbe-` `mli-` `mlb-` `mis-` `mie-` `mbs-` `mbe-` | **only the scale** below                   |

```
0  0.5  1  1.5  2  2.5  3  3.5  4  5  6  7  8  9  10  11  12
14  16  20  24  28  32  36  40  44  48  52  56  60  64  72  80  96
```

Not in the scale: `0.25`, `0.75`, `4.5`, `13`, `15`, `17–19`, `21–23`, `25–27`,
and any large number. **`pli-0.25` generates nothing** — class present, padding
absent, no error anywhere.

```tsx
// ❌ silently does nothing
<span className="mis-0.25" />

// ✅ nearest scale step
<span className="mis-0.5" />

// ✅ or an arbitrary rem value when the scale genuinely does not fit
<span className="mis-[0.0625rem]" />
```

**Order of preference:**

1. A scale number — `w-59`, `pli-4`, `gap-2`.
2. An arbitrary value **in rem** — `w-[14.75rem]`, when the scale misses (more
   common for logical utilities).
3. `px` — only for things that must **not** scale: border widths, hairline
   dividers, `box-shadow` offsets, 1px optical nudges.

## Definition of done

Abridged; the full version is in `CLAUDE.md`.

1. Unit tests for every new module, in the same commit.
2. JSDoc on every exported util, hook and service method — explaining what the
   types cannot say (units, edge cases, why it exists).
3. Docs updated per the table in `CLAUDE.md`; a new doc file linked from
   `docs/README.md`.
4. `pnpm typecheck && pnpm lint && pnpm test` green.
5. `pnpm ai:map` if files were added or removed.

If a step does not apply, say so explicitly in the summary rather than skipping
it silently — that shows it was weighed, not forgotten.

## Commands

```sh
pnpm dev            # web :3000, api :3001
pnpm typecheck      # tsc --noEmit across the monorepo
pnpm lint
pnpm stylelint
pnpm test           # unit tests
pnpm check          # lint + stylelint + typecheck + test + build
pnpm ai:map         # regenerate MAP.md

pnpm --filter web test        # web only
pnpm --filter web storybook
pnpm --filter web e2e         # Playwright
pnpm --filter api test        # api only

pnpm db:up          # start Postgres in Docker
pnpm db:migrate     # create + apply a migration
pnpm db:generate    # regenerate the Prisma client
pnpm db:seed
```
