# Journal

Three lines at the end of each working session: what was done, what is next,
where you got stuck. Read the last entry at the start of the next session.

Most of the cost of solo work is reloading context — what you were mid-thought
about, and why you left something half-finished. This removes it.

**Newest first.** Keep entries short; if something needs explaining at length
it belongs in an ADR or a feature doc, not here.

### Format

```markdown
## YYYY-MM-DD

- **Done:** …
- **Next:** …
- **Stuck / watch out:** …
```

Leave `Stuck` out when nothing is stuck. Do not pad it.

---

## 2026-08-16

- **Done:** `durationSeconds` replaces the `"m:ss"` string — time sorting now
  happens in Postgres instead of loading the whole table into memory (ADR
  0005). Fixed the CI coverage step, which failed with 403 because the
  workflow token lacked `pull-requests: write`. Split the JSX line budget from
  the imperative one and capped `jsx-max-depth`.
- **Next:** band membership guard — any authenticated user can currently read
  any band's repertoire. Then the partial unique index for solo track ordering.
- **Stuck / watch out:** run `db:migrate` **and** `db:generate` before anything
  else; the Prisma client still has the old `duration` field until you do, and
  the API typecheck fails in a confusing way. `PRINCIPLES.md` and this file
  were created as scaffolds — the product entries in them still need filling
  in.
