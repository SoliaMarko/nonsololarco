# <Feature name>

> One sentence: what a user can do that they couldn't before.

**Status:** In progress | Shipped
**Added:** YYYY-MM
**Code:** `apps/web/src/...`, `apps/api/src/...`

---

## Behaviour

What the user sees and can do. Written from the outside in — no implementation
detail here.

## URL state

If the feature reads or writes query params:

| Param | Values | Default | Meaning |
| --- | --- | --- | --- |
| `example` | `a` \| `b` | `a` | What it controls |

## API

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/...` | |

## Implementation notes

Only what isn't obvious from reading the code — a constraint, a trade-off, a
gotcha someone would otherwise hit.

## Edge cases

- Empty state: ...
- Permissions: ...
- Combination with other filters: ...

## Tests

- Unit: `path/to/file.test.ts`
- E2E: `apps/web/e2e/feature.spec.ts`

## Related

- ADR: [NNNN — Title](../adr/NNNN-slug.md)
