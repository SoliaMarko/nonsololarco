# Repertoire API

All routes are prefixed `/api` and require a valid JWT (`JwtAuthGuard`).
Interactive Swagger UI: `http://localhost:3001/api/docs`.

Code: `apps/api/src/repertoire/`.

## Endpoints

| Method | Endpoint                        | Returns                                                                                   |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/users/me/repertoire`      | Every track the current user participates in, across all bands and solo. Includes `band`. |
| GET    | `/api/users/me/repertoire/solo` | Solo tracks only (`bandId = null`) where the user is lead. No `band` field.               |
| GET    | `/api/bands/:id/repertoire`     | All tracks for one band. No `band` field — it's implied. 404 if the band doesn't exist.   |
| GET    | `/api/users/me/bands`           | The user's bands with aggregate stats (`totalTracks`, `readyTracks`, `totalDuration`).    |

"Participates in" means **lead member OR listed performer** — see
[data model](./data-model.md#trackperformer).

## Query parameters

Accepted by all three repertoire endpoints. Validated by `RepertoireQueryDto`
(`apps/api/src/repertoire/dto/sort-tracks.dto.ts`).

| Param      | Values                                                            | Default      | Effect                                                                            |
| ---------- | ----------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `sort`     | `trackOrder` \| `title` \| `bpm` \| `status` \| `time`            | `trackOrder` | Field to sort by                                                                  |
| `order`    | `asc` \| `desc`                                                   | `asc`        | Sort direction                                                                    |
| `status`   | `all` \| `ready` \| `learning` \| `new` \| `active` \| `archived` | `all`        | Status filter. `active` = everything except `archived`                            |
| `onlyMine` | `true` \| `false`                                                 | `false`      | Restrict to tracks the user participates in. Only meaningful on the band endpoint |
| `page`     | integer ≥ 1                                                       | absent       | 1-based page number. Omit for unpaginated (full) results                          |
| `pageSize` | integer ≥ 1                                                       | `10`         | Items per page. Only meaningful when `page` is set                                |

Example:

```http
GET /api/bands/band-quiet-yard/repertoire?status=ready&onlyMine=true&sort=bpm&order=desc
```

**Naming:** params are camelCase and name the thing they act on. `status`
rather than a generic `filter`; `onlyMine=true` rather than `mine=1`. Booleans
are spelled out.

## Sorting implementation

Two paths, chosen by field:

- **`trackOrder`, `title`, `bpm`** — Prisma `orderBy`, done in Postgres.
- **`status`, `time`** — sorted in memory after the query, because neither
  sorts correctly in the database. `status` needs a custom weight
  (`new < learning < ready < archived`, not alphabetical) and `duration` is a
  `"m:ss"` string that string-sorts wrong (`"10:00" < "9:00"`).

The in-memory pass is `postQuerySort()`. For paginated requests with a
post-query sort, the service loads the entire set, sorts it, and then slices
the requested page — so sorting is always across the full result set.

## Pagination

Pagination is opt-in. All three repertoire endpoints always return a
`PaginatedResult<Track>` envelope. Omitting `page` returns every matching track
as a single page (backward compatible — `page: 1`, `totalPages: 1`,
`pageSize: total`). The `/api/users/me/bands` endpoint returns band statistics
and is not paginated.

```ts
{
  data: Track[];       // items on the requested page
  page: number;        // 1-based page index
  pageSize: number;    // items per page (= total when unpaginated)
  total: number;       // total items across all pages
  totalPages: number;  // ceil(total / pageSize)
}
```

See [repertoire pagination feature doc](../features/repertoire-pagination.md)
for frontend integration details.

## Response shape

The three repertoire endpoints return `PaginatedResult<Track>`. The `Track`
shape inside `data`:

```ts
interface Track {
  band?: { id: string; name: string }; // only on /users/me/repertoire
  bpm: number;
  duration: string; // "m:ss"
  id: string;
  leadMember: { id: string; name: string };
  members: { id: string; name: string }[]; // performers, excluding the lead
  musicalKey: MusicalKey; // display form: "C#", "Am"
  order: number;
  side: 'a' | 'b';
  status: 'ready' | 'learning' | 'new' | 'archived';
  title: string;
}
```

Defined in `packages/types/src/repertoire/repertoire.types.ts` and imported by
both apps — change it there, not in a local copy.

`members` excludes the lead. To render "everyone on this track", use
`getTrackPerformers()` from `apps/web/src/utils/track-performers.utils.ts` — it
does the merge, drops a duplicate if the lead also appears in `members`, and
flags which entry is the lead. Don't spread `[leadMember, ...members]` by hand.

## Frontend integration

```text
RepertoireFilterBar  writes  ?status=&onlyMine=   to the URL
TracksTable          reads   the URL, calls useRepertoireTracks()
useRepertoireTracks  →       fetch* in lib/api/repertoire.api.ts
```

The URL is the single source of truth for filter and sort state — refreshing or
sharing a link reproduces the exact view. React Query caches per param
combination, with `keepPreviousData` so the table doesn't blank out while a new
sort loads.

The frontend never sorts or filters a fetched array. Every param goes to the
server. Pagination is handled the same way — `page` and `pageSize` are
forwarded as query params and the table reads the envelope.
