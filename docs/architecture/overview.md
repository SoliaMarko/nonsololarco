# System overview

Diagrams for humans. Mermaid renders natively on GitHub, diffs as text, and
cannot drift into a stale PNG nobody can edit.

> Machine-generated inventory (every component, route, util with test flags)
> lives in [`docs/ai/MAP.md`](../ai/MAP.md). This page is the shape of the
> system; that one is the contents.

---

## The whole thing at a glance

```mermaid
graph TB
    subgraph client["Browser"]
        WEB["apps/web<br/>Next.js 15 · React 19<br/>Tailwind v4 · next-intl"]
    end

    subgraph server["Server"]
        API["apps/api<br/>NestJS 11<br/>Swagger /api/docs"]
        DB[("PostgreSQL<br/>via Prisma 7")]
    end

    subgraph shared["packages/"]
        TYPES["@nonsololarco/types<br/>shared contracts"]
        DBPKG["@nonsololarco/db<br/>schema · migrations · seed"]
        UI["packages/ui<br/>design system (planned)"]
    end

    subgraph ext["External"]
        GOOGLE["Google OAuth"]
        GITHUB["GitHub OAuth"]
    end

    WEB -->|"REST /api/*<br/>React Query"| API
    API --> DB
    DBPKG -.->|"Prisma client"| API
    TYPES -.-> WEB
    TYPES -.-> API
    UI -.-> WEB
    API <--> GOOGLE
    API <--> GITHUB

    classDef app fill:#c94f4f,stroke:#2b2b2b,stroke-width:2px,color:#fff
    classDef pkg fill:#e8e07a,stroke:#2b2b2b,stroke-width:2px,color:#2b2b2b
    classDef store fill:#4f9c78,stroke:#2b2b2b,stroke-width:2px,color:#fff
    classDef out fill:#8a8078,stroke:#2b2b2b,stroke-width:2px,color:#fff
    class WEB,API app
    class TYPES,DBPKG,UI pkg
    class DB store
    class GOOGLE,GITHUB out
```

`packages/types` is the source of truth for anything crossing the wire. A shape
duplicated in `apps/web` instead of imported from there is a bug waiting for
the two copies to disagree.

---

## Data model

```mermaid
erDiagram
    User ||--o{ Account : "signs in via"
    User ||--o{ BandMember : "belongs to"
    Band ||--o{ BandMember : "has"
    Band ||--o{ Track : "owns"
    User ||--o{ Track : "leads"
    Track ||--o{ TrackPerformer : "performed by"
    User ||--o{ TrackPerformer : "performs"

    User {
        string id PK
        string name
        string email UK
        string passwordHash "null for OAuth-only"
    }
    Account {
        string id PK
        string provider "google | github"
        string providerAccountId
        string userId FK
    }
    Band {
        string id PK
        string name
    }
    BandMember {
        string id PK
        string role
        string userId FK
        string bandId FK
    }
    Track {
        string id PK
        int order
        string title
        enum side "a | b"
        enum musicalKey "C, Cm, C#, ..."
        int bpm
        enum status "ready|learning|new|archived"
        int durationSeconds "seconds — 190 renders as 3:10"
        string leadMemberId FK
        string bandId FK "null = solo track"
    }
    TrackPerformer {
        string id PK
        string trackId FK
        string userId FK
    }
```

Two things the diagram cannot show:

- **`Track.durationSeconds` is an integer**, not the `"m:ss"` text it is shown
  as, so Postgres can order by it. The client formats — see
  [ADR 0005](../adr/0005-duration-as-seconds.md).
- **`@@unique([bandId, order])` does not constrain solo tracks.** Postgres
  treats NULL as distinct, so two tracks with `bandId = null` may share an
  `order`. See §4.3.

Full field-level reference: [`data-model.md`](./data-model.md).

---

## A request, end to end

