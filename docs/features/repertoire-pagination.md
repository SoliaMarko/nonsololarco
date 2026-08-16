# Repertoire pagination

> A user can page through a long repertoire ten tracks at a time instead of
> scrolling one giant list.

**Status:** Shipped
**Added:** 2026-08
**Code:** `apps/web/src/components/ui/Pagination/`,
`apps/web/src/components/repertoire/TracksTable/TracksTable.tsx`,
`apps/api/src/repertoire/`

---

## Behaviour

The tracks table shows at most `REPERTOIRE_PAGE_SIZE` (10) rows. When the
current list has more than one page, a retro numbered control —
`‹ 1 2 3 4 5 ›` — appears below the table. Clicking a number, or the prev/next
arrows, loads that page. The current page is highlighted; the arrows disable at
the first and last page.

The control stays a stable width on long lists by collapsing runs of pages into
an ellipsis while always showing the first, last, and the pages around the
current one.

Changing the status filter, "only mine", the sort column, or the band tab sends
the user back to page 1 — the old page number would point into a result set
that no longer exists.

The leftmost `#` column is a 1-based row number that continues across pages —
page 2 starts at 11 — on every tab, so the count never restarts mid-list.

## URL state

| Param  | Values      | Default           | Meaning                                |
| ------ | ----------- | ----------------- | -------------------------------------- |
| `page` | integer ≥ 1 | absent (= page 1) | Which page of the current list to show |

`page` is omitted from the URL when it would be `1`, keeping the default view's
link clean. It survives reloads and is shareable, like the other repertoire
params.

## API

| Method | Endpoint                        | Notes                       |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/api/users/me/repertoire`      | Accepts `page` / `pageSize` |
| GET    | `/api/users/me/repertoire/solo` | Accepts `page` / `pageSize` |
| GET    | `/api/bands/:id/repertoire`     | Accepts `page` / `pageSize` |

All three return a `PaginatedResult<Track>` envelope. Pagination is opt-in: omit
`page` to get every match as one page. Full detail in
[the API reference](../architecture/api-repertoire.md#pagination).

## Implementation notes

- **`Pagination` is presentational and stateless.** It takes `page`,
  `totalPages`, and `onPageChange`; `TracksTable` owns the page (from the URL)
  and writes it back. The component renders `null` for a single page, so it can
  be mounted unconditionally.
- **Two fetches, by design.** `TracksTable` requests a page; `RepertoireFilterBar`
  and the band-tab stats fetch the same list _without_ `page` to count the whole
  set (archived/active/mine badges, "N in group", tab totals). React Query keys
  differ by param, so these are separate cache entries.
- **Sorting and pagination interact.** `status` and `time` sort in memory across
  the whole set, so the service sorts first and slices the page after; the
  Prisma-sortable fields page in the database. See
  [ADR 0001](../adr/0001-server-side-sorting-and-filtering.md).

## Edge cases

- **Empty result:** `totalPages` is `1`, so the control hides and the empty-state
  card shows instead.
- **Page past the end** (e.g. a hand-edited URL): the API returns an empty
  `data` with the real `total`; navigating a filter/sort/band resets `page`.
- **Exactly one page:** no control rendered.

## Tests

- Unit: `apps/web/src/utils/pagination.utils.test.ts` (range/ellipsis logic),
  `apps/web/src/components/ui/Pagination/Pagination.test.tsx` (rendering,
  interaction, a11y), `apps/api/src/repertoire/repertoire.service.spec.ts`
  (skip/take, meta, in-memory slicing).
- E2E: `apps/web/e2e/repertoire-pagination.spec.ts`.

## Related

- [Repertoire filtering & sorting](./repertoire-filtering.md)
- [Repertoire API](../architecture/api-repertoire.md)
- ADR: [0001 — Server-side sorting and filtering](../adr/0001-server-side-sorting-and-filtering.md)
