# nonsololarco docs

Project documentation. Three kinds, three folders.

| Folder | Answers | Audience |
| --- | --- | --- |
| [`features/`](./features) | *What does this do and how do I use it?* | Anyone touching the feature |
| [`architecture/`](./architecture) | *How is the system shaped?* | Anyone adding to it |
| [`adr/`](./adr) | *Why was it built this way?* | Future you, in six months |

## Features

- [Repertoire filtering & sorting](./features/repertoire-filtering.md) — status
  filters, "only mine", column sorting, counts.
- [Repertoire pagination](./features/repertoire-pagination.md) — paged track
  list with URL state, ellipsis collapsing, continuous row numbers.
- [Metronome (offline)](./features/metronome.md) — fullscreen practice
  metronome with pendulum, tap tempo, song tracking, practice history.

## Architecture

- [Data model](./architecture/data-model.md) — Prisma schema, entity
  relationships, key constraints.
- [Repertoire API](./architecture/api-repertoire.md) — endpoints, query
  parameters, response shapes.

## Decisions

- [0001 — Server-side sorting and filtering](./adr/0001-server-side-sorting-and-filtering.md)
- [0002 — Track performers model](./adr/0002-track-performers-model.md)

---

## Writing docs

Templates: [`features/_template.md`](./features/_template.md),
[`adr/_template.md`](./adr/_template.md).

**Rules of thumb**

- Write the doc in the same PR as the code. A doc added "later" is never added.
- If you change behaviour, update the doc. A stale doc costs more than no doc.
- Short beats complete. Link to code for detail rather than restating it.
- Diagrams in Mermaid — it renders on GitHub and diffs as text.
- Add new entries to the index above so things stay findable.

ADRs are numbered sequentially and **immutable once accepted**. To reverse a
decision, write a new ADR that supersedes the old one and add a
`Superseded by 00NN` line to the original. That history is the whole point.