```mermaid
sequenceDiagram
    actor U as User
    participant P as Page (RSC)
    participant Q as React Query hook
    participant F as lib/api/*.api.ts
    participant C as Controller
    participant G as JwtAuthGuard
    participant S as Service
    participant DB as PostgreSQL

    U->>P: /en/repertoire?status=ready&sort=bpm
    P->>Q: useRepertoire({ status, sort, order, page })
    Q->>F: getRepertoire(params)
    F->>C: GET /api/users/me/repertoire?status=ready&sort=bpm
    C->>G: validate JWT
    G-->>C: SessionUser
    C->>C: validate RepertoireQueryDto
    C->>S: getByUser(user.id, query)
    S->>DB: count + findMany (where, orderBy, skip/take)
    DB-->>S: rows
    S->>S: map to Track, apply post-query sort if needed
    S-->>C: PaginatedResult<Track>
    C-->>F: JSON
    F-->>Q: typed response
    Q-->>P: data, isLoading, error
    P-->>U: rendered table
```

**Filtering, sorting and pagination happen in the database**, never in the
frontend. The one remaining exception is sorting by `status`, whose Postgres
enum orders alphabetically rather than meaningfully — that path still loads
every matching row. See `docs/REFACTORING-PLAN.md` §4.2.

---

## Branching and release

```mermaid
gitGraph
    commit id: "main"
    branch develop
    commit id: "develop"
    branch feature/CLEF-187
    commit id: "feat: …"
    commit id: "test: …"
    checkout develop
    merge feature/CLEF-187 tag: "squash"
    branch fix/CLEF-190
    commit id: "fix: …"
    checkout develop
    merge fix/CLEF-190 tag: "squash"
    checkout main
    merge develop tag: "v0.4.0"
```

Every change reaches `main` through `develop` — no exceptions except hotfixes,
which branch off `main` and are merged straight back into `develop`. Rules:
[`../ai/GIT.md`](../ai/GIT.md). Rationale:
[ADR 0004](../adr/0004-two-branch-model.md).

---

## Frontend layering

```mermaid
graph TD
    PAGE["app/[locale]/**/page.tsx"]
    FEAT["components/&lt;feature&gt;/<br/>repertoire · profile · metronome"]
    DS["components/ui/<br/>14 primitives"]
    QUERY["lib/hooks/<br/>React Query"]
    APIC["lib/api/<br/>fetch + client.ts"]
    STATE["hooks/global/<br/>useAuth · useTheme · useActiveBand"]
    UTIL["utils/ · lib/variants/ · lib/constants/"]

    PAGE --> FEAT
    PAGE --> QUERY
    FEAT --> DS
    FEAT --> QUERY
    FEAT --> STATE
    QUERY --> APIC
    DS --> UTIL
    FEAT --> UTIL

    classDef bad stroke-dasharray: 5 5
    DS -.->|"NEVER"| STATE
    DS -.->|"NEVER"| QUERY
    class DS bad
```

**The dashed arrows are the rule worth enforcing mechanically.** A design-system
component that reaches for `useAuth` or a React Query hook stops being reusable
— it now depends on this app's session and server. Once `packages/ui` exists
(plan §2.4), the package boundary makes it impossible; until then it is a
convention `dependency-cruiser` can check.

---

## Keeping these current

| Diagram           | Risk of going stale            | Mitigation                                                    |
| ----------------- | ------------------------------ | ------------------------------------------------------------- |
| System overview   | Low — changes rarely           | Review when a package is added                                |
| Data model        | **High** — every schema change | Generate from `schema.prisma` with `prisma-erd-generator`     |
| Request flow      | Medium                         | Review when a layer is added                                  |
| Branching         | None                           | Fixed by ADR 0004                                             |
| Frontend layering | Medium                         | Enforce with `dependency-cruiser`, which also emits the graph |

The two marked as generatable should be generated. A hand-drawn ERD is wrong
within a month, and nobody notices until it misleads someone.
