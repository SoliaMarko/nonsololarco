# GIT — branches, commits, merging

> These rules exist so that `git log` on `develop` reads like a changelog, and
> so that `git bisect` can find a regression. Both stop working the moment
> history becomes a record of _how the work happened_ rather than _what
> changed_.

Every number below is calibrated against this repo's actual history (last 120
commits), not copied from a generic guide.

---

## The one-line version

Branch off `develop` → commit in Conventional Commits form with a scope →
update via **rebase**, never merge → open a PR → **squash merge**.

---

## Branches

```
main                  production. Protected. Only release merges from develop.
develop               integration. Protected. All feature branches start here.
<type>/LARK-<issue>-<slug>
```

Types in use: `feature/`, `fix/`, `chore/`, `refactor/`, `docs/`, `redesign/`.

**Work is tracked in GitHub Issues, not Jira.** Every branch starts from an
issue, and the number in the branch name is that issue's number. The prefix is
**`LARK`** — the lark, a songbird, hiding inside the project's own name:
nonsolo**lar**co. It replaces the Jira-era `CLEF-` and `SCRUM-`.

GitHub shares one counter between issues and pull requests, so `LARK-70` is
simply issue #70. The prefix is decorative; the number is real and links back.

```text
✅ feature/LARK-70-api-error-contract
✅ chore/LARK-80-dependency-cruiser
✅ fix/LARK-75-pagination-off-by-one

❌ fix-stuff                    no type, no issue
❌ feature/new-component        no issue, so nothing links back
❌ LARK-70                      no type, no description
❌ feature/CLEF-177-…           Jira-era prefix, not for new work
```

Open the issue first, then branch from it. Branches already in flight under
`CLEF-` or `SCRUM-` keep their names; only new work uses `LARK`.

Slug is lowercase, hyphenated, and describes the outcome — not the file
touched. `reusable-tabs-component`, not `edit-tabs-tsx`.

**Never commit directly to `main` or `develop`.** Both should be protected in
GitHub settings with "Require a pull request before merging".

---

## Commit messages

Conventional Commits. Lowercase, imperative present tense, no trailing period.

```
<type>(<scope>): <what changed>
```

**The scope is mandatory.** In the last 120 commits, 78 had one and 42 did not
— that inconsistency is what makes the log hard to scan.

| Type       | For                                    |
| ---------- | -------------------------------------- |
| `feat`     | new user-visible capability            |
| `fix`      | bug fix                                |
| `refactor` | restructuring with no behaviour change |
| `test`     | adding or fixing tests only            |
| `docs`     | documentation only                     |
| `chore`    | tooling, deps, config                  |
| `ci`       | pipelines and workflows                |
| `perf`     | performance work                       |
| `style`    | formatting only, no code change        |

Scopes: `web`, `api`, `packages`, `types`, `db`, `ui`, `config`, `docs`, `ci`.

```
✅ feat(web): add RepertoireFilterBar component
✅ fix(api): guard missing members array in track mapper
✅ refactor(api): merge three repertoire query methods into findTracks
✅ test(web): cover empty state in TracksTable

❌ fix: test                          says nothing
❌ fix: according to comments         says nothing
❌ fix: according to comments, p.2    says nothing, twice
❌ feat: extract Tabs to DesignSystem no scope
❌ Fixed the button                   past tense, capitalised, no type
```

### The "fix: according to comments" problem

Fourteen of the last 120 commits carry no information at all — `fix: test`,
`fix: ci issues`, `fix: according to comments`. They come from review rounds,
which is normal and fine **on the branch**. The mistake is letting them reach
`develop`.

Two ways out, and you need both:

1. **Squash merge** (below) collapses the whole branch into one meaningful
   commit. The messy intermediates stay visible in the PR, where they belong.
2. **`git commit --fixup`** while working, so intermediate commits are already
   marked for folding:

   ```sh
   git commit --fixup HEAD~2        # marks it as a fix for that commit
   git rebase -i --autosquash develop
   ```

### Body and footer

A one-line subject is enough for most commits. Add a body when the _why_ is
not obvious:

```
fix(api): append id as the final orderBy criterion

Without a tiebreaker, Postgres may return rows in a different order
between two requests for the same page, so a track could appear on both
page 1 and page 2, or on neither.

Refs #75
```

