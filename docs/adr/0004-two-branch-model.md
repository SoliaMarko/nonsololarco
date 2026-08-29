# 0004 — Two-branch model: `develop` integrates, `main` ships

**Status:** Accepted
**Date:** 2026-08-12

## Context

`main` is production: a push to it triggers `deploy.yml` and Vercel deploys.
`develop` was intended as the integration branch, but the rule was not enforced
and in practice was not followed.

Of the last seven merges into `main`, five came directly from feature branches
(PRs #56, #52, #51, #50, #48); only two came from `develop` (#57, #47). The
consequence is visible in the history as a `Merge branch 'main' into develop`
commit — the two branches had diverged far enough that `main` had to be merged
back to reconcile them.

That state is the worst of both worlds. It carries the overhead of maintaining
two long-lived branches while providing none of the integration safety they
exist for, because production regularly receives code that never passed through
the integration branch.

A decision was needed between two coherent models, rather than continuing with
an incoherent mix.

## Decision

**We keep two long-lived branches with a strict flow.**

- `develop` is the integration branch. Every feature, fix and chore branches
  off it and merges back into it via a squash-merged PR.
- `main` receives commits **only** from `develop`, via a merge commit, and every
  such merge is tagged.
- The single exception is a production hotfix, which branches off `main`, merges
  into `main`, and is immediately merged back into `develop`.

The rule is enforced by branch protection plus a `guard-main` workflow that
fails any PR into `main` whose head branch is neither `develop` nor a
`fix/hotfix-*` branch. Enforcement is part of the decision — the previous
version of this rule existed only as prose and was ignored.

## Alternatives considered

### Option B — Trunk-based development

One long-lived branch (`main`), short-lived feature branches, deploy on every
merge, feature flags for anything unfinished.

This was a serious contender, and arguably what the team was already doing by
accident. It removes branch drift entirely, eliminates the merge-back step
after hotfixes, and shortens the path from written to shipped.

Rejected because it moves the integration risk onto feature flags and onto
production itself. Every merge would deploy, so an incomplete feature must be
flag-guarded or it ships half-built. The project has no feature-flag
infrastructure, and building one is more work than maintaining a second branch.
Test coverage is also currently around 10%, so "the pipeline is green" is not
yet strong enough evidence that a merge is safe to ship — the integration branch
provides a place to catch that gap manually.

Worth revisiting once coverage is high and a flag mechanism exists.

### Option C — Full git-flow with `release/*` branches

Adds release branches where a version is stabilised while `develop` continues to
accept new work.

Rejected as clearly disproportionate. Release branches solve the problem of
stabilising a version over days or weeks while development continues in
parallel. Releases here take minutes and there is no parallel development
pressure. The extra branch type would be ceremony with no corresponding benefit.

## Consequences

**Good**

- Production only ever receives code that has sat on `develop` and passed CI
  there.
- `develop` and `main` cannot drift, so no reconciliation merges.
- A release is one reviewable diff (`develop` → `main`) rather than a scatter of
  feature merges.
- Tags on `main` give an answerable "what was live on date X" and a one-command
  rollback.

**Bad / accepted cost**

- Two merges per feature instead of one; a small, constant overhead.
- A feature finished right after a release waits for the next one, unless
  promoted deliberately.
- The hotfix path has a merge-back step that is easy to forget and silently
  reverts the fix on the next release. Mitigated by documenting it in
  `docs/ai/GIT.md`, but not enforced automatically — a candidate for a future
  workflow check.

**Follow-up needed**

- Enable branch protection on `main` and `develop` as described in
  `docs/ai/GIT.md`.
- Add `.github/workflows/guard-main.yml`.
- Turn off "Allow merge commits" and "Allow rebase merging" for `develop`.
- Tag the current state of `main` so future releases have a baseline.
