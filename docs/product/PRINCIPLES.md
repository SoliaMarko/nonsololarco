# Product principles

What this product is, what it deliberately is **not**, and what would change
our mind.

> **Read this before adding a feature.** Several obvious-looking features were
> cut on purpose. Re-adding one by accident wastes a sprint and, worse, moves
> the product somewhere nobody decided to go.

---

## What nonsololarco is

A **shared repertoire and gig-preparation tool for bands.**

The question it answers is: _are we ready to play this show?_ Everything that
helps answer it earns its place. Everything else has to argue for itself.

## What it is not

- **Not a social network.** No feed, no follower counts, no discovery of
  strangers. Bands are small closed groups who already know each other.
- **Not a DAW or a notation editor.** It does not record, edit or engrave. It
  points at material and tracks readiness.
- **Not a general-purpose task manager.** Preparation is organised around
  tracks, setlists and dates — not arbitrary to-dos.

---

## How to use this document

Every entry below has the same three parts, and the third is what makes the
document worth keeping:

**Decision** — what we are not building.
**Why** — the reasoning at the time, in enough detail that it can be argued
with later.
**What would change this** — the concrete, observable condition that would make
the feature correct. Without it, an entry is just a "no" and the question comes
back every few months.

Add an entry whenever a feature is discussed and rejected. A rejection that
lives only in someone's memory is a rejection that gets reversed by accident.

### Template

```markdown
### <Feature name>

**Decision:** not building it, for now.

**Why:** …

**What would change this:** …

**Discussed:** YYYY-MM-DD
```

---

## Decisions on record

### Solo repertoire is not a band

**Decision:** a personal track is a `Track` with `bandId = null`, not a member
of a private "Solo" band.

**Why:** a real `Band` row would need a membership, a name, an owner and a
place in every band list — for a group that always has exactly one member. The
UI presents "Solo" as a pseudo-band, which is a display concern rather than a
data one.

**Cost accepted:** Postgres excludes NULLs from unique constraints, so
`@@unique([bandId, order])` does not constrain solo tracks. Tracked in
`docs/REFACTORING-PLAN.md` §4.3.

**What would change this:** solo repertoire needing anything band-shaped —
sharing with a teacher, its own settings, more than one participant.

**Discussed:** recorded retroactively from
[ADR 0002](../adr/0002-track-performers-model.md) and the data model.

### The lead member is not a performer row

**Decision:** the track lead is a column on `Track`, not a row in
`TrackPerformer`.

**Why:** every track has exactly one lead, and modelling a required
single-valued relationship as a many-to-many makes "who leads this" a query
instead of a field.

**Cost accepted:** every "does this user participate?" check must test both
`leadMemberId` and `performers`. That is the `participatesIn()` helper — use
it rather than rewriting the condition.

**What would change this:** co-leads, or a track with no lead at all.

**Discussed:** [ADR 0002](../adr/0002-track-performers-model.md).

---

<!--
  TO FILL IN — these need product decisions, not engineering ones.

  The repository shows several routes that exist as pages but are not built out
  (chat, notifications, calendar) and several documented in CLAUDE.md but with
  no implementation (setlists, events, practice sessions, invites). Each is
  either "next" — and belongs in ROADMAP.md — or "deliberately cut" — and
  belongs here with a reason and a reversal condition.

  Candidates worth an explicit entry, if any of them were in fact rejected:

  - In-app chat            (a page exists at /chat)
  - Notifications          (a page exists at /notifications)
  - Public band profiles / discovery
  - Audio upload or playback
  - Comments on tracks
  - Metronome practice history sync across devices

  Delete this comment once the real entries are written.
-->
