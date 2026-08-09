# Repertoire filtering & sorting

> Narrow a band's repertoire by track status or your own involvement, and sort
> by any column — with the whole view captured in the URL.

**Status:** Shipped
**Added:** 2026-08
**Code:** `apps/web/src/components/repertoire/`, `apps/api/src/repertoire/`

---

## Behaviour

A filter bar sits between the repertoire header and the track table.

**Status filters** (pick one): All · Ready · Learning · New. Each is styled in
its status colour when active.

**Activity filters** (pick one, shares state with the above): Active · Archive.
Both show a live count. "Active" means everything not archived.

**Only mine** — a toggle with a star icon and a count, showing tracks you play
on. Visible only when a real band is selected, since it's meaningless on Solo
(everything is yours) and on All Repertoires (which is already filtered to you).

**Band page link** — jumps to `/band/<id>` for the selected tab. Shown for both
real bands and Solo.

**My participation legend** — a green swatch explaining the row highlight.
Real bands only.

Vertical separators divide the three groups: status filters │ activity filters
│ only-mine.

### Sorting

Clicking a column header sorts by it; clicking again reverses. Sortable: `#`
(track order), Title, BPM, Status, Time.

The `#` column is only sortable when a specific band is selected. Under "All
Repertoires" the numbers are display indices across several bands, not a real
per-band ordering, so sorting by them would be meaningless.

### Row highlighting

Tracks you participate in — as lead **or** as a listed performer — get a green
left border, a tinted background, and a star. Under "All Repertoires" every row
is yours by definition, so all rows are highlighted.

### Performer names

Each row lists everyone who plays on the track, comma-separated under the
title.

**Your own name comes first** when you participate in the track, so you can
scan the column for yourself rather than reading every row. On tracks you don't
play on, the list follows API order — lead, then the other performers.

**The lead's name is in the accent colour**, but only when the track has more
than one performer. On a one-person track the highlight would be marking the
only name there, which says nothing.

The list truncates to one line with an ellipsis rather than wrapping, so row
height stays uniform however many people play on a track. It truncates as a
whole string — `"Solomiia, Anna, Ja…"` — not per name.

Under "All Repertoires" the names are replaced by the band name and vinyl
colour on narrow screens — band context matters more than personnel when you're
looking across every repertoire at once.

### Empty states

| Situation | Shown |
| --- | --- |
| Repertoire has no tracks at all | "Repertoire is empty" + New Track button |
| Filters match nothing, `onlyMine` on | "You are not involved yet" + Reset |
| Filters match nothing, `onlyMine` off | "No tracks match" + Reset |
| Band has no tracks, no filters applied | "Nothing here yet", no Reset |

Reset clears `status` and `onlyMine`, leaving sort and band selection intact.

None of these appear while a fetch is in flight — an empty state is an answer,
not a loading state.

### Loading

| Situation | Shown |
| --- | --- |
| First load, nothing cached | Skeleton rows matching the column grid |
| Filter or sort change, rows already on screen | Previous rows at 40%, spinner over them, height held steady |

The column header stays put throughout, so the sort controls never move under
the pointer.

## URL state

| Param | Values | Default | Meaning |
| --- | --- | --- | --- |
| `band` | band id \| `solo` \| absent | absent = All Repertoires | Selected tab |
| `status` | `all` \| `ready` \| `learning` \| `new` \| `active` \| `archived` | `all` | Status filter |
| `onlyMine` | `true` | absent | Restrict to your tracks |
| `sort` | `trackOrder` \| `title` \| `bpm` \| `status` \| `time` | `trackOrder` | Sort field |
| `order` | `asc` \| `desc` | `asc` | Sort direction |

Defaults are omitted from the URL rather than written explicitly, so a clean
view has a clean address.

```text
/repertoire?band=band-quiet-yard&status=ready&onlyMine=true&sort=bpm&order=desc
```

## API

All params pass straight through to the backend. See
[Repertoire API](../architecture/api-repertoire.md).

