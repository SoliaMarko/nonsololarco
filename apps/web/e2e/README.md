# E2E tests

Playwright specs for flows that cross the frontend/backend boundary. See the
testing policy in [`CLAUDE.md`](../../../CLAUDE.md#testing-policy) for when a
feature needs e2e coverage versus unit tests alone.

## First run

```sh
pnpm install                          # picks up @playwright/test
pnpm --filter web e2e:install         # downloads the Chromium binary
```

## Running

E2E needs the stack running and the database seeded.

```sh
# terminal 1
pnpm dev

# terminal 2
pnpm --filter web e2e            # headless
pnpm --filter web e2e:ui         # interactive, best for writing tests
pnpm --filter web e2e:report     # open the last HTML report
```

Have Playwright start the web server itself instead:

```sh
E2E_START_SERVER=1 pnpm --filter web e2e
```

The API still has to be running separately — Playwright only boots the Next
app.

## Environment

Read from the root `.env`, so a normal dev setup already works.

| Variable           | Purpose                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `JWT_SECRET`       | Required. `auth.setup.ts` signs its own token with it                                                             |
| `DATABASE_URL`     | Required. Used to look up the seeded user's id                                                                    |
| `E2E_USER_EMAIL`   | Which user to sign in as. Defaults to `solomiia@example.com`                                                      |
| `E2E_WEB_URL`      | Defaults to `http://localhost:3000`                                                                               |
| `E2E_START_SERVER` | Set to `1` to have Playwright boot the web app itself                                                             |
| `E2E_WEB_COMMAND`  | What `E2E_START_SERVER` runs. Defaults to `pnpm --filter web dev`; CI overrides it with `pnpm --filter web start` |

If you seeded against your real OAuth account, point the tests at it:

```sh
E2E_USER_EMAIL=you@example.com pnpm --filter web e2e
```

## Authentication

The app authenticates from an httpOnly `token` cookie holding a JWT. OAuth
can't be driven from a test, so `auth.setup.ts` mints that JWT directly with
`JWT_SECRET` — the same token the Google/GitHub callback would issue — and
saves the browser state to `e2e/.auth/user.json` (gitignored).

It runs once as a `setup` project that every other project depends on, so specs
start already signed in. It also asserts the cookie actually authenticates
before saving, so a bad secret fails there with a clear message rather than as
a redirect loop in every spec.

## In CI

The `e2e` job in `.github/workflows/ci.yml` runs on every PR and blocks the
final `ci` check, so a broken e2e can't be merged.

It differs from local in three ways worth knowing when a test passes locally
and fails in CI:

- **Production build, not dev.** `next dev` compiles on first request and blows
  the startup timeout, so CI runs `pnpm build` then `pnpm --filter web start`
  via `E2E_WEB_COMMAND`.
- **Fresh database every run.** A Postgres service container is migrated with
  `prisma migrate deploy` and seeded from scratch, so tests see exactly the
  seed data — no leftovers from your local fiddling.
- **One worker, one retry.** Retries absorb genuine infrastructure noise; a
  test that only passes on retry is still a bug worth looking at.

The HTML report is uploaded as a `playwright-report` artifact on every run,
including failures — download it from the workflow summary rather than
guessing from the log.

## Conventions

- Query by role and accessible name (`getByRole`), not by CSS class or test id.
  If an element is hard to select, that's usually an accessibility gap worth
  fixing in the component.
- Assert on user-visible outcomes and URL state. Don't reach into React
  internals or network mocks — that's what unit tests are for.
- Wait for `aria-busy="false"` on the table rather than sleeping. The
  `tracksTable()` helper does this.
- One spec file per feature, named to match its doc in `docs/features/`.
