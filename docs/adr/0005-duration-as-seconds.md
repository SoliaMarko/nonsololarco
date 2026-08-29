# 0005 — Track length stored as integer seconds

**Status:** Accepted
**Date:** 2026-08-16

## Context

`Track.duration` was a `String` holding the `"m:ss"` text a track is displayed
as — `"3:10"`, `"4:00"`.

Postgres cannot order that column meaningfully. Lexicographic comparison puts
`"10:00"` before `"9:00"`, so `ORDER BY duration` produces a wrong list rather
than a differently-sorted one. The service worked around it by loading **every
matching row**, parsing each string into seconds, sorting in memory, and only
then slicing the requested page:

```ts
if (sort === TrackSortField.TIME) {
  return [...tracks].sort((a, b) => (parseDuration(a.duration) - parseDuration(b.duration)) * dir);
}
```

Three costs followed from that:

1. **Pagination stopped being pagination.** Requesting page 3 of a time-sorted
   repertoire still read the whole table plus three joins. Cost grew linearly
   with repertoire size while the response stayed the same size.
2. **The format was load-bearing.** `parseDuration` returned `0` for anything
   not matching `m:ss`, so a malformed row sorted first and silently.
3. **The same parsing existed three times** — in the API service, in the API's
   `duration.util.ts`, and in the web `duration.utils.ts` — with slightly
   different edge-case handling in each.

The existing `TODO` in `repertoire.service.ts` already identified the fix.

## Decision

**`Track.duration: String` becomes `Track.durationSeconds: Int`**, mapped to
the `duration_seconds` column.

The API returns raw seconds. **Formatting belongs to the client**, via
`formatTrackDuration(seconds)` in `apps/web/src/utils/duration.utils.ts`, which
renders `190` as `"3:10"`.

Aggregates the server computes — a band's total repertoire length — stay
server-side and keep returning a formatted string, since that is a display
value the client has no better source for.

`TrackSortField.TIME` now maps to `orderBy: { durationSeconds: dir }`. The
in-memory sort path survives only for `status`.

## Alternatives considered

### Option B — Keep the string, add a sortable shadow column

Store `duration` for display and `durationSeconds` alongside it for ordering.

Rejected because two columns describing the same fact will disagree eventually.
Any write path that updates one and forgets the other produces a track that
displays as 3:10 and sorts as 4:00, and nothing would catch it — there is no
constraint that can express "these two agree".

### Option C — Keep the string and sort with a SQL expression

`ORDER BY split_part(duration, ':', 1)::int * 60 + split_part(duration, ':', 2)::int`.

Rejected on two grounds. It cannot use an index, so it degrades exactly where
it matters. And it makes the string format a database-level contract: one row
written as `"3:5"` or `"03:10"` turns a sort into a runtime cast error.

### Option D — Store an interval

Postgres has a native `interval` type.

Rejected as more than the problem needs. Prisma's support for `interval` is
awkward, it serialises to JSON inconsistently, and a track length is a plain
count of seconds with no calendar semantics.

## Consequences

**Good**

- Sorting by time is now `ORDER BY duration_seconds` with `LIMIT/OFFSET` — the
  database does the work and pagination reads one page.
- One less parser. `parseDuration` and `sumDurations` are gone from the API,
  `parseRawDuration` and `sumRawDurations` from the web.
- An integer column cannot hold a malformed value, so the "invalid string
  sorts as 0" failure mode is structurally impossible.
- Display format is now a frontend decision. Showing `"3 min 10 s"` in a
  different locale no longer requires a migration.

**Bad / accepted cost**

- A breaking API change: `Track.duration: string` → `Track.durationSeconds:
number`. Acceptable because the API has no external consumers.
- Sub-second precision is not representable. Track lengths do not need it.
- Every mock, fixture and seed row had to be converted. Done mechanically, and
  the integration tests assert the real order, so a bad conversion fails
  visibly.

**Follow-up needed**

- `status` remains the last in-memory sort. Giving it a sortable representation
  removes the `postQuerySort` path entirely — `docs/REFACTORING-PLAN.md` §4.2.

## Migration

`20260816200000_duration_to_seconds` does it in one transaction: add the
nullable column, backfill with a `SPLIT_PART` cast guarded by a regex, set
`NOT NULL`, drop the old column. Rows not matching `^[0-9]+:[0-5][0-9]$`
backfill to `0` rather than aborting.

A single transactional migration rather than the three-deploy expand/contract
dance, because there is one API instance and a deploy replaces it — no window
exists in which old code reads a column the new schema has dropped. If a
second instance or rolling deploys are ever introduced, this migration is the
pattern **not** to copy.
