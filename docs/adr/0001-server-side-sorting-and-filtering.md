# 0001 — Server-side sorting and filtering

**Status:** Accepted
**Date:** 2026-08-04

## Context

The repertoire table needed sortable column headers and a filter bar. The
headers already wrote `?sort=` and `?order=` to the URL; nothing consumed them.

The first implementation sorted the fetched array in the browser. It worked and
was about fifteen lines. But the repertoire is expected to grow — a working band
accumulates hundreds of tracks — and pagination is on the roadmap. Client-side
sorting silently breaks the moment a response stops containing every row: you'd
be sorting page 1, not the repertoire.

## Decision

All sorting and filtering happens on the server. The frontend reads params from
the URL, passes them to the API, and renders the response in the order it
arrives. It never reorders or filters a fetched array.

Params are validated by `RepertoireQueryDto` with `class-validator` enums, so
an unknown `sort` value is a 400 rather than a silent fallback.

Two sorting paths inside the service:

- `trackOrder`, `title`, `bpm` → Prisma `orderBy`, executed in Postgres.
- `status`, `time` → sorted in memory after the query.

The second path exists because neither field sorts correctly in the database as
stored. `status` needs the domain order `new < learning < ready < archived`,
not alphabetical. `duration` is a `"m:ss"` string, and string comparison puts
`"10:00"` before `"9:00"`.

## Alternatives considered

### Client-side sorting

Simplest, instant feedback, no network round-trip. Rejected because it is
incompatible with pagination, and because retrofitting server-side sorting
later would mean rewriting the table, the hooks, and the API layer at a point
when there's more code depending on them. The cost of doing it right was a few
hours now versus a refactor later.

### Sort everything in Postgres

Would have avoided the in-memory pass. It needs a schema change: `status` to an
integer weight column (or a `CASE` in raw SQL, losing Prisma's type safety), and
`duration` to an integer of seconds with formatting moved to the API layer.

Rejected as premature. The in-memory sort is fine at current data volume and
the migration can happen when pagination actually lands — at which point it's
required anyway, and the shape of that requirement will be clearer.

### Store sort/filter state in React state instead of the URL

Less URL noise. Rejected: a filtered view wouldn't survive a refresh and
couldn't be shared or linked to. URL-as-state also means React Query's cache
key falls out naturally.

## Consequences

**Good**

- Pagination can be added without touching the table, the hooks, or the API
  layer.
- Filter and sort state is shareable, bookmarkable, and survives a refresh.
- Invalid params fail loudly at the DTO boundary.
- React Query caches per param combination for free.

**Bad / accepted cost**

- Every sort click is a network round-trip. Mitigated with `keepPreviousData`
  plus a dimmed overlay, so the table doesn't blank out.
- `postQuerySort` loads and sorts the full result set in memory for `status`
  and `time` sorts. This is correct with pagination (the slice happens after
  sorting) but O(n) per page request. Acceptable at current data volumes.
- Slightly more code across three layers than a single client-side `.sort()`.

**Follow-up needed**

- Migrate `status` and `duration` to sortable column types (integer weight,
  seconds) and delete `postQuerySort` once repertoire sizes make the full-set
  load a performance concern.
