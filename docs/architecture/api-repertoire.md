# Repertoire API

All routes are prefixed `/api` and require a valid JWT (`JwtAuthGuard`).
Routes under `/bands/:id/` additionally require membership of that band
(`BandMembershipGuard`) — see [Authorisation](#authorisation).
Interactive Swagger UI: `http://localhost:3001/api/docs`.

Code: `apps/api/src/repertoire/`.

## Endpoints

| Method | Endpoint                        | Returns                                                                                   |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/users/me/repertoire`      | Every track the current user participates in, across all bands and solo. Includes `band`. |
| GET    | `/api/users/me/repertoire/solo` | Solo tracks only (`bandId = null`) where the user is lead. No `band` field.               |
| GET    | `/api/bands/:id/repertoire`     | All tracks for one band. No `band` field — it's implied. Members only; 403 otherwise.     |
| GET    | `/api/users/me/bands`           | The user's bands with aggregate stats (`totalTracks`, `readyTracks`, `totalDuration`).    |

"Participates in" means **lead member OR listed performer** — see
[data model](./data-model.md#trackperformer).

## Authorisation

Two guards, in this order:

| Guard                 | Answers                          | Failure            |
| --------------------- | -------------------------------- | ------------------ |
| `JwtAuthGuard`        | Is this a real, signed-in user?  | `401 UNAUTHORIZED` |
| `BandMembershipGuard` | May this user see **this band**? | `403 FORBIDDEN`    |

`/api/users/me/*` routes are scoped to the caller by construction and need only
the first. Anything under `/api/bands/:id/` needs both.

**A non-member and an unknown band both get `403`, deliberately.** Answering
`404` for a band that does not exist would let any authenticated caller probe
which ids are real, one request at a time. A non-member is entitled to learn
nothing about a band — including whether it exists — so both cases return the
same response.

That is a change from the earlier behaviour, where `GET /api/bands/:id/repertoire`
returned `404` for an unknown band and `200` for every band that existed,
member or not.

The guard reads the band id from either `:bandId` or `:id`, so a future route
cannot skip the check by naming its param differently. Authorisation lives on
the controller rather than in the service: put it in the service and every new
caller has to remember it.

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

- **`trackOrder`, `title`, `bpm`, `time`** — Prisma `orderBy`, done in
  Postgres. `time` orders by the integer `durationSeconds` column.
- **`status`** — sorted in memory after the query, because the Postgres enum
  orders alphabetically (`archived, learning, new, ready`) while the meaningful
  order is `new < learning < ready < archived`.

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
  durationSeconds: number; // 190 renders as "3:10"
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

## Error responses

Every error from any endpoint has the same body, produced by
`AllExceptionsFilter` (`apps/api/src/common/filters/`) and registered globally
in `main.ts`.

```jsonc
{ "code": "VALIDATION_FAILED", "message": "Track title is required", "details": {} }
```

- **`code`** is machine-readable and stable. The client maps it to a translated
  string.
- **`message`** is English, written for logs and developers. **Never render it
  to a user** — it is not translated and may describe internals.
- **`details`** carries structured extras when there are any: the failing field
  names from validation, or the columns involved in a constraint violation.
  Otherwise `{}`.

| Code                   | Status | Raised by                                                 |
| ---------------------- | ------ | --------------------------------------------------------- |
| `VALIDATION_FAILED`    | 400    | DTO validation                                            |
| `UNAUTHORIZED`         | 401    | Missing or invalid JWT                                    |
| `FORBIDDEN`            | 403    | Authenticated but not permitted on this resource          |
| `NOT_FOUND`            | 404    | Unknown id, or an update matching no rows                 |
| `CONFLICT`             | 409    | Unique constraint, or a foreign key constraint            |
| `DATABASE_UNAVAILABLE` | 503    | Postgres unreachable, refusing credentials, or timing out |
| `INTERNAL_ERROR`       | 500    | Anything else. The stack trace is logged, never returned  |

A foreign key failure (`P2003`) is reported as a conflict with a deliberately
neutral message. Prisma does not say which direction failed — an insert naming
a parent that is absent, or a delete blocked by a child that still exists.
`Track.leadMember` is a required relation defaulting to `Restrict`, so deleting
a user who leads a track raises the same code; claiming "referenced record does
not exist" would send the caller looking for a missing row that is in fact
still there.

`DATABASE_UNAVAILABLE` exists as its own code deliberately. It is the one
server-side failure a user can sometimes wait out and an operator can fix
without a deploy, so it deserves different UI from a genuine bug. It covers the
Prisma connection codes `P1000`, `P1001`, `P1002`, `P1008` and `P1017`.

**Validation failures put the field messages in `details.fields`:**

```jsonc
{
  "code": "VALIDATION_FAILED",
  "message": "Bad Request",
  "details": { "fields": ["title should not be empty", "bpm must not be less than 20"] },
}
```

### Logging

The filter logs 5xx at `error` with the full stack, and 4xx at `warn` on one
line. A malformed request is routine and would drown the log at error level; a
500 means the server broke and the stack is the point.

The response never carries the stack or the original exception message for a
500 — a body leaking internals is a disclosure bug.
