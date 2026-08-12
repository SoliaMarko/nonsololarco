# CLAUDE.md

**nonsololarco** — a social platform and practice tool for musicians, retro
aesthetic. Turborepo + pnpm: `apps/web` (Next.js 15, React 19, Tailwind v4),
`apps/api` (NestJS 11), `packages/db` (Prisma 7 + PostgreSQL),
`packages/types` (shared types — the source of truth), `packages/ui`.

This file is **process**. It is deliberately short because it loads into every
session. Detail lives elsewhere and is read on demand.

## Where to look

| You need | File |
| --- | --- |
| Cold start: core rules, repo traps, routing | **[`docs/ai/ORIENTATION.md`](./docs/ai/ORIENTATION.md)** ← start here |
| Step by step: add a component / endpoint / migration / translation | [`docs/ai/RECIPES.md`](./docs/ai/RECIPES.md) |
| Branches, commit messages, commit size, rebase vs merge | [`docs/ai/GIT.md`](./docs/ai/GIT.md) |
| Does this component / util / route / type already exist? | [`docs/ai/MAP.md`](./docs/ai/MAP.md) — generated, `pnpm ai:map` |
| How code should look: styles, tokens, CVA, naming | `nonsololarco-conventions` skill |
| Features, API, DB schema, decisions | `docs/features/`, `docs/architecture/`, `docs/adr/` |
| What is planned to change and why | [`docs/REFACTORING-PLAN.md`](./docs/REFACTORING-PLAN.md) |

**Before writing anything, check `MAP.md` for an existing implementation.**
A duplicate drifts from the original and doubles the maintenance.

## Definition of done

A task is not finished when the code works. It is finished when the next
person can find it, understand it and change it.

1. **Tests written** — unit tests for every new module, in the same commit.
   E2E if the feature meets the criteria below. Integration if real database
   behaviour is involved (ordering, constraints, cascades, enum mapping).
2. **JSDoc written** — on every exported util, hook and service method.
   Explain what the types cannot say: units and format (`"m:ss"`, seconds),
   behaviour for `[]`, `null`, an unknown id, why the thing exists, surprising
   coupling. Do not restate the signature — TypeScript already said that.
3. **Docs updated** per the table below, checked against the **real** diff.
4. **Index updated** — a new doc file is linked from `docs/README.md`.
5. **Checks green** — `pnpm typecheck && pnpm lint && pnpm test`.
6. **Map regenerated** — `pnpm ai:map` if files were added or removed.

If a step does not apply (a pure refactor needs no feature doc), say so
explicitly in the summary rather than skipping it silently. That way it is
visible that it was weighed, not forgotten.

Never report completion with a failing typecheck, a skipped test, or a doc
that describes behaviour the code no longer has.

## Testing policy

**Unit tests for everything.** Every new module ships with tests in the same
commit, with no exception for "simple" code. Cover the happy path, the
empty/zero case, and every error branch. When fixing a bug, write the failing
test first.

| What | Where | Tool |
| --- | --- | --- |
| React components | `Component.test.tsx` alongside | Vitest + Testing Library |
| Hooks | `useThing.test.ts` alongside | Vitest + `renderHook` |
| Utils | `thing.utils.test.ts` alongside | Vitest |
| Nest services | `thing.service.spec.ts` alongside | Vitest + `@nestjs/testing` |
| Nest controllers | `thing.controller.spec.ts` | Vitest, service mocked |
| API integration | `thing.service.int-spec.ts` | Vitest + real database |

**Tests and `aria-label` are always English.** Render with the `en` locale so
`getByText` matches English strings. The one exception is a test that checks
locale switching itself; then it is visible from the test name.

**Never assert on** CSS classes (`toHaveClass`), `data-testid` (and never add
one to production code), or DOM structure. Those are implementation details —
they change with every refactor and break tests for no reason. Use
`getByRole`, `getByText`, `getByLabelText`. Prefer native Vitest matchers
(`toBe`, `toBeDefined`) over jest-dom.

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
pnpm lint && pnpm stylelint && pnpm typecheck && pnpm test && pnpm --filter web e2e && pnpm build
```

## Documentation policy

```text
docs/
  ai/             ORIENTATION, RECIPES, MAP — context for AI
  features/       one file per user-facing feature
  architecture/   data model, API, diagrams (Mermaid)
  adr/            why X over Y (immutable once accepted)
```

| Change | Doc required |
| --- | --- |
| New user-facing feature | `docs/features/<feature>.md` |
| New or changed endpoint / query param | `docs/architecture/api-*.md` |
| `schema.prisma` change | `docs/architecture/data-model.md` |
| Non-trivial decision with a real alternative | new `docs/adr/NNNN-<slug>.md` |
| Bug fix, refactor, styling tweak | none |

Templates: `docs/features/_template.md`, `docs/adr/_template.md`.

**Walk this table at the end of a task, not the start.** By then you know what
actually changed, including the things that were not in the plan.

Keep docs short and current. A stale doc is worse than no doc — it actively
misleads. If you rename something, grep the docs for the old name.

ADRs are numbered sequentially and **immutable once accepted**. To reverse a
decision, write a new ADR and add a `Superseded by 00NN` line to the old one.
That history is the whole point.

## Commands

```sh
pnpm dev          # web :3000, api :3001
pnpm build
pnpm typecheck    # tsc --noEmit across the monorepo
pnpm lint
pnpm test         # unit tests, all packages
pnpm format
pnpm ai:map       # regenerate docs/ai/MAP.md

pnpm --filter web test | test:watch | storybook | e2e
pnpm --filter api test | test:e2e | start:dev

pnpm --filter @nonsololarco/db db:migrate    # create + apply a migration
pnpm --filter @nonsololarco/db db:generate   # regenerate the TS client
pnpm --filter @nonsololarco/db db:seed
pnpm --filter @nonsololarco/db db:studio
pnpm --filter @nonsololarco/db db:reset
```

**Any `schema.prisma` change needs both commands** — `db:migrate` **and**
`db:generate`. One without the other gives either a missing table or
`Cannot read properties of undefined`.

Seeding preserves your OAuth account when `SEED_USER_EMAIL` is set:

```sh
SEED_USER_EMAIL=you@example.com pnpm --filter @nonsololarco/db db:seed
```

## Language

Code, comments, test names, `aria-label` and commit messages are **English
only**. These docs are English too: they load on every session, and English
costs roughly half the tokens of Cyrillic for the same content.

Conversation with the user is in Ukrainian.

## Git

Full rules in [`docs/ai/GIT.md`](./docs/ai/GIT.md). The essentials:

- Branch: `<type>/<TICKET>-<slug>` off `develop` —
  `feature/CLEF-177-reusable-tabs-component`.
- Commit: `<type>(<scope>): <what changed>` — lowercase, imperative, no
  trailing period. **The scope is mandatory.**
  `feat(web): add RepertoireFilterBar component`.
- Scopes: `web`, `api`, `packages`, `types`, `db`, `ui`, `config`, `docs`, `ci`.
- **Commit size:** target ≤5 files / ≤150 lines, hard limit **20 files / 500
  lines** (lockfiles, migrations and generated files excluded). Bigger than
  that gets split, or is mechanical-only and says so in the subject.
- One commit, one logical change. A new module and its tests are one change,
  so they go in one commit.
- **Update a branch with `git rebase origin/develop`, never `git merge`.**
  Force-push only with `--force-with-lease`.
- **PRs into `develop` are squash-merged**, with a hand-written message.
  `develop` → `main` uses a merge commit.
- Never rebase `develop` or `main`; never commit to them directly.
