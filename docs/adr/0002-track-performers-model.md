# 0002 — Track performers model

**Status:** Accepted
**Date:** 2026-08-05

## Context

`Track` had a single `leadMemberId`. That models "who owns this track" but not
"who plays on it" — in a real band a song usually involves several members, and
the repertoire page needs to answer "which tracks am I involved in?" for the
"Only mine" filter and the row highlighting.

The requirement, in the product owner's words: a track can have a lead member,
or it can have equal members with no particular lead.

## Decision

Keep `leadMemberId` as a required field on `Track` and add a `TrackPerformer`
join table for additional participants.

```prisma
model TrackPerformer {
  id      String @id @default(cuid())
  trackId String @map("track_id")
  userId  String @map("user_id")

  @@unique([trackId, userId])
  @@index([userId])
}
```

**The lead member is implicitly a performer and gets no `TrackPerformer` row.**
Participation is therefore a two-part predicate, wrapped in a single helper so
it's never written by hand:

```ts
function participatesIn(userId: string) {
  return { OR: [{ leadMemberId: userId }, { performers: { some: { userId } } }] };
}
```

The API exposes performers as `members: TrackMember[]`, excluding the lead. A
UI that wants everyone renders `[leadMember, ...members]`.

Tracks with "equal members and no lead" are represented by putting one of them
in `leadMemberId` and the rest in `performers`. The UI can choose not to
distinguish them.

## Alternatives considered

### Replace `leadMemberId` with a `members[]` array carrying an `isLead` flag

Conceptually cleaner — one collection, one place to look, and "no lead at all"
becomes representable rather than approximated.

Rejected on cost versus benefit. `leadMemberId` is referenced across the
service, the seed, the DTOs, the shared types and the UI; every one would need
migrating, and existing rows would need backfilling into the join table. The
alternative is additive: existing behaviour is untouched and the new capability
sits alongside it.

Worth revisiting if "leaderless track" becomes a real product concept rather
than an edge case, and if a `role` column (who plays *what* on this track) is
added — at that point the flag lives naturally on the join row and the split
model starts to hurt.

### Denormalise: a `performerIds String[]` column on `Track`

No join table, no extra query. Rejected — Postgres arrays have no foreign key
enforcement, so a deleted user leaves dangling ids, and `some` queries over
arrays don't use an index the way a join table does.

### Reuse `BandMember` as the participation record

Every band member is already linked to the band that owns the track, so
membership could imply participation. Rejected: it can't express "Anna is in
the band but doesn't play on this particular song", which is the whole point.
It also breaks for solo tracks, which have no band.

## Consequences

**Good**

- Additive change. No backfill, no rewrite of existing queries.
- "Only mine" and row highlighting now reflect actual involvement rather than
  ownership.
- `@@index([userId])` keeps "tracks I perform on" fast as the table grows.
- Cascade deletes on both sides — removing a track or a user leaves no orphans.

**Bad / accepted cost**

- Participation is two conditions, not one. Anyone writing a new query must
  remember both — the `participatesIn()` helper exists precisely so they don't
  have to, and any new participation query should use it.
- A truly leaderless track can't be expressed; one member has to be nominated
  as lead.
- `members` excluding the lead is a small trap for consumers who expect it to
  mean "everyone". Documented in the API reference and the type's doc comment.

**Follow-up needed**

- If per-track instrument roles are added, put `role` on `TrackPerformer` and
  reconsider merging `leadMemberId` into it.