Wrap the body at 72 characters. Reference the issue in a footer, not the
subject — the branch name already carries it. `Refs #75` links without closing;
`Closes #75` links and closes on merge.

---

## Commit size

A commit is a unit of review and a unit of `git revert`. Both break when it is
too large to hold in your head.

|                                                 | Files  | Lines changed |
| ----------------------------------------------- | ------ | ------------- |
| **Target** (current median: 3 files / 57 lines) | ≤ 5    | ≤ 150         |
| **Soft limit** — justify in the body            | ≤ 10   | ≤ 300         |
| **Hard limit** — split it                       | **20** | **500**       |

**Excluded from the count**, because they are generated or bulk-mechanical:

- lockfiles (`pnpm-lock.yaml`)
- Prisma migrations (`packages/db/prisma/migrations/**`)
- generated files (`docs/ai/MAP.md`, `packages/db/generated/**`)
- translation files when the change is a bulk key addition
- pure renames with no content change
- **new documentation files** (`docs/**/*.md`) — see below

**Why documentation is exempt from the line count.** A prose document is not
reviewed line by line the way code is; a 600-line doc is read once, top to
bottom, and splitting it across commits makes it _harder_ to review, not
easier. The file-count limit still applies — a commit touching fifteen doc
files is a dumping ground, whatever its line count.

The exemption is for **new** documents. Editing prose scattered across many
existing docs is the reviewable kind of change and counts normally.

Current reality: 9 of 120 commits exceed 20 files and 20 exceed 400 lines. The
worst is `chore: fix file structure in lib folder` — 119 files. A commit like
that cannot be reviewed and cannot be reverted cleanly.

**When a change genuinely is that big** — a repo-wide rename, a formatting
pass — it must be _mechanical only_, contain nothing else, and say so in the
subject: `chore(web): move lib/** to src/api, src/queries (no logic change)`.
Never mix a mechanical change with a behavioural one; the behavioural part
becomes invisible.

### Atomic commits

One commit, one logical change. Not "one file" and not "one day's work".

```
❌ feat(web): add filter bar, fix pagination bug, update deps

✅ chore(web): bump next-intl to 4.1
✅ fix(web): reset page to 1 when the filter changes
✅ feat(web): add RepertoireFilterBar component
```

The test for a new module goes **in the same commit** as the module — they are
one logical change. A fix goes in the same commit as the test that catches it.

---

## Updating a branch: rebase, never merge

This repo's history currently contains commits like:

```
Merge branch 'feature/CLEF-168-...' of github.com:SoliaMarko/... into feature/CLEF-168-...
Merge branch 'develop' into feature/CLEF-163-...
```

The first is `git pull` creating a merge with your own remote branch. The
second is merging `develop` into a feature branch. Both add commits that
describe _the mechanics of syncing_, not any change, and both make the diff
harder to read.

**Configure this once, and the first kind disappears forever:**

```sh
git config --global pull.rebase true
git config --global rebase.autoStash true
git config --global rebase.autosquash true
```

**To bring in the latest `develop`:**

```sh
git fetch origin
git rebase origin/develop
```

Not `git merge develop`.

### Why rebase and not merge

Start with the honest part: **because PRs into `develop` are squashed, the end
state of `develop` is identical either way** — one commit per feature. So this
is not about `develop`'s history. It is about three things that happen before
the squash.

**1. A bad conflict resolution is invisible in a merge commit.** This is the
strongest argument by far. When you merge `develop` into your branch and
resolve a conflict wrongly — dropping someone's line, keeping the stale side —
that mistake lives inside the merge commit. GitHub does not show merge-commit
diffs in the PR file view by default, so no reviewer will ever look at it. The
bug reaches production having been "reviewed".

Rebase replays _your_ commits onto the new base, so the same resolution appears
as ordinary lines in an ordinary commit, inside the PR diff, where a reviewer
sees it.

**2. Conflicts get resolved with context, one commit at a time.** A merge dumps
every conflict from every incoming change into one lump, out of order, with no
indication which of your commits it relates to. A rebase stops at the specific
commit that conflicts, so you are answering "how does _this_ change interact
with what landed on develop", not "reconcile these two trees somehow".

