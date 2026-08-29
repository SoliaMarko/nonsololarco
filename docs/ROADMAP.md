# Roadmap

What is being built now, and in what order.

> Scope decisions live in [`product/PRINCIPLES.md`](./product/PRINCIPLES.md) —
> this file is sequencing, not justification. Engineering debt and its ordering
> live in [`REFACTORING-PLAN.md`](./REFACTORING-PLAN.md).

---

## Shipped

Derived from what exists in the repository, not from memory.

| Area          | State                                                             |
| ------------- | ----------------------------------------------------------------- |
| Auth          | Google and GitHub OAuth, JWT, session guard                       |
| Repertoire    | List, status filters, "only mine", column sorting, pagination     |
| Bands         | Band list, band page, per-band repertoire, stats                  |
| Profile       | Hero, stats, repertoire section, achievements, bands, instruments |
| Metronome     | BPM control, tap tempo, time signatures, practice history         |
| i18n          | `en` / `it` / `uk`, URL-prefix routing, locale switcher           |
| Design system | 14 primitives, Storybook, two themes                              |

Pages that exist as routes but are not built out: `/chat`, `/notifications`,
`/calendar`, `/settings`. Each needs a decision — build, or record the cut in
`PRINCIPLES.md`.

## Designed but not built

`CLAUDE.md` already documents conventions for these, which means the shape has
been thought through and the implementation has not started. That gap is worth
closing deliberately rather than letting the conventions rot.

| Feature                       | Evidence it is planned                                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Setlists**                  | `SetlistItem` discriminated union, `/setlist/[id]` route, `PATCH /setlists/:id/items/:itemId/position`, fractional ordering |
| **Events / gigs**             | `/event/[id]` route, `PUT /events/:id/attendance`                                                                           |
| **Practice sessions**         | Idempotency keyed on `(userId, startedAt)`, practice statistics                                                             |
| **Invites**                   | `POST /invites/:token/accept` semantics                                                                                     |
| **Write endpoints generally** | [`RECIPE-endpoint.md`](./RECIPE-endpoint.md) — the whole app is currently read-only                                         |

**The largest single gap is that nothing writes yet.** Every endpoint is a
`GET`. Setlists, events and practice sessions all depend on the write path
existing first — which is why `RECIPE-endpoint.md` was written before any of
them.

## Suggested order

Sequencing rationale, to be confirmed:

1. **First write endpoint** — adding a track to a repertoire. Establishes the
   DTO, guard, optimistic-mutation and error-contract patterns once, by hand,
   per the "first instance by hand" rule in `CLAUDE.md`.
2. **Band membership guard** — `docs/REFACTORING-PLAN.md` §3.3. Any
   authenticated user can currently read any band's repertoire. This has to
   land before writes, not after.
3. **Setlists** — the feature the product is named around: assembling a set
   from repertoire and knowing whether it is ready.
4. **Events** — dates a setlist is for, and who is attending.
5. **Practice sessions** — connects the metronome to readiness.

## Health work in flight

Not features, but they gate the ones above. Full ordering in
[`REFACTORING-PLAN.md`](./REFACTORING-PLAN.md).

- ✅ Tooling: prettier, husky, commitlint, lint rules, coverage ratchet
- ✅ Integration test infrastructure (testcontainers)
- ✅ `durationSeconds` — time sorting now happens in the database
- ⬜ Band membership guard and the global exception filter
- ⬜ Sentry — production errors are currently invisible
- ⬜ Design system into `packages/ui`
- ⬜ Tags and a changelog

---

<!--
  TO CONFIRM — the "Suggested order" section is inferred from the codebase and
  from the conventions already written in CLAUDE.md, not from a stated plan.
  Replace it with the real sequence, and add target milestones if useful.
-->
