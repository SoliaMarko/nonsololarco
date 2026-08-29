<!--
  The author fills everything except "Reviewer focus" and the QA section.
  When Claude opens the PR it fills this in from the real diff — see
  docs/ai/GIT.md § "Opening a PR".

  Unchecked boxes are fine and expected. An unchecked box with a one-line
  reason next to it is information; a checked box that isn't true is a lie the
  reviewer will act on.
-->

## What and why

<!--
  Two or three sentences. What changed from the user's point of view, and what
  problem it solves. Not how — the diff shows how.
-->

## Approach

<!--
  Only when the diff does not speak for itself: a non-obvious design choice, a
  trade-off taken, something deliberately left out. Delete this section if the
  change is straightforward.
-->

## Reviewer focus

<!--
  Where you actually want eyes. "All of it" is not an answer.
  e.g. "The pagination boundary in repertoire.service.ts:180 — I am not sure
  the off-by-one is right for the last page."
-->

## Definition of done

<!-- Reference: CLAUDE.md § Definition of done -->

- [ ] **Tests** — unit tests for every new module, in this PR, not later
  - [ ] Happy path, empty/zero case, every error branch
  - [ ] Integration test if real DB behaviour is involved (ordering, constraints, cascades, enum mapping)
  - [ ] E2E if this touches auth/permissions, round-trips to the API, has multi-step or URL state, or could fail silently
  - [ ] For a bug fix: the test fails without the fix
- [ ] **JSDoc** on every exported util, hook and service method — units, edge cases, why it exists
- [ ] **Docs** updated per the table in `CLAUDE.md`, checked against the real diff
  - [ ] `docs/features/` — user-facing behaviour changed
  - [ ] `docs/architecture/api-*.md` — endpoint or query param changed
  - [ ] `docs/architecture/data-model.md` — `schema.prisma` changed
  - [ ] `docs/adr/` — a real alternative was rejected
  - [ ] New doc files linked from `docs/README.md`
- [ ] **`pnpm ai:map`** run if files were added or removed
- [ ] **Checks green locally:** `pnpm lint && pnpm stylelint && pnpm typecheck && pnpm test && pnpm build`

<!--
  Steps that genuinely do not apply: say so instead of leaving them blank.
  e.g. "No feature doc — this is a pure refactor with no behaviour change."
-->

**Not applicable:**

## Conventions

- [ ] Searched `docs/ai/MAP.md` before adding a component — no duplicate created
- [ ] Existing component extended with a variant rather than forked, where applicable
- [ ] Logical CSS properties only (`pli-`/`plb-`/`mli-`/`mbs-`/`mbe-`), values on the plugin scale
- [ ] One component per file, one file per folder, barrel `index.ts`
- [ ] Interface keys: required first, then optional, alphabetical within each group
- [ ] New design-system component has a story in `apps/web/stories/`
- [ ] Tests and `aria-label` in English; no assertions on CSS classes, `data-testid` or DOM structure
- [ ] All three locales updated together (`en`, `it`, `uk`)
- [ ] No `console.log`, no commented-out code, no hardcoded secrets

## Commits

- [ ] Every commit is `<type>(<scope>): <what changed>`, scope present
- [ ] No `fix: test` / `fix: according to comments` — those get squashed away, but the PR title must be a real commit subject
- [ ] Branch rebased onto `origin/develop`, not merged
- [ ] Under the size limit (20 files / 500 lines), or mechanical-only and the subject says so

## QA

<!--
  For the reviewer to reproduce. Delete rows that do not apply.
-->

|                 |                                                            |
| --------------- | ---------------------------------------------------------- |
| **How to test** | <!-- 1. run `pnpm dev` 2. open /en/repertoire 3. … -->     |
| **Seed needed** | <!-- `pnpm --filter @nonsololarco/db db:seed`, or "no" --> |
| **Migration**   | <!-- yes → `db:migrate && db:generate` first, or "no" -->  |
| **Env vars**    | <!-- new variables, or "none" -->                          |
| **Breaking**    | <!-- what breaks for existing data or callers, or "no" --> |

### Checked manually

- [ ] Mobile and desktop
- [ ] Dark and light theme — no invisible text from a token collapsing
- [ ] Keyboard navigation and focus order
- [ ] Empty / loading / error states

## Screenshots

<!-- UI changes: before and after, both themes. API changes: request/response. -->

<details>
<summary>Before</summary>

</details>

<details>
<summary>After</summary>

</details>

## AI review

- [ ] CodeRabbit / Copilot review completed
- [ ] Every critical comment addressed, or dismissed in a reply with the reasoning