**3. CI tests what will actually ship.** After a rebase your branch is
literally `develop` + your commits, so a green pipeline means green after
merge. With a merge-based branch, CI tested a tree that never exists again once
the PR is squashed.

Add to that the smaller ones: no `Merge branch 'develop' into feature/...`
commits recording _when you happened to sync_, and `git log` on the branch
reads as the story of the feature.

**When merge is the right call instead:** if someone else has commits on your
branch, or has based their branch on yours. Then rewriting hashes hurts them,
and a merge is correct — see the hard rule below.

### The one hard rule about rebase

**Never rebase a branch someone else has based work on.** Rebasing rewrites
commit hashes; anyone who pulled the old commits now has a divergent history.

In practice: rebase your own feature branch freely, never rebase `develop` or
`main`.

After rebasing a branch you already pushed, the push must be forced — and it
must be **`--force-with-lease`**:

```sh
git push --force-with-lease
```

Plain `--force` overwrites whatever is on the remote, including a colleague's
commit pushed while you were rebasing. `--force-with-lease` refuses if the
remote moved since your last fetch. There is no situation in this repo that
calls for plain `--force`.

---

## Opening a PR

```sh
pnpm pr            # runs checks, pushes, opens the PR
pnpm pr --draft
```

`scripts/open-pr.sh` runs `lint`, `typecheck`, `test` and `ai:map`, pushes with
`--force-with-lease`, and opens the PR with the title derived from the branch
name and the template as the body. It also warns when the diff is over the size
limit.

The remaining work is genuinely yours: **what to build, QA, and review.**

### The title is the commit message

Because PRs into `develop` are squash-merged, **GitHub uses the PR title as the
squash commit subject**, appending ` (#123)`. The PR title is therefore a
permanent commit on `develop` and must satisfy the same rules commitlint applies
to everything else.

```
branch:  feature/LARK-66-create-metronome-page
title:   feat(web): create metronome page
lands:   feat(web): create metronome page (#66)
```

`.github/workflows/pr-title.yml` derives it automatically. The type comes from
the branch prefix (`feature` → `feat`, `redesign` → `style`, …). The **scope is
inferred from the paths the PR touches** — a PR confined to `apps/web/` gets
`web`, one spanning several areas gets `packages`. Documentation-only and CI
files do not decide the scope of a code change.

The workflow will not overwrite a hand-written title that already satisfies
Conventional Commits — the slug is a fallback, and a human description is
usually better. It fails the check if the final title is not a valid commit
subject.

**Why the issue number is not in the title.** A title like
`feat: create metronome page, LARK-66 #66` would squash into
`… LARK-66 #66 (#66)` — the number three times — and would fail commitlint on
length and format. It goes in the body instead, as `Closes #66`, which the
workflow appends if missing. GitHub renders the PR number beside the title
anyway, so repeating it adds nothing.

### Filling in the body

The template asks for three things a diff cannot say: **what and why**,
**reviewer focus**, and **how to QA it**. Everything else is a checklist
mirroring the Definition of done.

Claude can fill it from the real diff:

> fill in the PR description from the diff

It will read `git diff origin/develop...HEAD`, write the summary, tick only the
boxes the diff actually supports, and list under **Not applicable** the steps it
judged irrelevant with a reason. An unchecked box with a one-line reason is
information; a ticked box that is not true is a lie the reviewer will act on.

---

## Merging a PR: squash

**Squash merge is the default for every PR into `develop`.**

Rationale, given this repo's history: a typical feature branch here carries
5–15 commits, several of which are `fix: test` or `fix: according to comments`.
Squashing turns that into one commit on `develop` whose message describes the
feature. The intermediate history stays in the PR, permanently, if anyone needs
it.

Consequences worth knowing:

- `git log develop --oneline` becomes a readable changelog.
- `git bisect` gets one commit per feature — each independently buildable and
  testable. With merge commits, bisect lands on `fix: test` and tells you
  nothing.
- `git revert` of a whole feature is one command.

**The squash commit message is written by hand**, not left as GitHub's default
list of branch commits:

```
feat(web): add repertoire filtering and sorting

Status filters, "only mine" toggle, column sorting, and counts. Filter
state lives in the URL so it survives reload and can be shared.

Closes #63
```

