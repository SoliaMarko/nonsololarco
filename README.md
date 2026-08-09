# nonsololarco

*"non solo arco"* — not only the bow.

A social platform and practice tool for musicians: shared band repertoires,
track status tracking, and practice tooling, in a retro/vintage interface built
around vinyl records, stamps and monospace labels.

## Stack

| | |
| --- | --- |
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS v4, Radix UI, React Query |
| Backend | NestJS 11, Prisma 7, PostgreSQL |
| Monorepo | Turborepo + pnpm workspaces |
| Testing | Vitest (unit), Playwright (web e2e), supertest (api e2e), Storybook |

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
cp .env.example .env          # then fill in DATABASE_URL, JWT_SECRET, OAuth keys

pnpm --filter @nonsololarco/db db:migrate
pnpm --filter @nonsololarco/db db:generate
pnpm --filter @nonsololarco/db db:seed

pnpm dev
```

Sign in at `http://localhost:3000` via Google or GitHub. To attach the seed data
to the account you just created rather than the placeholder user:

```sh
SEED_USER_EMAIL=you@example.com pnpm --filter @nonsololarco/db db:seed
```

There's a `docker/` directory if you'd rather not run Postgres locally.

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
pnpm --filter @nonsololarco/db db:studio
```

**After editing `schema.prisma`,** run both `db:migrate` *and* `db:generate` —
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
pnpm lint && pnpm typecheck && pnpm test && pnpm --filter web e2e && pnpm build
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