| Method | Endpoint | Used for |
| --- | --- | --- |
| GET | `/api/users/me/repertoire` | All Repertoires tab |
| GET | `/api/users/me/repertoire/solo` | Solo tab |
| GET | `/api/bands/:id/repertoire` | A specific band tab |

## Implementation notes

**Filtering and sorting are server-side.** The frontend never sorts a fetched
array — every param is a query param. Pagination is handled the same way: `page`
and `pageSize` are forwarded as query params and the table reads the envelope.
See [repertoire pagination](./repertoire-pagination.md) and
[ADR 0001](../adr/0001-server-side-sorting-and-filtering.md).

**Counts come from a second, unfiltered query.** `RepertoireFilterBar` calls
`useRepertoireTracks(activeBandId)` with no params so the badges keep showing
totals for the whole band while a filter is applied. React Query dedupes it
against the table's own request when the params happen to match.

**`isRealBand` vs `isSpecificBandSelected`.** Solo is a pseudo-band with id
`'solo'`, so `isSpecificBandSelected` is true for it. Anything that only makes
sense for a genuine band — "Only mine", the participation legend — must use
`isRealBand`, which additionally excludes Solo. The page link deliberately uses
the looser check, since Solo has a page too.

**No data flash or layout jump on param change.** Three things cooperate:

- React Query's `keepPreviousData` keeps the outgoing rows mounted, so there's
  always something to look at.
- `useLockedHeight()` measures the rows container as the fetch starts and holds
  that as a `min-height` floor until it finishes, so a result with fewer rows
  can't collapse the page under the pointer.
- The old rows fade to 40% with a spinner over them, anchored `sticky` so it
  stays visible on a list taller than the viewport.

The column header never unmounts — only the rows swap — which keeps the sort
controls in a fixed position throughout.

**The empty state waits for the fetch to settle.** `isEmptyResult` is
`tracks.length === 0 && !isFetching`; without the second clause the "No tracks
match" card flashes on every filter change that momentarily has no data.

**First load shows a skeleton, refetches don't.** `TrackListSkeleton` mirrors
the row grid so the placeholder columns line up with the real ones. It only
renders when there's nothing cached — once rows exist, replacing them with
skeletons would read as "starting over" rather than "updating".

**Participation means lead OR performer.** Both the backend `participatesIn()`
predicate and the frontend's `isMyTrack` check `leadMember.id` *and*
`members[]`. Checking only one is the bug this feature shipped with initially —
the "Only mine" count showed the total because `t.leadMember` is always truthy.

**Performer ordering lives in a utility, not the row.** `getTrackPerformers()`
(`src/utils/track-performers.utils.ts`) merges `leadMember` with `members`,
de-duplicates, and hoists the current user — so the row component only renders.
The API deliberately keeps the lead out of `members`
([ADR 0002](../adr/0002-track-performers-model.md)); every consumer that wants
"everyone on this track" should go through this helper rather than
re-implementing the merge.

## Edge cases

- **Solo tab:** "Only mine" and the participation legend are hidden — every
  solo track is yours. The page link stays.
- **All Repertoires:** the `#` column isn't sortable; every row is highlighted.
- **Filters combine:** `status` and `onlyMine` are ANDed. Status filters are
  mutually exclusive — picking Ready replaces Archive.
- **Empty band:** the whole header and table are replaced by the empty state,
  so the filter bar never appears with nothing to filter.

## Tests

- Unit — `apps/api/src/repertoire/repertoire.service.spec.ts`
- Unit — `apps/web/src/utils/track-performers.utils.test.ts`
- Unit — `apps/web/src/components/repertoire/TracksTable/TrackPerformerNames/TrackPerformerNames.test.tsx`
- Unit — `apps/web/src/hooks/useLockedHeight/useLockedHeight.test.ts`
- E2E — `apps/web/e2e/repertoire-filtering.spec.ts`

## Related

- [ADR 0001 — Server-side sorting and filtering](../adr/0001-server-side-sorting-and-filtering.md)
- [ADR 0002 — Track performers model](../adr/0002-track-performers-model.md)
- [Repertoire API](../architecture/api-repertoire.md)