**Exception — `develop` → `main`.** Release merges use a **merge commit**, not
squash. There the individual feature commits are exactly what you want to
preserve; squashing a release would collapse a month of work into one line.

| Merge                        | Strategy                                                   |
| ---------------------------- | ---------------------------------------------------------- |
| feature branch → `develop`   | **Squash**                                                 |
| `develop` → `main` (release) | **Merge commit**                                           |
| hotfix → `main`              | **Squash**, then cherry-pick or rebase back onto `develop` |

Turn off "Allow merge commits" and "Allow rebase merging" for PRs into
`develop` in the repo settings, so the rule is enforced rather than remembered.

### The one branch that was merged, not squashed

`chore/CLEF-188-ai-docs-and-git-conventions` (PR #68) is a deliberate
exception, recorded here so nobody treats it as precedent.

It grew to **36 commits, 176 files, +7385 / −1547** — eight times the size
limit stated above — because the tooling it introduced kept revealing the next
thing to fix. It carries the AI documentation, these git conventions, husky and
commitlint, the ESLint rule set, the coverage ratchet, an integration-test
harness, a schema change, and the local-dev fixes that fell out of testing all
of it.

Squashing it would have collapsed 36 individually atomic, individually
described commits into a single 7000-line entry, destroying exactly the
history this document exists to protect. It was merged with a merge commit
instead.

**This is not a template.** The branch is the bootstrap that introduced the
rules; every branch after it is expected to hold to them. When a branch starts
sprawling like this one did, the answer is to open the PR early and start a new
branch — not to keep appending until the diff is unreviewable.

---

## Releasing: `develop` → `main`

**`main` is production.** A push to it triggers `deploy.yml` and Vercel ships.
Everything below follows from that one fact.

### Only `develop` may merge into `main`

This is the rule that is currently broken most often. Of the last seven merges
into `main`, five came straight from feature branches (`#56`, `#52`, `#51`,
`#50`, `#48`) and only two from `develop` (`#57`, `#47`).

The cost shows up in the history: `main` and `develop` drift apart, and someone
has to merge `main` **back** into `develop` to reconcile them — there is such a
commit in this repo already. Once that starts, neither branch is a reliable
base for the other.

```
✅ feature/LARK-123-x → develop → main
❌ feature/LARK-123-x → main
```

The only exception is a hotfix — see below.

### How often

There is no correct interval; there is a correct **trigger**. Ship when a
user-visible slice is coherent and green, not on a calendar.

| Phase            | Cadence                                | Why                                                                                   |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------- |
| Pre-launch (now) | when a slice is done, roughly weekly   | Nobody is depending on the schedule. Batching a month makes each release scary.       |
| After launch     | fixed weekly slot + hotfixes as needed | Predictability matters more than speed; a known window lets you avoid Friday deploys. |

Recent history is roughly this already: 2026-07-09, 07-12, 07-31, 08-03 — a
few times a month, irregular. That is fine for the current phase. What is
missing is not frequency but the two things below.

**Never release with a red `develop`.** `main` should only ever receive commits
that already passed CI on `develop`.

### Every release gets a tag

Without tags you cannot answer "what was live last Tuesday", and rollback means
hunting through merge commits.

```sh
git checkout main && git merge --no-ff develop
git tag -a v0.4.0 -m "Repertoire filtering, pagination, i18n"
git push origin main --follow-tags
```

Semantic versioning while pre-1.0: bump the minor for features, the patch for
fixes. `v1.0.0` when the product is publicly launched.

### Hotfixes

A production bug does not wait for `develop` to be releasable.

```sh
git checkout -b fix/LARK-<issue>-slug main   # branch off MAIN, not develop
# fix + test
# PR into main, squash merge, tag v0.4.1
git checkout develop && git merge main    # merge back immediately
```

**Merging back into `develop` is not optional.** Skip it and the next release
silently reverts the hotfix — the classic git-flow failure.

### The branching model is decided — two branches

`develop` is the integration branch. **Every change goes into `develop` first,
without exception.** `main` receives commits from `develop` and from nowhere
else. Recorded in [ADR 0004](../adr/0004-two-branch-model.md).

```
feature/LARK-70-x ─┐
fix/LARK-75-y     ─┼─→ develop ─→ main ─→ Vercel (production)
chore/LARK-80-z   ─┘   (squash)   (merge commit + tag)
```

Enforce it in GitHub settings rather than relying on memory:

**Branch protection on `main`**

- Require a pull request before merging.
- **Restrict who can push** — or, simpler and stricter: a required status check
  that fails when the PR head is not `develop`.
- Require status checks: `ci`.
- Block force pushes and deletion.

**Branch protection on `develop`**

- Require a pull request before merging.
- Require status checks: `ci`.
- Allow squash merging only (turn off merge commits and rebase merging).
- Block force pushes and deletion.

The "PR into `main` must come from `develop`" check:

```yaml
# .github/workflows/guard-main.yml
name: Guard main
on:
  pull_request:
    branches: [main]
jobs:
  source-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Only develop may target main
        if: github.head_ref != 'develop' && !startsWith(github.head_ref, 'fix/hotfix-')
        run: |
          echo "PRs into main must come from develop (or a hotfix/ branch)."
          echo "This PR is from '${{ github.head_ref }}'."
          exit 1
```

---

## Before you push

```sh
pnpm typecheck && pnpm lint && pnpm test
```

The pre-commit hook (see `docs/REFACTORING-PLAN.md`, section 0.3) runs
`eslint --fix` and `prettier --write` on staged files, so formatting never
reaches review. It deliberately does **not** run the test suite — a hook slower
than about five seconds trains people to use `--no-verify`, and then it
protects nothing.

`--no-verify` is not forbidden, but CI runs the same checks plus tests, so
using it only delays the failure.

---

## Enforcement

Rules that are only written down get broken. These should be machine-checked:

**commitlint** — validates the message on the `commit-msg` hook:

```sh
pnpm add -Dw @commitlint/cli @commitlint/config-conventional
echo 'pnpm exec commitlint --edit $1' > .husky/commit-msg
```

`commitlint.config.mjs`:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-enum': [
      2,
      'always',
      ['web', 'api', 'packages', 'types', 'db', 'ui', 'config', 'docs', 'ci'],
    ],
    'subject-min-length': [2, 'always', 15],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 72],
  },
};
```

`subject-min-length: 15` alone would have rejected `fix: test`,
`fix: ci issues` and `fix: broken path`.

**Branch name** — a `pre-push` hook:

```sh
branch=$(git rev-parse --abbrev-ref HEAD)
# CLEF and SCRUM stay accepted so branches predating the move to GitHub
# Issues can still be pushed; new work uses LARK.
echo "$branch" | grep -qE '^(feature|fix|chore|refactor|docs|redesign)/(LARK|CLEF|SCRUM)-[0-9]+-[a-z0-9-]+$' || {
  echo "Branch name must be <type>/(LARK|CLEF|SCRUM)-<issue>-<slug>, got: $branch"
  exit 1
}
```

**Commit size** — a warning, not a block, since legitimate exceptions exist:

```sh
files=$(git diff --cached --name-only | grep -vE '(pnpm-lock.yaml|prisma/migrations/|docs/ai/MAP.md)' | wc -l)
[ "$files" -gt 20 ] && echo "⚠  $files files in one commit (limit 20) — consider splitting."
```

**GitHub settings** to match:

- `main` and `develop`: require a PR, require status checks (`ci`), require
  branches to be up to date before merging.
- Allow squash merging only (for `develop`).
- Automatically delete head branches after merge — the repo currently has 40+
  stale `feature/` branches.

---

## Housekeeping

The branch list currently holds 40 `feature/` branches, most of them merged.
Delete them:

```sh
git fetch --prune
git branch --merged develop | grep -vE '^\*|develop|main' | xargs -r git branch -d
```

Enabling "Automatically delete head branches" in the repo settings prevents
this from building up again.

There is no `.gitattributes`. Add one so generated files do not distort diffs
and language stats:

```gitattributes
* text=auto eol=lf
pnpm-lock.yaml            -diff linguist-generated
packages/db/generated/**  -diff linguist-generated
docs/ai/MAP.md            -diff linguist-generated
*.png binary
*.svg -text
```

`-diff` collapses these in PR views, so a lockfile change no longer buries the
five lines that matter.
