# Bringing nonsololarco to a professional standard

> Written from an audit of the actual code on 2026-08-12.
> Every item states the **fact** (what is true now), the **problem** (why it
> hurts) and the **action** (what to do about it).

---

## Contents

- [Audit summary](#audit-summary)
- [Phase 0 — Stop the bleeding (week 1)](#phase-0--stop-the-bleeding-week-1)
- [Phase 1 — Testing strategy](#phase-1--testing-strategy)
- [Phase 2 — Code quality: frontend](#phase-2--code-quality-frontend)
- [Phase 3 — Code quality: backend](#phase-3--code-quality-backend)
- [Phase 4 — Database](#phase-4--database)
- [Phase 5 — Folder structure](#phase-5--folder-structure)
- [Phase 6 — Documentation and the AI environment](#phase-6--documentation-and-the-ai-environment)
- [Phase 7 — Observability and release notes](#phase-7--observability-and-release-notes)
- [New rule: prop sorting](#new-rule-prop-sorting)
- [Execution order](#execution-order)

---

## Audit summary

| Metric                                   | Now                                 | Target                            |
| ---------------------------------------- | ----------------------------------- | --------------------------------- |
| Web components (excluding tests/stories) | 141                                 | —                                 |
| Web unit test files                      | 19 (~13%)                           | 100% of new code, 70%+ overall    |
| Storybook stories                        | 25 files (24 components)            | Every DS component                |
| API files / `.spec.ts`                   | 35 / 4 (~11%)                       | 100% of services and controllers  |
| Integration tests                        | **0**                               | Every API module                  |
| Web E2E                                  | 2 specs                             | +auth, +i18n, +profile            |
| API E2E                                  | 1 boilerplate                       | Real contract tests               |
| Coverage thresholds                      | **none**                            | 90% diff coverage + ratchet       |
| Pre-commit hooks                         | **none**                            | husky + lint-staged               |
| AI context per session                   | ~12k tokens, drifting from the code | ~2.5k, map generated              |
| API logging                              | **one line** (`console.error`)      | Sentry + structured logs          |
| Error tracking                           | **none**                            | Sentry on web and api             |
| CHANGELOG / tags                         | **none at all**                     | release-please, a tag per release |

**The headline finding.** The project has excellent _documentation of intent_
(CLAUDE.md + the skill) and weak _mechanical enforcement_. The rules are written
in prose rather than config, so they get broken in the project's own code.
Priority one is not writing more rules — it is turning the existing ones into
lint errors and CI gates.

---

## Phase 0 — Stop the bleeding (week 1)

Before cleaning up the old mess, close the door on new mess. This phase touches
no components — only configuration.

### 0.1 Rules that are documented but not enforced ✅ DONE

> **Completed 2026-08-16.** Added `no-nested-ternary`, `no-var` and
> `prefer-const` to the web ESLint config. Fixed the nested ternaries in
> Select.tsx (2) and Button.tsx (1).

The cheapest win in the whole plan. CLAUDE.md forbids nested ternaries, but
ESLint allows them, and there were three real violations:

```
apps/web/src/components/form/Select/Select.tsx:68
  const triggerState = disabled ? 'disabled' : error ? 'error' : 'default';

apps/web/src/components/repertoire/.../TrackColumnHeader.tsx:51
  const ariaSortValue = isActive ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none';

apps/web/src/components/ui/Button/Button.tsx:~52
  size === 'xs' ? (position === 'start' ? 'mie-0.25' : 'mis-0.25') : ...
```

Add to `apps/web/eslint.config.js`:

```js
rules: {
  'no-nested-ternary': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
  'no-restricted-syntax': [
    'error',
    {
      selector: 'IfStatement > BlockStatement > IfStatement',
      message: 'Nested if is forbidden — use a guard clause or an early return.',
    },
  ],
},
```

Forbid physical CSS properties mechanically — today it is prose only:

```js
'no-restricted-syntax': [
  'error',
  {
    selector: "Literal[value=/\\b(p[lrtb]|m[lrtb]|px|py|mx|my)-[0-9]/]",
    message: 'Use logical properties: pli-/plb-/mli-/mbs-/mbe-.',
  },
],
```

> **Note.** That selector produces false positives on strings like `'flex-1'`.
> A custom ESLint rule, or a stylelint check, is more reliable. Start with the
> regex version and add `eslint-disable` where it misfires; if the noise grows,
> move it into a dedicated `packages/eslint-plugin-nonsololarco`.

### 0.1.1 Logical utilities off the scale — silently lost styling ✅ DONE

> **Completed 2026-08-16.** Replaced `mie-0.25`/`mis-0.25` with
> `mie-0.5`/`mis-0.5` in Button.tsx via an `ICON_MARGIN` lookup map.

**A real bug was found.** `apps/web/src/components/ui/Button/Button.tsx:57–58`
used `mie-0.25` and `mis-0.25`. The value `0.25` is not on the scale the
`tailwindcss-logical` plugin generates from, so **no CSS is emitted at all**:
the class lands in the markup, the margin beside the icon disappears, and
nothing errors. Verified by running PostCSS against the project's real config.

It is the same block of code that held the nested ternary from 0.1 — two
defects in six lines.

```tsx
// before — for size="xs" there was no margin whatsoever
const marginClass =
  size === 'xs'
    ? position === 'start'
      ? 'mie-0.25'
      : 'mis-0.25'
    : position === 'start'
      ? 'mie-0.5'
      : 'mis-0.5';

// after — lookup map plus values that exist on the scale
const ICON_MARGIN = {
  'xs:start': 'mie-0.5',
  'xs:end': 'mis-0.5',
  'md:start': 'mie-0.5',
  'md:end': 'mis-0.5',
} as const;
```

**Why this matters systemically.** Nothing diagnoses the mistake: not
typecheck, not lint, not tests (tests do not assert on classes, and rightly
so). The only way to notice is to look at an `xs` button.

**The guard** is a lint rule that checks logical-utility values against the
scale:

```js
// eslint.config.js — the tailwindcss-logical plugin's scale
{
  selector:
    "Literal[value=/\\b(p|m)(li|lb|is|ie|bs|be)-(?!(0|0\\.5|1|1\\.5|2|2\\.5|3|3\\.5|4|5|6|7|8|9|1[0-2]|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96|px|\\[)\\b)/]",
  message:
    'Value is not on the logical-utility scale — no class will be generated. Use the nearest scale step, or an arbitrary rem value: mis-[0.0625rem].',
}
```

The full list of valid values, and the difference between core and plugin
utilities, is in `docs/ai/ORIENTATION.md` under "Sizing".

**One-off sweep of the codebase** (it found exactly those two cases):

```sh
node -e '
const S=new Set("0 0.5 1 1.5 2 2.5 3 3.5 4 5 6 7 8 9 10 11 12 14 16 20 24 28 32 36 40 44 48 52 56 60 64 72 80 96 px".split(" "));
const {execSync}=require("child_process");
execSync("grep -rnoE \"(p|m)(li|lb|is|ie|bs|be)-[0-9.]+\" apps/web/src",{encoding:"utf8"})
  .split("\n").filter(Boolean)
  .filter(l=>!S.has(l.split(":").pop().split("-").pop()))
  .forEach(l=>console.log("OFF SCALE:",l));
'
```

### 0.1.2 File and function size limits ✅ DONE

> **Completed 2026-08-16.** Added `max-lines`, `max-lines-per-function`,
> `complexity`, `max-depth`, `max-nested-callbacks` and `max-params` to ESLint.
> All as `warn` (complexity too — 8 existing violations; raise to error after
> the refactor). Overrides for tests, stories and SVG.

**Is this a good rule? Short answer: yes, but as a `warn`, and not on its
own.** File length is a _proxy metric_. It correlates with "too many
responsibilities" but is not the same thing. A 300-line file of fifteen flat
CVA strings is fine; an 80-line file doing routing, fetching and formatting at
once is not. So the threshold should prompt, not forbid.

**The actual state of the codebase — which is very healthy:**

| Group              | Files | Median | p90 | Max |
| ------------------ | ----- | ------ | --- | --- |
| `components/ui`    | 41    | 22     | 105 | 223 |
| Feature components | 104   | 20     | 91  | 338 |
| Hooks, utils, lib  | 152   | 39     | 66  | 204 |
| API                | 35    | 32     | 92  | 344 |

Over 150 lines: 8 files out of 332. Over 250: **two**.

```
344  apps/api/src/repertoire/repertoire.service.ts
338  apps/web/src/components/repertoire/RepertoireFilterBar/RepertoireFilterBar.tsx
```

**And that is the best argument for the rule.** Both files had already been
flagged as debt independently: the service for its threefold method
duplication (§3.1), the filter bar because 338 lines for a filter panel means
there are unextracted components inside it. The metric found exactly the same
two, knowing nothing about the project.

A 250-line threshold produces **two warnings and zero false positives** — a
rare case where a rule can be switched on immediately, with no cleanup period.

```js
// eslint.config.js
{
  rules: {
    // Proxy metric: prompts, does not forbid.
    'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],

    // These are the real complexity signals, hence error.
    'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
    'complexity': ['error', 12],
    'max-depth': ['error', 3],
    'max-nested-callbacks': ['error', 3],
    'max-params': ['warn', 4],
  },
},
{
  // Tests and stories are long by nature, and that is fine.
  files: ['**/*.{test,spec}.{ts,tsx}', 'stories/**', '**/*.stories.tsx'],
  rules: {
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'max-nested-callbacks': 'off',
  },
},
```

**Why this particular set.** `max-lines` catches "this file grew" but cannot
say why. `complexity` and `max-depth` catch the tangling itself — a function
with twelve branches is hard to hold in your head whether it is 30 lines or 300. Together they work; alone, `max-lines` is trivially defeated by cutting a
file in half with no improvement.

`max-params: 4` deserves a mention: it naturally pushes toward an options
object, which in this project then falls under the required-before-optional key
sorting rule.

**Deliberately not added.** `max-statements` and `max-classes-per-file` are
noise: the first punishes linear, perfectly readable code, the second is
irrelevant to a project with no classes outside NestJS. `max-len` is unneeded
too — Prettier already controls width.

### 0.2 Bring API lint strictness in line with web ✅ DONE

> **Completed 2026-08-16.** Created `packages/eslint-config/nest.js`, a shared
> ESLint config for NestJS. Enabled `no-explicit-any: error`,
> `no-floating-promises: error`, `no-console` and the complexity limits.
> Removed `sourceType: 'commonjs'`. The API's eslint.config.mjs now imports the
> shared config.

The configs had drifted badly apart:

| Rule                   | web                  | api        |
| ---------------------- | -------------------- | ---------- |
| `no-explicit-any`      | error (via tseslint) | **off**    |
| `no-floating-promises` | —                    | **warn**   |
| `typescript-sort-keys` | error                | **absent** |
| `no-console`           | error                | **absent** |
| `import/*`             | error                | **absent** |

CLAUDE.md says "no `any`" — but the API disabled it explicitly. Actions:

1. Create `packages/eslint-config/nest.js` modelled on `next.js`.
2. Enable there: `no-explicit-any: error`, `no-floating-promises: error`,
   `typescript-sort-keys`, `no-console` (allowing `warn`/`error`), `import/*`.
3. Drop `sourceType: 'commonjs'` — NestJS 11 on Node 22 works with ESM;
   `commonjs` is simply inherited from the template.
4. Fix the violations that surface module by module, not in one PR.

### 0.3 Pre-commit hooks (husky) ✅ DONE

> **Completed 2026-08-16.** Added `husky` and `lint-staged` to the root
> `devDependencies`. Pre-commit: lint-staged (`eslint --fix` + `prettier
--write` on staged files) plus MAP.md regeneration. Pre-push: typecheck.

**What husky specifically buys here.** It is not "one more tool" — it closes
three real gaps:

1. **Feedback in 3 seconds instead of 4 minutes.** Today the only place a lint
   violation is caught is CI. The cycle "push → wait for the build → red → fix
   → push" costs minutes for every triviality `eslint --fix` would have fixed
   instantly.
2. **Auto-fix instead of a review comment.** `lint-staged` runs `eslint --fix`
   and `prettier --write` on staged files. Import order, interface key sorting,
   quotes, semicolons — all corrected silently, without a line of review.
   Review is freed for logic.
3. **History without "fix lint" commits.** A branch with five cosmetic commits
   is unreadable a year later. The hook removes them at the source.

Specific to this project: once `requiredFirst` is enabled (see below), the hook
is what will reorder keys automatically, so the rule does not turn into a
permanent source of review comments.

```sh
pnpm add -Dw husky lint-staged
pnpm exec husky init
```

`.husky/pre-commit`:

```sh
pnpm exec lint-staged
```

`package.json` (root):

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.css": ["stylelint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
  "apps/**/src/**": "node scripts/generate-ai-map.mjs && git add docs/ai/MAP.md"
}
```

That last line keeps `docs/ai/MAP.md` in sync automatically — the map cannot go
stale, because it is updated by the same commit that changes the structure.

`.husky/pre-push`:

```sh
pnpm typecheck
```

**What not to put in hooks.** A full `pnpm test` on pre-commit is the most
common mistake: the hook starts taking a minute, the developer gets used to
`--no-verify`, and there is no protection at all. Keep pre-commit under 5
seconds. Tests are CI's job.

### 0.3.1 `--no-verify` discipline

Hooks are bypassed with a single flag, so they are an accelerator, not a
replacement for CI. The rule: CI checks everything the hooks check, plus tests.
Then bypassing a hook skips nothing — it only postpones the pain.

### 0.3.2 Git: commitlint and repository settings ✅ DONE (partially)

> **Completed 2026-08-16.** Added `@commitlint/cli` and
> `@commitlint/config-conventional`, created `commitlint.config.js`
> (`scope-empty: never`, `subject-min-length: 15`). Created `.gitattributes`
> (`-diff` on the lockfile, generated Prisma output and MAP.md). The
> `commit-msg` hook still needs creating locally (see below). Branch protection
> and squash-merge settings are manual work on GitHub.

The full conventions live in [`docs/ai/GIT.md`](./ai/GIT.md). Here is what to
switch on, and why it is not cosmetic.

**What the audit of the last 120 commits showed:**

| Metric                                                       | Value                  |
| ------------------------------------------------------------ | ---------------------- |
| With a scope                                                 | 78                     |
| Without a scope                                              | 29                     |
| Not Conventional Commits at all                              | 13                     |
| Empty of meaning (`fix: test`, `fix: according to comments`) | 14                     |
| Size: median                                                 | 3 files / 57 lines ✅  |
| Size: p90                                                    | 15 files / 671 lines   |
| Commits over 20 files                                        | 9 (largest: 119 files) |

The median is healthy. The problem is the tail and the messages.

**Merge commits from `git pull`.** The history contains entries like
`Merge branch 'feature/CLEF-168-…' of github.com:… into feature/CLEF-168-…` —
that is `git pull` without rebase merging a branch with itself. And
`Merge branch 'develop' into feature/…` — merging instead of rebasing. Both
describe the mechanics of syncing rather than any change.

**Actions:**

1. **commitlint on the `commit-msg` hook** — `subject-min-length: 15` alone
   would reject `fix: test`, `fix: ci issues` and `fix: broken path`;
   `scope-empty: never` closes the 42 commits with no scope.
2. **Squash merge for PRs into `develop`.** A branch here carries 5–15 commits,
   several of them `fix: according to comments`. Squashing turns that into one
   meaningful commit; the drafts stay in the PR. Side effect: `git bisect`
   starts working — one commit per feature, each of which builds.
3. **`git config --global pull.rebase true`** — merge commits from pull
   disappear permanently, in one line of config.
4. **Branch protection** in the GitHub settings: `main` and `develop` via PR
   only, with `ci` required; allow squash merge only.
5. **Auto-delete branches after merge** — there are currently 40 `feature/`
   branches, most of them merged.
6. **Add `.gitattributes`** — there is none. `-diff` on `pnpm-lock.yaml`,
   `packages/db/generated/**` and `docs/ai/MAP.md` removes them from the PR
   diff, so generated output stops hiding the five lines that actually need
   reading.

**The commit size limit** is a warning, not a block, because legitimate
exceptions exist (generated output, bulk renames). Threshold: 20 files after
excluding the lockfile, migrations and generated files.

### 0.4 Fix CI ✅ DONE

> **Completed 2026-08-16.** Deleted the duplicate `api.yml` (Node 20, pnpm v2,
> no tests). `ci.yml` already covers the API fully: `pnpm test` through turbo
> runs tests across every package, `pnpm lint` lints everything, and the e2e job
> brings up Postgres and the API.

`.github/workflows/api.yml` ran only `build` and `lint` for the API — **no
tests at all**. CLAUDE.md claimed "CI runs lint, stylelint, typecheck, unit
tests, e2e and build; all six gate the final `ci` check". For the API that was
false.

Actions:

1. Add `pnpm --filter api test` and `pnpm --filter api test:e2e` to `api.yml`.
2. Bring up `services: postgres` in the job for API e2e tests.
3. Add a `coverage` job with thresholds (see 1.4).
4. Or — better — remove `api.yml` entirely and add the API steps to `ci.yml`,
   so there is a single gate that cannot be bypassed by pushing to `main`.

### 0.5 Prettier config ✅ DONE

> **Completed 2026-08-16.** Created `.prettierrc.json` at the root. The
> `@trivago/prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`
> plugins were hoisted to the root `devDependencies`. Removed the duplicate
> `prettier` from the API, and dropped `eslint-plugin-prettier` there (running
> Prettier through ESLint is the outdated approach) in favour of importing
> `eslint-config-prettier` directly.

`@trivago/prettier-plugin-sort-imports` was installed in `apps/web`, but there
was no prettier config file at the root — so import order depended on whether
someone happened to run prettier from the right directory.

Create `.prettierrc.json` at the root with an explicit `importOrder` matching
the "Import Order" section of the skill:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": [
    "^(react|next)(/.*)?$",
    "<THIRD_PARTY_MODULES>",
    "^@nonsololarco/(.*)$",
    "^@repo/(.*)$",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

Move the plugin from `apps/web` into the root `devDependencies` so it applies
to the API too.

---

## Phase 1 — Testing strategy

You asked whether integration tests are worth it. **Yes, and they are the
biggest hole in the current pyramid.**

### 1.1 Why integration specifically

There are two levels today: unit tests with mocked Prisma, and e2e through the
browser. Between them is nothing, and that is exactly where this project's most
expensive bugs live:

- The SQL compiles, but `orderBy: [{ bandId: 'asc' }, { order: 'asc' }]` returns
  the wrong order → a mocked unit test cannot see it (the mock returns whatever
  it was told), and e2e sees it but only says "something is wrong on the page".
- `@@unique([bandId, order])` with `bandId = null` — Postgres treats NULL as
  distinct, so the constraint **does not apply** to solo tracks. A mocked unit
  test will miss this forever.
- The `MusicalKey` enum with `@map("C#")` — round-trip mapping between the
  Prisma enum and the API notation. A mock maps nothing.
- Cascading deletes (`onDelete: Cascade` in four places).

This is the classic case where a mock tests "did I call Prisma correctly"
rather than "is the answer correct". An integration test against a real
database answers the second.

### 1.2 How to set up API integration tests ✅ DONE (infrastructure + proof of concept)

> **Completed 2026-08-16.** Created `vitest.int.config.ts`, the
> `setup-integration.ts` test helper (testcontainers + PrismaPg adapter +
> Prisma migrate), deterministic fixtures in `seed-fixtures.ts` (2 users,
> 2 bands, 6 tracks), and 15 integration tests for RepertoireService (sorting,
> pagination boundaries, the `active` filter, solo vs band, MusicalKey
> round-trip). Requires `pnpm install` for @testcontainers/postgresql, and
> Docker to run.

**Tooling:** Vitest + `@testcontainers/postgresql` (or a `docker-compose`
service in CI and locally). Testcontainers costs more at startup but requires
the developer to configure nothing.

**Location and naming** — a new, third kind alongside the existing ones:

```
apps/api/src/repertoire/
  repertoire.service.ts
  repertoire.service.spec.ts        ← unit, Prisma mocked
  repertoire.service.int-spec.ts    ← NEW: real database in a container
```

**Scripts:**

```json
"test": "vitest run --exclude '**/*.int-spec.ts'",
"test:int": "vitest run --config vitest.int.config.ts",
"test:e2e": "vitest run --config vitest.e2e.config.ts"
```

**What an integration test covers that a unit test cannot:**

1. The real sort order for every `sort`/`order` combination.
2. Pagination boundaries: page 1, the last page, out of range, `pageSize=0`.
3. The `active` filter = `ready|learning|new` — exactly three statuses, not four.
4. `onlyMine` for a track where the user is a performer but not the lead, and
   the reverse.
5. `getSoloByUser` returning no band tracks, and vice versa.
6. Cascades: deleting a band removes its tracks; deleting a user removes the
   performer rows, but for tracks where they are lead there is no `onDelete`,
   so it **fails with a foreign key error**. That needs a test and a deliberate
   decision.
7. `MusicalKey` mapping in both directions for all 24 values.

**Fixtures.** A single `seedFixtures()` helper in `apps/api/src/test/fixtures/`
building a deterministic set: 2 users, 2 bands, 10 tracks with predictable
statuses and durations. Each test in a transaction with rollback — faster than
truncating.

### 1.3 Tighten the unit test rules

CLAUDE.md currently says "cover the happy path, the empty/zero case, and each
error branch" — good, but unverified. Make it concrete and mechanical:

**Add a checklist of mandatory cases for a component to CLAUDE.md:**

| Case                                     | Required when                    |
| ---------------------------------------- | -------------------------------- |
| Render with default props                | always                           |
| Every CVA variant (`variant`, `size`)    | the component has variants       |
| Every boolean prop in `true` and `false` | there are boolean props          |
| Empty array / `undefined` data           | the component takes a collection |
| Click / value change                     | there is an `onClick`/`onChange` |
| `aria-*` attributes and `role`           | always                           |
| Loading and error states                 | the component fetches data       |

**Forbid `it.skip` and `describe.skip` in CI:**

```js
// eslint.config.js
'no-restricted-properties': [
  'error',
  { object: 'it', property: 'skip', message: 'Skipped test = broken test. Fix or remove.' },
  { object: 'describe', property: 'skip', message: 'Skipped suite = broken test.' },
  { object: 'it', property: 'only', message: '.only must not reach a commit.' },
],
```

### 1.4 Coverage: 90% on new code + a ratchet on the old ✅ DONE

> **Completed 2026-08-16.** Added a coverage config with a ratchet
> (`autoUpdate`) to both the web and api vitest configs. The CI test job now
> runs coverage plus diff coverage through barecheck (90% threshold on new
> lines). Added `no-restricted-properties` to keep `it.skip`/`it.only` out of
> commits.

**The chosen strategy.** A hard global 90% threshold on a codebase at ~10%
(135 components, 13 with tests) means a red CI for two or three months. In
practice nobody fights that CI — they learn to ignore it, and to ignore the
real failures alongside it. So the threshold splits into two independent
mechanisms.

**Mechanism 1 — diff coverage at 90%, blocking the PR.** Every line you added
or changed must be 90% covered. Old code does not count. This gives exactly
what you want ("nothing should break"), with pain proportional to the size of
the change rather than the size of the debt.

```yaml
# .github/workflows/ci.yml
- run: pnpm test:coverage
- uses: barecheck/code-coverage-action@v1
  with:
    lcov-file: ./apps/web/coverage/lcov.info
    minimum-ratio: 90 # ← threshold for changed lines
    send-summary-comment: true
    show-annotations: warning # uncovered lines highlighted in the diff
```

**Mechanism 2 — a global ratchet that never goes down.** The threshold starts
at the current fact and rises automatically whenever real coverage exceeds it
with margin. The debt closes without a dedicated "testing sprint".

```ts
// apps/web/vitest.config.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json-summary', 'lcov'],
  exclude: [
    '**/*.stories.tsx', '**/index.ts', '**/*.d.ts',
    'src/data/**',          // mocks
    'src/icons/**',         // generated SVG wrappers
    'src/illustrations/**', // decorative, covered visually in Storybook
  ],
  thresholds: {
    autoUpdate: true,   // ← vitest raises the numbers below after a green run
    lines: 10, branches: 10, functions: 10, statements: 10,

    // Pure logic — 90% straight away; the debt is small and the pain one-off
    'src/utils/**':      { lines: 90, branches: 90, functions: 90 },
    'src/lib/hooks/**':  { lines: 90, branches: 85, functions: 90 },
    'src/lib/variants/**': { lines: 90, branches: 85, functions: 90 },
    // Components — lower, raised by the ratchet
    'src/components/ui/**': { lines: 70, branches: 60 },
  },
},
```

`autoUpdate: true` is the key option: Vitest rewrites the numbers in the config
after a successful run. The ratchet runs itself, with no scripts.

For the API the threshold is higher immediately — the business logic is small
and critical:

```ts
// apps/api/vitest.config.ts
thresholds: {
  '**/*.service.ts': { lines: 90, branches: 85, functions: 90 },
  '**/*.controller.ts': { lines: 80, branches: 70 },
}
```

**What coverage does not catch.** 90% of lines is a measure of execution, not
correctness. A test that renders a component and asserts nothing produces the
same 90%. So the threshold only works paired with the rules in 1.3 (mandatory
cases) and 1.2 (integration tests). Coverage answers "did this code ever run";
integration tests answer "is it right".

**Mutation testing — later, if needed.** Once coverage passes 70% and the
question "do our tests actually check anything" comes up, Stryker answers it:
it breaks the code deliberately and sees whether any test fails. Too expensive
per PR — run it weekly on a schedule.

### 1.5 Storybook — fill in the coverage

**A correction to the earlier version of this plan.** I first wrote that there
were zero stories. That was a search error: stories do not sit next to
components, they are collected centrally in `apps/web/stories/<category>/`,
exactly where `.storybook/main.ts` looks. There are in fact **25 files covering
24 components**. The map generator has been fixed to look in the right place.

The real picture: 24 of 135 components (18%) have a story. All 14 DS
primitives are covered, plus `form/`, `typography/` and the illustrations. Not
covered: feature components (`repertoire/`, `profile/`, `metronome/`).

That is a reasonable distribution — stories are most valuable for the DS. What
is worth doing:

1. **Add stories for `Tabs`, `Pagination` and `LocaleSwitcher`** — they are
   missing on some branches; verify after merging.
2. **A DoD rule:** a component in `components/ui/` is not done without a story.
   For feature components it stays optional, warranted when there are visual
   states worth reviewing in isolation.
3. **`Icons.stories.tsx` has no matching component** — it is a catalogue of
   every icon in one story. That is fine, but the map generator lists it under
   "Stories without a matching component" so it does not look like a mismatch.
4. **Enable `addon-a11y` in CI.** It is already installed; a contrast check in
   both themes would catch precisely the class of bug the skill describes
   ("invisible text in whichever theme was tested less").

Chromatic is configured — worth wiring it to PRs so visual regressions are
caught automatically.

### 1.6 Extend E2E

There are two specs today: `repertoire-filtering` and `repertoire-pagination`.
By CLAUDE.md's own criteria ("involves auth, permissions or ownership") these
are missing:

- `auth.spec.ts` — OAuth login, redirect, logout, reaching a protected page
  without a session.
- `i18n.spec.ts` — switching locale preserves page state and URL params.
- `profile.spec.ts` — the profile renders, tabs switch.
- `theme.spec.ts` — switching theme breaks no token (the "invisible text" check
  from the skill).

`apps/api/test/` contains only `app.e2e-spec.ts` (Nest boilerplate) and
`jest-e2e.json` — **a Jest config in a project that tests with Vitest**. That
is template residue: delete `jest-e2e.json`, rewrite e2e on supertest + Vitest,
and cover each endpoint's contract (status codes, response shape, guards).

---

## Phase 2 — Code quality: frontend

### 2.1 Duplicated types

```
apps/web/src/lib/types/profile.types.ts        ← 312 B
apps/web/src/lib/types/profile/profile.types.ts ← 1552 B
```

Two files with the same name at different levels. Some code imports one, some
the other. Action: merge into `lib/types/profile/profile.types.ts`, delete the
flat one, update the imports.

The same pattern should be checked across the rest of `lib/types/`, which mixes
flat files (`common.types.ts`, `profile.types.ts`) with grouped folders (`ui/`,
`illustrations/`, `typography/`, `profile/`). Pick one: **everything grouped by
domain**.

### 2.2 Constants living in hook files

```ts
// TrackListRow.tsx
import { SOLO_BAND_ID } from '@/src/lib/hooks/useRepertoire';
```

`SOLO_BAND_ID` is a domain constant, not part of the hook. A component that
needs one constant currently pulls in the entire hook module along with React
Query.

Action: move it to `lib/constants/repertoire.const.ts` (the file already
exists). Grep the project for other cases:

```sh
grep -rn "^export const [A-Z_]* =" apps/web/src/lib/hooks apps/web/src/hooks
```

### 2.3 Mock data sitting next to a real API

`src/data/` holds 6 mock files (`auth.mock.ts`, `profile.mock.ts`,
`sidebar.mock.tsx`, `wishlist.mock.ts`, `bands.mock.ts`, `tracks.mock.ts`)
while `lib/api/` holds real calls. The risk: a component accidentally renders a
mock in production and nobody notices, because the data looks plausible.

Actions:

1. Grep for mocks still imported from `src/components/**`.
2. For each, either replace it with a real call or move it to
   `src/test/fixtures/` (where it will not reach the bundle).
3. `sidebar.mock.tsx` — a `.tsx` mock means JSX inside data. That almost
   certainly means UI configuration is mixed into the data; separate them.
4. An ESLint rule forbidding imports of `src/data/**` from `src/components/**`:

```js
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['**/data/**/*.mock*'],
    message: 'Mocks are not imported into components. Use lib/api or test/fixtures.',
  }],
}],
```

### 2.4 Move the design system into `packages/ui` ⭐

The current situation is contradictory: `packages/ui/src/` holds `button.tsx`,
`card.tsx` and `code.tsx` — Turborepo template boilerplate — while the real
design system lives in `apps/web/src/components/ui/`. Two `Button`s in one
repository guarantees that sooner or later someone imports the wrong one.

**Goal:** `packages/ui` becomes the single home of the design system, reusable
by future applications (an admin panel, a landing page, a standalone practice
tool).

**What moves:**

```
packages/ui/
  package.json          → name: "@nonsololarco/ui", subpath exports
  src/
    components/         ← from apps/web/src/components/ui/ (14 primitives)
      Avatar/ Badge/ Button/ Card/ Chip/ Divider/ Dropdown/
      Logo/ NavLink/ Pagination/ Skeleton/ Spinner/ Tabs/ AvatarButton/
    variants/           ← from apps/web/src/lib/variants/ (DS variants only)
    types/              ← from apps/web/src/lib/types/ui/
    utils/cn.ts         ← from apps/web/src/utils/cn.ts
    styles/tokens.css   ← from apps/web/src/styles/tokens.css
  stories/              ← from apps/web/stories/{ui,typography,form}/
```

**What stays in `apps/web`:** everything domain-specific — `repertoire/`,
`profile/`, `metronome/`, `layout/`, `shared/` — plus `app/globals.css` with
its `@theme` block (mapping tokens into utilities is the application's job).

**Migration order** (each step its own commit, so the diff reads):

1. **Delete the boilerplate.** `packages/ui/src/{button,card,code}.tsx` are used
   nowhere except the template example. Grep for `@repo/ui`.
2. **Rename the package** `@repo/ui` → `@nonsololarco/ui`, consistent with
   `@nonsololarco/types` and `@nonsololarco/db`.
3. **Move `cn.ts` and `tokens.css`** — the foundation everything else depends
   on. The package must be self-sufficient with respect to styling.
4. **Move the primitives in batches of 3–4** — Divider, Skeleton, Spinner (no
   dependencies), then Badge, Chip, Card, then Button, Avatar, Logo, then the
   composed ones: Dropdown, Tabs, Pagination, NavLink, AvatarButton.
5. **Move the stories** with their components; extend `.storybook/main.ts` in
   web with a glob for `../../packages/ui/stories/**`.
6. **Tests travel with their components** — `packages/ui` gets its own
   `vitest.config.ts` with jsdom.

**Technical decisions to make (each worth a line in an ADR):**

| Question                      | Recommendation                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build step or raw TS sources? | **Raw sources** plus `exports` on `./src/*`. Next.js transpiles via `transpilePackages`. No build step means no dist/src drift.                  |
| One barrel or subpaths?       | **Subpaths**: `@nonsololarco/ui/Button`. A single barrel breaks tree-shaking and drags Radix into every chunk.                                   |
| Where does `@theme` live?     | **In the application.** The package declares tokens in `tokens.css`; the app maps them to utilities. That lets another app supply its own theme. |
| Peer dependencies             | `react` and `react-dom` go in `peerDependencies`, not `dependencies`. Otherwise you get two copies of React.                                     |
| `next/link` in `NavLink`      | Extract into an `as` / `linkComponent` prop, or the package is tied to Next.js and survives no other host.                                       |

**Risks.** This is the largest mechanical change in the plan after the
`features/` restructure. Do it **after** PR #7 (coverage thresholds) — then
moving a component without a test is visible immediately. `NavLink` and `Logo`
almost certainly carry Next-specific imports; move them last, once the pattern
is proven on the simple ones.

**What it buys immediately**, before any second application exists: a physical
boundary between the design system and the domain. Today nothing stops `Button`
importing `useActiveBand`; after the move it becomes impossible — which is
exactly why the DS stays reusable.

### 2.5 Dead rules about Zustand

The skill describes `stores/metronome.store.ts` and says "Zustand for client UI
state". There is no `src/stores/` folder, despite 11 metronome components. So
metronome state is currently held somewhere in `useState`/context.

Action: look at how the metronome is actually built; then either create the
store and bring the code to the documented pattern, or remove Zustand from the
documentation and the dependencies. Do not leave a rule describing code that
does not exist.

### 2.6 Explicit return types

The skill requires "Explicit return types on exported functions and hooks", but
it is not enforced. Add:

```js
'@typescript-eslint/explicit-module-boundary-types': ['error', {
  allowArgumentsExplicitlyTypedAsAny: false,
  allowHigherOrderFunctions: true,
}],
```

For React components this is noisy — exclude `**/*.tsx` components or use
`allowedNames`.

---

## Phase 3 — Code quality: backend

### 3.1 Duplication in `RepertoireService` (the largest API debt) ✅ DONE

> **Completed 2026-08-16.** Extracted `findTracks` as the single
> implementation; each public method is now 5–8 lines describing only its own
> `where`. The three `let` declarations disappeared with it.

Three methods — `getByUser`, `getSoloByUser`, `getByBand` — had identical
bodies of ~25 lines each, differing only in `where`, `include` and the default
`orderBy`:

```ts
// repeated three times, word for word:
const total = await this.prisma.track.count({ where });
const needsPostSort = isPostQuerySortField(sort);
const tracks = await this.prisma.track.findMany({ where, include, orderBy: ..., ...(pa.isPaginated && !needsPostSort ? { skip, take } : {}) });
let mapped = tracks.map(...);
mapped = postQuerySort(mapped, sort, order);
if (needsPostSort) mapped = applyPageSlice(mapped, pa);
return { data: mapped, ...buildMeta(total, pa) };
```

Plus three `let` declarations where `const` would do — directly against the
"Prefer `const` (CRITICAL)" rule in the project's own skill.

The refactor:

```ts
interface FindTracksArgs {
  defaultOrderBy: TrackOrderBy[];
  include: typeof TRACK_INCLUDE_ALL | typeof TRACK_INCLUDE_MEMBERS;
  includeBand: boolean;
  options: RepertoireQueryOptions;
  where: Prisma.TrackWhereInput;
}

/**
 * Runs the track query with sorting, filtering and pagination.
 *
 * The `status` field cannot be sorted at the database level, so for it the
 * whole set is loaded and sorted in memory — see `isPostQuerySortField`.
 */
private async findTracks(args: FindTracksArgs): Promise<PaginatedResult<Track>> {
  // the single implementation
}
```

### 3.2 Post-query sorting is a real scaling problem ✅ PARTIALLY DONE

> **Completed 2026-08-16.** `time` now sorts in the database — see §4.1 and
> [ADR 0005](./adr/0005-duration-as-seconds.md). `status` remains the last
> in-memory sort; §4.2 covers it.

There was an honest TODO in the code, and it was right: sorting by `status` and
`time` loaded **the entire tracks table** on every page request. The causes:

- `duration` was stored as the string `"m:ss"` — Postgres cannot sort it;
- `TrackStatus` is an enum whose database sort order is alphabetical
  (`archived, learning, new, ready`) where the meaningful order is
  `new, learning, ready, archived`.

This is not cosmetic: with 500 tracks in a band, every click on a column header
pulled 500 rows across three joins. The fix is in the schema — see
[Phase 4](#phase-4--database).

### 3.3 Error contract

The only explicit exception today is `NotFoundException` in `getByBand`. There
is no:

- global exception filter producing a single error body shape;
- permission check: `getByBand` lets any authenticated user into any band's
  repertoire, with membership never verified.

Actions:

1. `AllExceptionsFilter` → `{ code, message, details }`, matching the contract
   documented in CLAUDE.md.
2. `BandMembershipGuard` — checks `BandMember` before granting access to
   `/bands/:id/repertoire`. This is precisely the case CLAUDE.md requires e2e
   coverage for ("involves auth, permissions or ownership").
3. Document both in `docs/architecture/`.

### 3.4 Config validation and typing

`apps/api/src/config/` exists; verify that env variables are validated at
startup. The right Nest pattern is `ConfigModule.forRoot({ validationSchema })`
with zod or joi, so the app fails immediately on a missing `DATABASE_URL`
rather than twenty minutes later on the first request.

### 3.5 API module structure

`repertoire/` already has `controllers/` and `dto/`; `bands/` is flat with a
`dto/`; `auth/` has `decorators/`, `guards/` and `strategies/`. Three different
shapes.

The canonical shape for every module:

```
apps/api/src/<module>/
  <module>.module.ts
  <module>.service.ts
  <module>.service.spec.ts
  <module>.service.int-spec.ts
  controllers/
    <scope>.controller.ts
    <scope>.controller.spec.ts
  dto/
    index.ts
    <name>.dto.ts
  guards/          (as needed)
  decorators/      (as needed)
```

Bring `bands/` in line with it; document it in the skill.

---

## Phase 4 — Database

The schema is good overall: comments explain _why_ (rare), the indexes are
considered, `@map` is consistent. Three concrete improvements.

### 4.1 `duration` → `durationSeconds Int` ✅ DONE

> **Completed 2026-08-16.** Migration `20260816200000_duration_to_seconds`,
> `TrackSortField.TIME` now maps to `orderBy: { durationSeconds }`, and the
> client formats via `formatTrackDuration`. Recorded in
> [ADR 0005](./adr/0005-duration-as-seconds.md).

```prisma
model Track {
  // Track length in whole seconds. Formatting to "m:ss" happens on the client.
  // An integer so the database can sort by it.
  durationSeconds Int @map("duration_seconds")
}
```

Migration: add the column → backfill from `duration` in SQL → make it
`NOT NULL` → drop `duration`.

> **What was actually done differs from the original plan here.** This says
> three separate migrations for a zero-downtime deploy; it shipped as one
> transactional migration instead, because there is a single API instance that
> a deploy replaces, so no window exists in which old code reads a dropped
> column. ADR 0005 records that, and says not to copy the pattern if rolling
> deploys arrive.

It removes `parseDuration()` from the service and half of the post-query
sorting.

### 4.2 A sortable status order

Three options:

**A.** Rename the enum values so alphabetical order matches the logical order —
brittle and ugly.

**B.** Add a `statusWeight Int` with a trigger or default — duplicates data.

**C (recommended).** Sort with `ORDER BY CASE` in a Prisma raw fragment:

```ts
orderBy: {
  status: dir;
} // ← does not do what is wanted
// →
$queryRaw`... ORDER BY CASE status WHEN 'new' THEN 0 WHEN 'learning' THEN 1 ... END ${dir}`;
```

Or — cleanest — a reference table `track_statuses(code, weight, label)` with a
foreign key. That also gives localised status names in the database instead of
hardcoding them in JSON. The decision is worth its own ADR.

### 4.3 The `@@unique([bandId, order])` trap

The schema comment states it honestly: "Null bandId is excluded from the
constraint". The consequence: **two solo tracks of the same user can share an
`order`**, and `orderBy: order` is non-deterministic for them.

Actions:

1. Add a partial unique index for solo tracks:

```sql
CREATE UNIQUE INDEX tracks_solo_order_key
  ON tracks (lead_member_id, "order")
  WHERE band_id IS NULL;
```

2. Write an integration test proving a duplicate insert fails.
3. Document it in `data-model.md`.

### 4.4 `onDelete` for `leadMember`

`Track.leadMember` has no `onDelete`, so the default `Restrict` applies.
Deleting a user who leads at least one track fails with a foreign key error.
That may well be intentional (protection against data loss), but it is
currently neither documented nor covered by a test.

Action: decide deliberately (`Restrict` plus a clear API error, or `SetNull`
plus `leadMemberId String?`), record it in an ADR, cover it with an integration
test.

### 4.5 The test database and seeding

`db:seed` currently serves every purpose. Integration tests need a separate,
deterministic set (fixed ids, no `faker`), or the tests drift.

Add `packages/db/src/seed/test-fixtures.ts` separately from the dev seed.

---

## Phase 5 — Folder structure

The overall structure is already good. Targeted improvements:

### 5.1 Web — `lib/` is overloaded

`lib/` currently holds `api/`, `constants/`, `hooks/`, `types/` and
`variants/` — five different responsibilities. Separately there is
`src/hooks/` for global hooks, giving two hook folders.

```
src/hooks/global/useAuth        ← global
src/lib/hooks/useRepertoire     ← React Query
```

The distinction is real (one is UI state, the other server state) but invisible
from the names. Proposed layout:

```
src/
  api/              ← was lib/api  (fetch functions)
  queries/          ← was lib/hooks (React Query hooks; the name says so)
  hooks/            ← ALL other hooks, no nested global/
  constants/        ← was lib/constants
  types/            ← was lib/types
  variants/         ← was lib/variants
  utils/
  components/
```

`lib/` disappears as "the folder for everything that is not a component" — an
antipattern that always sprawls. The change is mechanical (renames plus tsconfig
paths), fits in one PR, and carries low risk.

### 5.2 Feature grouping for the large domains

`components/repertoire/` and `components/profile/` are already feature modules
in practice. For large features it makes sense to co-locate everything:

```
src/features/repertoire/
  components/
  queries/
  utils/
  types/
  constants/
  index.ts        ← the feature's public API
src/features/metronome/
src/features/profile/
```

`src/components/` would then hold only what is genuinely shared: `ui/`,
`typography/`, `layout/`, `form/`, `shared/`.

The benefit: deleting a feature means deleting one folder. The rule "a feature
does not import from another feature directly, only through its `index.ts`" is
enforceable with `import/no-restricted-paths`.

This is the most expensive change in the plan — do it **after** Phases 0–1,
once tests protect against regression.

### 5.3 Small things

- `src/illustrations/vinyl/VinylRecord/` and `src/illustrations/vinyl-crate/`
  are inconsistent: one nested under `vinyl/`, the other at the top level.
  Align them.
- `src/icons/` has 5 subfolders (`achievements`, `base`, `brand`, `colorful`,
  `status`) — `colorful` describes _appearance_, the rest describe _domain_.
  Rename it by domain.
- `components/repertoire/buttons/` and `components/shared/buttons/` — a
  `buttons/` folder groups by element type rather than purpose. Either lift the
  components a level, or document the rule.

---

## Phase 6 — Documentation and the AI environment

### 6.1 Discrepancies to fix immediately

| Claim in the docs                                        | Reality                                  |
| -------------------------------------------------------- | ---------------------------------------- |
| `packages/types/src/band/band.types.ts`                  | actually `repertoire/band.types.ts`      |
| types: only `repertoire/`, `band/`                       | there are also `common/`, `user/`        |
| API: flat `bands.controller.ts` etc.                     | `repertoire/` has `controllers/`, `dto/` |
| `stores/metronome.store.ts`                              | there is no `stores/` folder             |
| "CI runs … all six gate"                                 | `api.yml` ran no tests                   |
| "no `any`"                                               | the API had `no-explicit-any: off`       |
| the skill does not mention `src/data/`                   | it exists, with 6 files                  |
| the skill does not mention `auth/`, `prisma/`, `config/` | they exist                               |

### 6.2 What the AI documentation is missing

This is the biggest gap. Modules the AI knows **nothing** about:

1. **Auth** — the OAuth flow, `oauth-state.store.ts`, guards, strategies,
   decorators, how to get the current user in a controller. The most critical.
2. **Prisma layer** — `PrismaService`, how to mock it, transactions.
3. **API client** — `lib/api/client.ts`: base URL, error handling, credentials.
4. **React Query conventions** — query key structure, `staleTime`, invalidation
   after a mutation, error handling.
5. **Theme system** — how `useTheme` works, `data-theme`, where tokens live.
6. **Env vars** — a complete list in one table.

### 6.3 Restructuring CLAUDE.md

CLAUDE.md and the skill duplicated roughly 40% of their content (the whole i18n
section, the code quality rules, JSDoc). That doubles the context for no new
information.

The split:

- **CLAUDE.md** — _process_: definition of done, commands, testing policy,
  documentation policy, CI gates. One "Conventions" section pointing at the
  skill.
- **the skill** — _code_: everything about what a correct file looks like
  (styles, tokens, component structure, naming, patterns).
- i18n lives entirely in the skill; CLAUDE.md only links to it.

### 6.4 The AI environment ✅ DONE

The problem was twofold: **volume** and **drift**.

_Volume._ CLAUDE.md (~3.5k tokens) plus the skill (~8.5k) loaded into every
session — ~12k tokens before a single line of code was read.

_Drift._ Both files described the project structure by hand. A hand-written
description of a file tree goes stale within a week and then does active harm:
the AI confidently generates code from a wrong map.

**The solution — three levels, read on demand:**

```
CLAUDE.md              ~1.9k  process + router. Always loaded.
docs/ai/ORIENTATION.md ~2.4k  cold start: rules, traps, where to go next.
docs/ai/RECIPES.md     ~3.4k  step-by-step: which files, in which order.
docs/ai/GIT.md         ~3.0k  branches, commits, rebase vs merge.
docs/ai/MAP.md         ~4.1k  GENERATED. Inventory of everything in the project.
the conventions skill  ~8.6k  what correct code looks like. Only when writing code.
```

A session fixing an API bug reads CLAUDE.md + ORIENTATION + one recipe — ~5k
instead of 12k, and none of those tokens describe files irrelevant to the task.

**The key idea — `scripts/generate-ai-map.mjs`.** Anything derivable from the
code is not written by hand:

- components flagged with "has a test" / "has a story";
- utils, hooks and React Query hooks flagged by coverage;
- HTTP routes extracted from the Nest decorators;
- services flagged by unit / integration test;
- Prisma models and enums;
- the exports of `@nonsololarco/types`;
- translation namespaces with key counts per locale and a mismatch flag
  against `en`.

The map cannot drift from the code, because it is derived from it. It also gave
a coverage dashboard for free: which components have no tests is immediately
visible.

`pnpm ai:map` runs it manually; lint-staged (section 0.3) runs it automatically
on every commit touching `apps/**/src/**`.

**What the map revealed straight away:**

- OAuth supports **GitHub as well as Google** — GitHub appeared in no document;
- `apps/web/src/components/profile/Profile.tsx` sits without its own folder,
  breaking the "one file, one folder" rule;
- 24 components have stories, not zero as first assumed — the stories live
  centrally in `apps/web/stories/`, and the generator was looking in the wrong
  place;
- translation key counts match across locales (14/25/80), so i18n is in order —
  something nothing had previously verified.

**Language of the AI docs.** `CLAUDE.md`, `ORIENTATION.md`, `RECIPES.md` and
`GIT.md` are written in English, and this plan was translated to match. Cyrillic
costs roughly twice the tokens per character, and these files load on every
session; the project already requires English for code, comments and tests, so
English documentation is consistent rather than a special case.

### 6.5 Generate diagrams, do not draw them

**Already done:** `docs/architecture/overview.md` — five Mermaid diagrams for
human readers (system, ERD, request path, git flow, frontend layering). Mermaid
renders on GitHub and diffs as text, so unlike a PNG it is visible in review.

**The remaining problem:** two of those diagrams will go stale. The ERD on the
first schema change; the layering graph on the first new import. A hand-drawn
diagram that has drifted from the code is worse than none — it lies
confidently.

Four tools worth adding. The first two precisely because they replace manual
work with generation; the third is already installed and merely underused; the
fourth is one-off diagnostics.

| Tool                        | What it gives                                        | Priority |
| --------------------------- | ---------------------------------------------------- | -------- |
| `dependency-cruiser`        | Dependency graph **plus rules that fail CI**         | **high** |
| `prisma-erd-generator`      | ERD from `schema.prisma` on every `db:generate`      | medium   |
| Storybook (already present) | Visual catalogue of 24 components + a11y + Chromatic | medium   |
| `turbo run build --graph`   | Monorepo package dependency graph                    | low      |

#### dependency-cruiser — the most valuable, because it is not just a picture

It draws the graph, but more importantly it **checks architectural rules** and
fails CI. That does not exist at all today: the boundary between the design
system and the domain is a convention only.

```sh
pnpm add -Dw dependency-cruiser
```

```js
// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    {
      name: 'ds-must-not-import-features',
      comment:
        'A design-system component that pulls in a feature, the session or React Query ' +
        'stops being reusable. This is a blocker for the move into packages/ui.',
      severity: 'error',
      from: { path: '^apps/web/src/components/ui' },
      to: {
        path: '^apps/web/src/(components/(repertoire|profile|metronome)|lib/hooks|lib/api|hooks/global|data)',
      },
    },
    {
      name: 'features-must-not-cross-import',
      comment: 'A feature imports another feature only through its public index.ts.',
      severity: 'warn',
      from: { path: '^apps/web/src/components/(repertoire|profile|metronome)/' },
      to: {
        path: '^apps/web/src/components/(repertoire|profile|metronome)/[^/]+/.+',
        pathNot: '^apps/web/src/components/(repertoire|profile|metronome)/[^/]+/index\\.ts$',
      },
    },
    {
      name: 'no-mocks-in-production',
      comment: 'src/data/ holds mocks. They do not belong in components.',
      severity: 'error',
      from: { path: '^apps/web/src/components' },
      to: { path: '^apps/web/src/data' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      comment: 'A file nobody imports is dead code.',
      severity: 'warn',
      from: { orphan: true, pathNot: '\\.(test|stories|d)\\.tsx?$|^apps/web/app/' },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'apps/web/tsconfig.json' },
    reporterOptions: {
      dot: { collapsePattern: '^apps/web/src/(components|lib|hooks)/[^/]+' },
    },
  },
};
```

```json
"scripts": {
  "graph": "depcruise apps/web/src --output-type dot | dot -T svg > docs/architecture/dependency-graph.svg",
  "graph:check": "depcruise apps/web/src --validate"
}
```

`graph:check` goes into CI alongside lint. `no-circular` and `no-orphans` will
almost certainly find something immediately — circular imports between barrels
are the characteristic disease of a "folder + index.ts" structure.

The `ds-must-not-import-features` rule is effectively a **rehearsal for the move
into `packages/ui`** (PRs #17–19). If it is green, the migration will be
mechanical; if it is red, it shows exactly what has to be untangled first.

#### prisma-erd-generator

```sh
pnpm --filter @nonsololarco/db add -D prisma-erd-generator @mermaid-js/mermaid-cli
```

```prisma
generator erd {
  provider = "prisma-erd-generator"
  output   = "../../../docs/architecture/erd.md"
  theme    = "forest"
}
```

The ERD then updates itself on every `db:generate`, which is mandatory after
any schema change anyway. The hand-drawn ERD in `overview.md` is then replaced
by a link to the generated one.

One caveat: the generator runs on every `db:generate`, which slows the loop a
little. If that becomes annoying, split it into a separate `db:erd` and call it
from pre-commit alongside `ai:map`.

#### Storybook — underused

Already installed: 24 stories, with `addon-a11y`, `addon-vitest` and Chromatic
configured. The main things going unused:

- **`addon-a11y` in CI** — automatic contrast checking in both themes. It would
  catch exactly the class of bug the skill describes ("invisible text in
  whichever theme was tested less").
- **Chromatic on PRs** — visual regression. For a retro design system with
  offset shadows and two themes, it is the cheapest way to see that a refactor
  shifted something by 2px.

#### turbo graph

```sh
pnpm turbo run build --graph=docs/architecture/turbo-graph.svg
```

One-off diagnostics, not for CI. Useful exactly twice: now, to see the current
package dependencies, and after the `packages/ui` extraction, to check the new
package created no extra edges.

### 6.6 New documents

```
docs/architecture/auth.md          ← OAuth flow, guards, session (Mermaid diagram)
docs/architecture/api-client.md    ← the frontend API access layer
docs/architecture/testing.md       ← the pyramid: unit / integration / e2e, when to use which
docs/adr/0006-track-status-ordering.md
docs/adr/0007-feature-folder-structure.md
docs/CONTRIBUTING.md               ← local setup, branches, PR checklist
```

Each linked from `docs/README.md`.

---

## New rule: prop sorting

**Goal:** alphabetical, but required props always before optional ones.

### The good news — the installed plugin already does this

`eslint-plugin-typescript-sort-keys` supports a `requiredFirst` option. Change
in `apps/web/eslint.config.js`:

```js
// before
'typescript-sort-keys/interface': 'error',

// after
'typescript-sort-keys/interface': [
  'error',
  'asc',
  { caseSensitive: false, natural: true, requiredFirst: true },
],
```

`natural: true` additionally fixes sorting so `item2` comes before `item10`.

Add the same to the new `packages/eslint-config/nest.js` for API DTOs.

### What it changes in practice

```ts
// ❌ before (plain alphabetical)
export interface TrackListRowProps {
  index?: number;
  isMyTrack?: boolean;
  track: Track;
}

// ✅ after — required first
export interface TrackListRowProps {
  track: Track;
  index?: number;
  isMyTrack?: boolean;
}
```

```ts
// ✅ Button — required, then optional, alphabetical within each group
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  icon?: ElementType;
  iconPosition?: IconPositionType;
  isLoading?: boolean;
  variant?: VariantProps<typeof buttonVariants>['variant'];
}
```

**Why this is right.** Reading an interface from the top, you see the
component's minimal contract immediately — what you _must_ pass. Optional props
are configuration. The same order applies naturally to function signatures, so
the rule is consistent with the rest of the code.

### The cost of migrating

The rule is `fixable: 'code'` — `eslint --fix` reorders the keys automatically
(verified against the installed version of the plugin). So the migration costs
one run:

```sh
pnpm --filter web lint --fix
```

Do it as its own PR, "chore(web): sort interface keys required-first", with no
other changes — then the diff reads as a pure reorder and review is trivial.

One caveat: `caseSensitive: false` also changes order where `requiredFirst` is
irrelevant (`Zebra` vs `apple`, for instance). To avoid extra noise in the same
PR, leave `caseSensitive: true` (the default) and change only `requiredFirst`.

### The rule text for CLAUDE.md and the skill

> **Interface key sorting.** Required fields come first, optional ones after;
> within each group, alphabetically and case-insensitively. The reader sees the
> minimal contract at the top and the configuration below. Enforced by
> `typescript-sort-keys/interface` with `requiredFirst: true`.

---

## Phase 7 — Observability and release notes

Two different questions that are easy to conflate. One is urgent, the other is
nice to have.

### 7.1 Current state: production is invisible

**The entire API contains exactly one line of logging:**

```ts
// apps/api/src/main.ts:52
bootstrap().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

That is all. No structured logs, no request correlation, no error tracking.
Nest has a built-in `Logger`; it is used nowhere.

The practical consequence: if a request to `/api/bands/:id/repertoire` fails for
a user right now, you find out only if they tell you. No alert, no stack trace,
no sense of how many people it affected. `console.error` settles in the
container console with no retention and no search.

**This is the biggest gap the audit found** — bigger than test coverage. A test
catches what you anticipated; observability catches what you did not. And what
breaks in production is the second kind.

### 7.2 Sentry — first priority

One integration closes most of the problem: an error arrives with a stack
trace, a count of affected users, and breadcrumbs of what the user was doing
before it broke.

```sh
pnpm --filter web add @sentry/nextjs
pnpm --filter api add @sentry/nestjs
```

The settings people most often skip:

```ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  // Ties the error to a release — shows which deploy introduced it
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    delete event.request?.cookies;
    if (event.request?.headers) delete event.request.headers.authorization;
    return event;
  },
});
```

`release` is worth tying to the tags from the "Releasing" section of
`docs/ai/GIT.md` — then every release shows which errors it introduced and
which it fixed. That is exactly what is missing today, because there are no
tags.

The free tier will last a long time for a project this size. If Sentry is
unwanted, GlitchTip is self-hosted and compatible with the same SDK.

### 7.3 Structured API logging

Logs are needed where there is no error but the behaviour is odd: a slow
request, an unexpected order, an empty response.

```sh
pnpm --filter api add nestjs-pino pino-http pino-pretty
```

What this gives over `console.log`:

- **JSON in production, readable output in dev** — same code, different
  transport.
- **A `requestId` on every line** — all logs for one request are found with a
  single filter. Without it, concurrent requests interleave and become
  unreadable.
- **Automatic request/response logging with duration** — slow endpoints become
  visible with no extra work. For §3.2 (the sort that loaded the whole table)
  this produces numbers instead of assumptions.

**What never to log:** passwords, tokens, cookies, the `authorization` header,
full request bodies, plaintext email. Redaction must be explicit:

```ts
LoggerModule.forRoot({
  pinoHttp: {
    redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
    level: process.env.LOG_LEVEL ?? 'info',
  },
});
```

**Levels.** `error` — broken, needs looking at. `warn` — degraded but still
working (a fallback fired). `info` — business events (a user created a track).
`debug` — local only. Log everything at `info` and the signal drowns in noise,
at which point people stop reading logs at all.

Related to §3.3: the global exception filter is the natural place where
uncaught errors are both logged and reported to Sentry.

### 7.4 CHANGELOG — release-please

There is no `CHANGELOG.md` and **no tags at all**. So the question "what
changed between the version that worked yesterday and the one that broke today"
has no answer in principle.

**release-please** fits the model already chosen exactly:

| What already exists            | What release-please does with it               |
| ------------------------------ | ---------------------------------------------- |
| Conventional Commits           | reads them, groups by type                     |
| Squash merge into `develop`    | one clean commit per feature — the ideal input |
| PR title = commit subject      | the changelog heading comes from there         |
| `develop` → `main` = release   | opens a Release PR on merge into `main`        |
| No tags (GIT.md requires them) | creates them itself                            |

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
          package-name: nonsololarco
```

How it works: after `develop` merges into `main`, the bot opens a
"chore: release v0.5.0" PR with a generated CHANGELOG and a bumped version. You
review it, adjust the wording if needed, merge — and the tag and GitHub Release
are created automatically.

**Why not the alternatives:**

- **`changesets`** — strong when publishing several npm packages with
  independent versions. You publish nothing; it would be cost without benefit.
- **`semantic-release`** — releases automatically on every merge. That
  contradicts ADR 0004, where a release is a deliberate act.
- **Writing it by hand** — survives exactly three releases.

**Precondition.** A changelog is only as good as the commit messages.
`fix: according to comments` reads in release notes exactly as it sounds. So
§0.1 (commitlint) and the PR title workflow have to come first, or the tool
will neatly generate rubbish.

### 7.5 What not to add yet

- **Metrics (Prometheus/Grafana)** — a solution without a problem at the current
  traffic. Sentry covers errors; the hosting provides basic graphs.
- **OpenTelemetry tracing** — makes sense from three services up. You have two.
- **A dedicated log service (Datadog, Logtail)** — when the hosting retention
  starts to hurt. Not before.

All three are easy to add later, and none solves the problem that exists today.

### 7.6 Order within the phase

| #   | What                    | Why in this order                                            |
| --- | ----------------------- | ------------------------------------------------------------ |
| 1   | Sentry on web and api   | the only thing that makes production visible today           |
| 2   | Exception filter + pino | structure for what is not a crash                            |
| 3   | Tags on `main`          | a precondition for both the changelog and Sentry's `release` |
| 4   | release-please          | once the commits are clean                                   |

---

## Execution order

Each row is one PR. The order is arranged so the cheap, low-risk work lands
first, and the most expensive structural change comes only once tests catch
regressions.

| #   | PR                                                                        | Phase    | Risk     | Impact               |
| --- | ------------------------------------------------------------------------- | -------- | -------- | -------------------- |
| 0   | ✅ `docs: AI environment (ORIENTATION, RECIPES, MAP, slim CLAUDE.md)`     | 6.4      | none     | **very high**        |
| 1   | ✅ `chore: prettier config + hoist sort-imports`                          | 0.5      | none     | high                 |
| 2   | ✅ `chore: husky + lint-staged`                                           | 0.3      | none     | high                 |
| 2a  | ✅ `chore: commitlint + .gitattributes + branch protection`               | 0.3.2    | none     | high                 |
| 3   | ✅ `chore(web): enforce no-nested-ternary, prefer-const` + 3 fixes        | 0.1      | low      | high                 |
| 3a  | ✅ `fix(web): mis-0.25/mie-0.25 in Button generate no CSS` + lint guard   | 0.1.1    | low      | high                 |
| 3b  | ✅ `chore(web): file, function and complexity size limits`                | 0.1.2    | none     | medium               |
| 4   | ✅ `chore: eslint-config/nest + align api strictness`                     | 0.2      | medium   | high                 |
| 5   | ✅ `ci: drop the duplicate api.yml, ci.yml already covers the API`        | 0.4      | low      | high                 |
| 6   | ✅ `chore(web): sort interface keys required-first`                       | rule     | low      | medium               |
| 7   | ✅ `test: diff-coverage 90% + ratchet thresholds`                         | 1.4      | none     | high                 |
| 8   | ✅ `refactor(api): merge three RepertoireService methods into findTracks` | 3.1      | medium   | high                 |
| 9   | ✅ `test(api): integration tests with testcontainers`                     | 1.2      | low      | **very high**        |
| 10  | ✅ `feat(db): durationSeconds + backfill migration`                       | 4.1      | high     | high                 |
| 11  | `fix(db): partial unique index for solo tracks`                           | 4.3      | medium   | high                 |
| 11a | `feat: Sentry on web and api`                                             | 7.2      | low      | **very high**        |
| 12  | `feat(api): BandMembershipGuard + exception filter + pino`                | 3.3, 7.3 | medium   | high                 |
| 13  | `refactor(web): remove the duplicate profile.types`                       | 2.1      | low      | medium               |
| 14  | `refactor(web): src/data → test/fixtures or the real API`                 | 2.3      | medium   | medium               |
| 15  | `docs: auth.md, api-client.md, testing.md + ADRs`                         | 6.6      | none     | high                 |
| 16  | `docs: sync the skill with reality`                                       | 6.1–6.3  | none     | **very high for AI** |
| 16a | `chore(config): dependency-cruiser + boundary rules in CI`                | 6.5      | low      | **high**             |
| 16b | `chore(db): prisma-erd-generator`                                         | 6.5      | none     | medium               |
| 17  | `chore(ui): delete boilerplate, rename @repo/ui → @nonsololarco/ui`       | 2.4      | low      | medium               |
| 18  | `refactor(ui): move cn + tokens.css into packages/ui`                     | 2.4      | medium   | high                 |
| 19  | `refactor(ui): move the 14 DS primitives in batches`                      | 2.4      | **high** | **very high**        |
| 19a | `chore(ci): tags on main + release-please`                                | 7.4      | none     | high                 |
| 20  | `test(web): e2e auth, i18n, theme`                                        | 1.6      | low      | high                 |
| 21  | `refactor(web): lib/ → api/, queries/, constants/, types/`                | 5.1      | medium   | medium               |
| 22  | `refactor(web): features/ structure`                                      | 5.2      | **high** | medium               |

**The first 7 PRs can be done in a week** — they barely touch product code, but
after them every new convention violation is caught automatically.

PR #9 (integration tests) is the largest return on time invested in the whole
plan. It also unblocks #10–#12: schema changes without integration tests are
frightening to make.

PR #16 is worth doing earlier than its number suggests: while the docs disagree
with the code, every AI session starts from a wrong picture of the world and
generates code that has to be redone.

PRs #17–#19 (extracting the design system) deliberately sit after the coverage
thresholds (#7): moving a component without a test is then visible immediately
rather than a month later. The first two are cheap and low-risk — they can be
pulled forward if the confusion of having two `Button`s should end sooner.

PR #22 (the `features/` structure) is the one that can be deliberately dropped.
It gives the smallest gain per unit of risk, and after #19 part of its benefit
is already achieved: the boundary between design system and domain is drawn
physically.
