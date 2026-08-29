# nonsololarco

_"non solo arco"_ — not only the bow.

A social platform and practice tool for musicians: shared band repertoires,
track status tracking, and practice tooling, in a retro/vintage interface built
around vinyl records, stamps and monospace labels.

## Stack

|          |                                                                           |
| -------- | ------------------------------------------------------------------------- |
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4, Radix UI, React Query |
| Backend  | NestJS 11, Prisma 7, PostgreSQL                                           |
| Monorepo | Turborepo + pnpm workspaces                                               |
| Testing  | Vitest (unit), Playwright (web e2e), supertest (api e2e), Storybook       |

```text
apps/
  web/            Next.js frontend        → localhost:3000
  api/            NestJS backend          → localhost:3001, docs at /api/docs
packages/
  types/          @nonsololarco/types     shared TS types (source of truth)
  db/             @nonsololarco/db        Prisma schema, migrations, seed
  ui/             @repo/ui                shared components
docs/             feature docs, architecture, ADRs
```

## Getting started

Requires Node 22+, pnpm 9, and a PostgreSQL instance.

```sh
pnpm install
cp .env.example .env          # then fill in JWT_SECRET and the OAuth keys

pnpm db:setup                 # start Postgres, migrate, generate, seed
pnpm dev
```

`db:setup` is `db:up && db:migrate && db:generate && db:seed`; run the steps
individually when you need to. **All `db:*` scripts run from the repo root** —
they are not defined inside `packages/db`, so `cd packages/db && pnpm db:up`
will not find them.

`db:up` starts Postgres in Docker with the credentials in `.env.example`, and
waits for its healthcheck before returning so the migration cannot race the
container. Running your own Postgres is equally fine — the default
`DATABASE_URL` expects database `nonsololarco` owned by `postgres` on port
5432, e.g. `brew services start postgresql@16` plus
`createdb -h localhost -U postgres nonsololarco`.

### When the database will not connect

| Symptom                                         | Cause                                                                                                         | Fix                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `P1001: Can't reach database server`            | Postgres is not running                                                                                       | `pnpm db:up`, or start your local instance       |
| `Cannot connect to the Docker daemon`           | Docker Desktop is not open                                                                                    | Launch Docker Desktop, then `pnpm db:up`         |
| Prisma Studio: `Could not load schema metadata` | same as `P1001` — no connection                                                                               | as above                                         |
| `P1000: Authentication failed`                  | the Docker volume was initialised with different credentials, so the ones in `docker-compose.yml` are ignored | `pnpm db:nuke && pnpm db:setup`                  |
| `database "nonsololarco" does not exist`        | server is up, database is not created                                                                         | `createdb -h localhost -U postgres nonsololarco` |

None of these indicate a problem with the code.

`P1000` is the confusing one, because the server clearly answers. The postgres
image applies `POSTGRES_USER` and `POSTGRES_PASSWORD` **only when the data
directory is empty** — once the volume exists, editing the compose file changes
nothing and the server keeps the roles it was first created with. `pnpm db:nuke`
drops the volume so the next `db:up` re-initialises it. It deletes all local
data, which is why it is separate from `db:down`.

If `P1000` persists afterwards, something else is already listening on 5432 —
usually a local Postgres. Check with `lsof -i :5432`, then either stop it or
point `DATABASE_URL` at it instead.

Sign in at `http://localhost:3000` via Google or GitHub. To attach the seed data
to the account you just created rather than the placeholder user:

```sh
SEED_USER_EMAIL=you@example.com pnpm db:seed
```

Stop the database with `pnpm db:down`, or `pnpm db:nuke` to drop the volume and start
from an empty one.

## Commands

```sh
pnpm dev                  # all apps
pnpm build
pnpm typecheck
pnpm lint
pnpm test                 # unit tests everywhere
pnpm format
```

```sh
pnpm --filter web storybook          # component workshop, :6006
pnpm --filter web e2e                # Playwright — see apps/web/e2e/README.md
pnpm --filter api test:e2e           # API e2e
pnpm db:studio                       # Prisma Studio
```

**After editing `schema.prisma`,** run both `db:migrate` _and_ `db:generate` —
the first updates the database, the second the TypeScript client. Doing only one
produces confusing runtime errors.

## Documentation

- [`docs/`](./docs) — features, architecture, and decision records
- [`CLAUDE.md`](./CLAUDE.md) — code quality rules, testing policy, docs policy
- Swagger UI at `http://localhost:3001/api/docs`

New feature? Write the doc in the same PR — see
[`docs/README.md`](./docs/README.md).

## Contributing

Before opening a PR:

```sh
pnpm check        # lint + stylelint + typecheck + test + build
pnpm check:full   # the above plus e2e
```

Unit tests are required for all new code; e2e is required for features that
cross the frontend/backend boundary. The full policy is in
[`CLAUDE.md`](./CLAUDE.md#testing-policy).

CodeRabbit reviews every PR automatically. Useful comment commands:

```sh
@coderabbitai review     # trigger a re-review
@coderabbitai summary    # regenerate the PR summary
@coderabbitai resolve    # close all comments
```
