# 0003 — i18n library: next-intl

**Status:** Accepted
**Date:** 2026-08-12

## Context

nonsololarco needs to support three languages — English, Italian, and
Ukrainian. The solution must work with the Next.js 15 App Router, handle both
server and client components, provide URL-prefix-based routing
(`/en`, `/it`, `/uk`), and support ICU message syntax for plurals and
interpolation.

## Decision

We use **next-intl** as the sole i18n library.

Locale routing uses the `[locale]` dynamic segment with `localePrefix: 'always'`
so every URL carries its language explicitly. Translation files are JSON,
split by namespace (`common`, `auth`, `pages`) and stored per locale in
`apps/web/messages/{locale}/`. English is the source of truth — Italian and
Ukrainian must mirror its key set exactly.

## Alternatives considered

### Option B — next-i18next

The most popular Next.js i18n library, but it was built for the Pages Router.
App Router support was added later and still requires workarounds for server
components. The API surface is larger and the migration path from Pages to App
Router is awkward. next-intl was designed for App Router from the start.

### Option C — react-intl (FormatJS)

A mature, framework-agnostic library with full ICU support. However, it has no
built-in Next.js routing integration — we would need to wire up middleware,
locale detection, and URL rewriting ourselves. next-intl bundles all of this
out of the box.

### Option D — Custom solution with i18next core

Maximum flexibility, minimum opinions. Rejected because integrating i18next
with App Router server components, middleware, and metadata generation would be
significant custom plumbing with no maintenance advantage over a purpose-built
library.

## Consequences

**Good**

- First-class App Router support: server components use `getTranslations()`,
  client components use `useTranslations()`, metadata uses `getTranslations()`
  in `generateMetadata`. No shimming.
- Built-in middleware for locale detection and URL prefix routing.
- `useFormatter()` for dates, numbers, and relative time — consistent
  formatting without manual Intl plumbing.
- Active maintenance and strong TypeScript support.

**Bad / accepted cost**

- Smaller ecosystem than i18next — fewer plugins, fewer Stack Overflow answers.
- Library-specific API: if we ever migrate away, every component that calls
  `useTranslations()` needs updating. Mitigated by the namespace pattern
  keeping translation keys centralized.

**Follow-up needed**

- Crowdin integration for professional translation management (in progress).
- Type-safe translation keys via next-intl's TypeScript plugin (deferred until
  the key set stabilises).
