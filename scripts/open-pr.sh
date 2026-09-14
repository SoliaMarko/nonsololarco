#!/usr/bin/env bash
#
# Opens a PR from the current branch into develop, with the title derived from
# the branch name and the checks already run.
#
# The point is that the author's remaining job is deciding WHAT to build,
# QA-ing it, and reviewing — not assembling the PR.
#
# Usage:
#   pnpm pr            open the PR (runs checks first)
#   pnpm pr --draft    open as a draft
#   pnpm pr --skip-checks
#
# Requires the GitHub CLI: https://cli.github.com  (`gh auth login` once)

set -euo pipefail

DRAFT=""
SKIP_CHECKS=""
for arg in "$@"; do
  case "$arg" in
    --draft) DRAFT="--draft" ;;
    --skip-checks) SKIP_CHECKS="1" ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

command -v gh >/dev/null || { echo "gh is not installed: https://cli.github.com" >&2; exit 1; }

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
BASE="develop"

case "$BRANCH" in
  main|develop)
    echo "You are on '$BRANCH'. Create a feature branch first." >&2
    exit 1
    ;;
esac

# feature/LARK-70-api-error-contract → type / issue / slug
if [[ ! "$BRANCH" =~ ^([a-z]+)/([A-Z]+-[0-9]+)-(.+)$ ]]; then
  echo "Branch '$BRANCH' does not match <type>/<TICKET>-<slug>." >&2
  echo "Example: feature/LARK-70-api-error-contract" >&2
  exit 1
fi
TYPE="${BASH_REMATCH[1]}"
TICKET="${BASH_REMATCH[2]}"
SLUG="${BASH_REMATCH[3]}"

# Branch prefixes are words; commit types are the short forms.
case "$TYPE" in
  feature|feat)     COMMIT_TYPE="feat" ;;
  fix|bugfix|hotfix) COMMIT_TYPE="fix" ;;
  refactor)         COMMIT_TYPE="refactor" ;;
  docs)             COMMIT_TYPE="docs" ;;
  test)             COMMIT_TYPE="test" ;;
  ci)               COMMIT_TYPE="ci" ;;
  redesign)         COMMIT_TYPE="style" ;;
  perf)             COMMIT_TYPE="perf" ;;
  *)                COMMIT_TYPE="chore" ;;
esac

# Infer the scope from the paths this branch actually touches.
git fetch --quiet origin "$BASE"
CHANGED="$(git diff --name-only "origin/$BASE...HEAD")"
[ -n "$CHANGED" ] || { echo "No changes against origin/$BASE." >&2; exit 1; }

area_of() {
  case "$1" in
    apps/web/*)       echo web ;;
    apps/api/*)       echo api ;;
    packages/db/*)    echo db ;;
    packages/types/*) echo types ;;
    packages/ui/*)    echo ui ;;
    packages/*)       echo packages ;;
    docs/*)           echo docs ;;
    .github/*)        echo ci ;;
    *)                echo config ;;
  esac
}

AREAS="$(while IFS= read -r f; do area_of "$f"; done <<< "$CHANGED" | sort -u)"
CODE_AREAS="$(grep -vE '^(docs|ci|config)$' <<< "$AREAS" || true)"
POOL="${CODE_AREAS:-$AREAS}"
SCOPE="$([ "$(wc -l <<< "$POOL")" -eq 1 ] && echo "$POOL" || echo packages)"

TITLE="$COMMIT_TYPE($SCOPE): ${SLUG//-/ }"

# Size check — the same limits as docs/ai/GIT.md.
FILE_COUNT="$(grep -cvE '(pnpm-lock\.yaml|packages/db/prisma/migrations/|packages/db/generated/|docs/.*\.md)' <<< "$CHANGED" || true)"
LINE_COUNT="$(git diff --shortstat "origin/$BASE...HEAD" | grep -oE '[0-9]+ (insertion|deletion)' | grep -oE '^[0-9]+' | paste -sd+ | bc || echo 0)"

echo "Branch : $BRANCH"
echo "Title  : $TITLE"
echo "Ticket : $TICKET"
echo "Size   : $FILE_COUNT files, ~$LINE_COUNT lines"
[ "$FILE_COUNT" -gt 20 ] && echo "  ⚠ over the 20-file limit — consider splitting"
[ "$LINE_COUNT" -gt 500 ] && echo "  ⚠ over the 500-line limit — consider splitting"
echo

if [ -z "$SKIP_CHECKS" ]; then
  echo "Running checks…"
  pnpm lint && pnpm typecheck && pnpm test && pnpm ai:map
  if ! git diff --quiet docs/ai/MAP.md 2>/dev/null; then
    echo "MAP.md changed — committing."
    git add docs/ai/MAP.md
    git commit -m "chore(docs): regenerate ai map"
  fi
  echo
fi

git push --force-with-lease --set-upstream origin "$BRANCH"

gh pr create \
  --base "$BASE" \
  --title "$TITLE" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md \
  ${DRAFT:+$DRAFT}

echo
echo "PR opened. Remaining work: fill in 'What and why', 'Reviewer focus' and QA."
echo "Ask Claude: \"fill in the PR description from the diff\"."
