# nonsololarco docs

Project documentation. Four kinds, four folders.

| Folder                            | Answers                                  | Audience                        |
| --------------------------------- | ---------------------------------------- | ------------------------------- |
| [`ai/`](./ai)                     | _Where is everything and how do I do X?_ | AI assistants, new contributors |
| [`features/`](./features)         | _What does this do and how do I use it?_ | Anyone touching the feature     |
| [`architecture/`](./architecture) | _How is the system shaped?_              | Anyone adding to it             |
| [`adr/`](./adr)                   | _Why was it built this way?_             | Future you, in six months       |

## AI context

Read in this order on a cold start — each one routes to the next.

- [ORIENTATION](./ai/ORIENTATION.md) — cold-start map: stack, the nine
  non-negotiable rules, repo-specific traps, where to go for what.
- [RECIPES](./ai/RECIPES.md) — step-by-step playbooks: which files to touch,
  in which order, for each common task.
- [GIT](./ai/GIT.md) — branch naming, commit messages and size limits, rebase
  vs merge, squash policy, and how each rule is machine-enforced.
- [MAP](./ai/MAP.md) — **generated** inventory: every component, util, route,
  model and translation namespace, with test/story coverage flags.
  Regenerate with `pnpm ai:map`; never edit by hand.

- [Refactoring plan](./REFACTORING-PLAN.md) — audit findings and the ordered
  list of PRs to bring the project to a professional standard.

## Features

- [Repertoire filtering & sorting](./features/repertoire-filtering.md) — status
  filters, "only mine", column sorting, counts.
- [Repertoire pagination](./features/repertoire-pagination.md) — paged track
  list with URL state, ellipsis collapsing, continuous row numbers.
- [Internationalization (i18n)](./features/i18n.md) — locale switcher, next-intl
  setup, translation file structure, layout stability.
- [Metronome (offline)](./features/metronome.md) — fullscreen practice
  metronome with pendulum, tap tempo, song tracking, practice history.

## Architecture

- [System overview](./architecture/overview.md) — diagrams for humans: system
  shape, data model, request flow, branching, frontend layering.

- [Data model](./architecture/data-model.md) — Prisma schema, entity
  relationships, key constraints.
- [Repertoire API](./architecture/api-repertoire.md) — endpoints, query
  parameters, response shapes.

## Decisions

- [0001 — Server-side sorting and filtering](./adr/0001-server-side-sorting-and-filtering.md)
- [0002 — Track performers model](./adr/0002-track-performers-model.md)
- [0003 — i18n library: next-intl](./adr/0003-i18n-library-next-intl.md)
- [0004 — Two-branch model: `develop` integrates, `main` ships](./adr/0004-two-branch-model.md)

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
