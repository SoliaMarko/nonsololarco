# Turborepo starter

## Getting started

```sh
npx create-turbo@latest
```

## What's inside?

- `docs` — Next.js app
- `web` — Next.js app
- `@repo/ui` — shared React component library
- `@repo/eslint-config` — ESLint configuration
- `@repo/typescript-config` — shared TypeScript config

Stack: TypeScript, ESLint, Prettier.

## Commands

```sh
turbo build         # build all apps
turbo dev           # dev mode
turbo build --filter=web   # specific app
```

## Remote Caching

Turborepo supports [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) via Vercel (free for all plans).

```sh
turbo login
turbo link
```

## CodeRabbit AI review

CodeRabbit runs automatically on every PR. Useful commands in PR comments:

- @coderabbitai review # trigger review manually
- @coderabbitai summary # regenerate PR summary
- @coderabbitai resolve # close all comments

## Useful links

- [Turborepo docs](https://turborepo.dev/docs)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
