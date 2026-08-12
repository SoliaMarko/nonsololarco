#!/usr/bin/env node
/**
 * Generates docs/ai/MAP.md — a machine-derived inventory of the project for AI
 * assistants and new contributors.
 *
 * The point: anything derivable from the code is never written by hand. A
 * hand-written description of the file tree goes stale within a week and then
 * actively misleads — the generated one cannot.
 *
 * Run: `pnpm ai:map` (and from lint-staged whenever source files change).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/ai/MAP.md');

const SKIP_DIRS = new Set([
  'node_modules', '.next', 'dist', 'build', '.git', 'generated', '.turbo', '.claude',
]);

/** Recursively collects files under `dir`, skipping build and vendor folders. */
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const rel = (p) => relative(ROOT, p).split('\\').join('/');
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');

// ---------------------------------------------------------------------------
// Web components, stories, modules
// ---------------------------------------------------------------------------

/**
 * Indexes the centralised story library.
 *
 * Stories in this project do NOT sit next to the component — they live in
 * `apps/web/stories/<category>/<Name>.stories.tsx`, which is what
 * `.storybook/main.ts` globs (`stories: ['../stories/**']`).
 *
 * Returns a Map of component name → story path.
 */
function collectStories() {
  const byName = new Map();
  for (const f of walk(join(ROOT, 'apps/web/stories'))) {
    if (!/\.stories\.tsx?$/.test(f)) continue;
    byName.set(basename(f).replace(/\.stories\.tsx?$/, ''), rel(f));
  }
  return byName;
}

/**
 * Finds every React component in `apps/web/src` following the
 * "PascalCase.tsx inside a folder of the same name" convention, and flags
 * whether it has a unit test and a story.
 *
 * Tests are looked up next to the component; stories in the central library.
 * A story covering several components at once (e.g. `Icons.stories.tsx`) only
 * matches the identically named component — a deliberate trade-off, since a
 * tighter link would require parsing imports.
 */
function collectComponents(stories) {
  const components = [];

  for (const f of walk(join(ROOT, 'apps/web/src'))) {
    if (!f.endsWith('.tsx')) continue;
    if (f.includes('.test.') || f.includes('.stories.')) continue;
    const name = basename(f, '.tsx');
    if (!/^[A-Z]/.test(name)) continue;

    const dir = dirname(f);
    components.push({
      name,
      path: rel(f),
      hasTest: existsSync(join(dir, `${name}.test.tsx`)),
      hasStory: stories.has(name),
      group: rel(dir).replace('apps/web/src/', '').split('/').slice(0, 2).join('/'),
    });
  }
  return components.sort((a, b) => a.path.localeCompare(b.path));
}

/** Collects web utils, hooks and React Query hooks, flagged by test presence. */
function collectModules() {
  const mods = [];

  for (const f of walk(join(ROOT, 'apps/web/src'))) {
    const ext = f.endsWith('.tsx') ? '.tsx' : f.endsWith('.ts') ? '.ts' : null;
    if (!ext || f.includes('.test.') || f.includes('.stories.')) continue;

    const name = basename(f, ext);
    const isUtil = f.includes('/utils/') && !/^[A-Z]/.test(name);
    const isHook = /^use[A-Z]/.test(name);
    const isQuery = f.includes('/lib/hooks/');
    if (!isUtil && !isHook && !isQuery) continue;

    const dir = dirname(f);
    mods.push({
      name,
      path: rel(f),
      kind: isQuery ? 'query' : isHook ? 'hook' : 'util',
      hasTest:
        existsSync(join(dir, `${name}.test.ts`)) || existsSync(join(dir, `${name}.test.tsx`)),
    });
  }
  return mods.sort((a, b) => a.path.localeCompare(b.path));
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Extracts HTTP routes from Nest controllers by joining the `@Controller()`
 * prefix with each method decorator.
 *
 * Regex over decorators, not a TypeScript parser — dynamically assembled paths
 * (none in this project so far) would be missed.
 */
function collectRoutes() {
  const routes = [];

  for (const f of walk(join(ROOT, 'apps/api/src')).filter((p) => p.endsWith('.controller.ts'))) {
    const src = read(f);
    const prefix = src.match(/@Controller\(\s*['"`]([^'"`]*)['"`]/)?.[1] ?? '';
    const methodRe =
      /@(Get|Post|Patch|Put|Delete)\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)[\s\S]{0,400}?\n\s*(?:async\s+)?(\w+)\s*\(/g;

    let m;
    while ((m = methodRe.exec(src)) !== null) {
      const [, verb, path = '', handler] = m;
      routes.push({
        verb: verb.toUpperCase(),
        path: `/${['api', prefix, path].filter(Boolean).join('/')}`,
        handler,
        file: rel(f),
      });
    }
  }
  return routes.sort((a, b) => a.path.localeCompare(b.path));
}

/** Collects API services, flagged by unit and integration test presence. */
function collectServices() {
  return walk(join(ROOT, 'apps/api/src'))
    .filter((f) => f.endsWith('.service.ts'))
    .map((f) => {
      const name = basename(f, '.ts');
      return {
        name,
        path: rel(f),
        hasSpec: existsSync(join(dirname(f), `${name}.spec.ts`)),
        hasInt: existsSync(join(dirname(f), `${name}.int-spec.ts`)),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

// ---------------------------------------------------------------------------
// Prisma, shared types, translations
// ---------------------------------------------------------------------------

/** Extracts model and enum names from schema.prisma. */
function collectPrisma() {
  const src = read(join(ROOT, 'packages/db/prisma/schema.prisma'));
  return {
    models: [...src.matchAll(/^model\s+(\w+)\s*\{/gm)].map((m) => m[1]),
    enums: [...src.matchAll(/^enum\s+(\w+)\s*\{/gm)].map((m) => m[1]),
  };
}

/** Collects exported names from packages/types. */
function collectSharedTypes() {
  const out = [];
  for (const f of walk(join(ROOT, 'packages/types/src')).filter((p) => p.endsWith('.ts'))) {
    const names = [...read(f).matchAll(/export\s+(?:interface|type|enum|const)\s+(\w+)/g)].map(
      (m) => m[1],
    );
    if (names.length) out.push({ file: rel(f), names: names.sort() });
  }
  return out.sort((a, b) => a.file.localeCompare(b.file));
}

/**
 * Counts keys per translation namespace, per locale.
 *
 * A count that differs from `en` means a missing key — English is the source
 * of truth and a gap is a bug, not a fallback.
 */
function collectMessages() {
  const base = join(ROOT, 'apps/web/messages');
  if (!existsSync(base)) return [];

  const countKeys = (obj) =>
    Object.values(obj).reduce((n, v) => n + (v && typeof v === 'object' ? countKeys(v) : 1), 0);

  const locales = readdirSync(base).filter((d) => statSync(join(base, d)).isDirectory());
  const namespaces = new Set();
  for (const loc of locales) {
    for (const f of readdirSync(join(base, loc))) if (f.endsWith('.json')) namespaces.add(f);
  }

  return [...namespaces].sort().map((ns) => {
    const counts = {};
    for (const loc of locales) {
      const p = join(base, loc, ns);
      if (!existsSync(p)) {
        counts[loc] = null;
        continue;
      }
      try {
        counts[loc] = countKeys(JSON.parse(read(p)));
      } catch {
        counts[loc] = null;
      }
    }
    return { ns, counts, locales };
  });
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

const mark = (b) => (b ? '✓' : '·');
const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

function render() {
  const stories = collectStories();
  const components = collectComponents(stories);
  const modules = collectModules();
  const routes = collectRoutes();
  const services = collectServices();
  const { models, enums } = collectPrisma();
  const types = collectSharedTypes();
  const messages = collectMessages();

  const byGroup = new Map();
  for (const c of components) {
    if (!byGroup.has(c.group)) byGroup.set(c.group, []);
    byGroup.get(c.group).push(c);
  }

  const componentNames = new Set(components.map((c) => c.name));
  const orphanStories = [...stories].filter(([name]) => !componentNames.has(name));

  const tested = components.filter((c) => c.hasTest).length;
  const storied = components.filter((c) => c.hasStory).length;
  const testedModules = modules.filter((m) => m.hasTest).length;

  const L = [];
  L.push('# MAP — project inventory');
  L.push('');
  L.push('> **Generated automatically. Do not edit by hand** — changes are overwritten.');
  L.push('> Regenerate with `pnpm ai:map`.');
  L.push('>');
  L.push('> This is the "where is what" reference. Rules live in `CLAUDE.md` and the');
  L.push('> `nonsololarco-conventions` skill; step-by-step task guides in');
  L.push('> [`RECIPES.md`](./RECIPES.md).');
  L.push('');
  L.push(`Updated: ${new Date().toISOString().slice(0, 10)}`);
  L.push('');

  L.push('## Coverage at a glance');
  L.push('');
  L.push('| Category | Total | Tested | With story |');
  L.push('| --- | --- | --- | --- |');
  L.push(
    `| Web components | ${components.length} | ${tested} (${pct(tested, components.length)}%) | ${storied} (${pct(storied, components.length)}%) |`,
  );
  L.push(
    `| Utils + hooks | ${modules.length} | ${testedModules} (${pct(testedModules, modules.length)}%) | — |`,
  );
  L.push(
    `| API services | ${services.length} | ${services.filter((s) => s.hasSpec).length} unit / ${services.filter((s) => s.hasInt).length} integration | — |`,
  );
  L.push('');
  L.push(
    `Stories live centrally in \`apps/web/stories/\` (${stories.size} files), not next to components.`,
  );
  L.push('');

  L.push('## API routes');
  L.push('');
  if (routes.length) {
    L.push('| Method | Path | Handler | File |');
    L.push('| --- | --- | --- | --- |');
    for (const r of routes) L.push(`| ${r.verb} | \`${r.path}\` | ${r.handler} | \`${r.file}\` |`);
  } else {
    L.push('_No routes found._');
  }
  L.push('');

  L.push('## API services');
  L.push('');
  L.push('| Service | unit | int | File |');
  L.push('| --- | --- | --- | --- |');
  for (const s of services) {
    L.push(`| ${s.name} | ${mark(s.hasSpec)} | ${mark(s.hasInt)} | \`${s.path}\` |`);
  }
  L.push('');

  L.push('## Database');
  L.push('');
  L.push(`**Models:** ${models.map((m) => `\`${m}\``).join(', ')}`);
  L.push('');
  L.push(`**Enums:** ${enums.map((e) => `\`${e}\``).join(', ')}`);
  L.push('');
  L.push(
    'Schema: `packages/db/prisma/schema.prisma` · Reference: `docs/architecture/data-model.md`',
  );
  L.push('');

  L.push('## Shared types (`@nonsololarco/types`)');
  L.push('');
  for (const t of types) {
    L.push(`- \`${t.file}\` — ${t.names.map((n) => `\`${n}\``).join(', ')}`);
  }
  L.push('');

  L.push('## Web components');
  L.push('');
  L.push('Flags: first `✓` = has a unit test, second = has a Storybook story.');
  L.push('');
  for (const [group, list] of [...byGroup].sort()) {
    L.push(`### \`src/${group}/\``);
    L.push('');
    for (const c of list) {
      L.push(`- \`${mark(c.hasTest)}${mark(c.hasStory)}\` **${c.name}** — \`${c.path}\``);
    }
    L.push('');
  }

  L.push('## Utils, hooks, queries');
  L.push('');
  L.push('| T | Kind | Name | File |');
  L.push('| --- | --- | --- | --- |');
  for (const m of modules) L.push(`| ${mark(m.hasTest)} | ${m.kind} | ${m.name} | \`${m.path}\` |`);
  L.push('');

  if (orphanStories.length) {
    L.push('## Stories without a matching component');
    L.push('');
    L.push('Either the story covers several components, or the component was renamed.');
    L.push('');
    for (const [name, path] of orphanStories.sort()) L.push(`- **${name}** — \`${path}\``);
    L.push('');
  }

  L.push('## Translations');
  L.push('');
  if (messages.length) {
    const { locales } = messages[0];
    const enKey = locales.includes('en') ? 'en' : locales[0];
    L.push(`| Namespace | ${locales.join(' | ')} |`);
    L.push(`| --- | ${locales.map(() => '---').join(' | ')} |`);
    for (const m of messages) {
      const cells = locales.map((l) => {
        const v = m.counts[l];
        if (v === null) return '**missing**';
        return v !== m.counts[enKey] ? `**${v}** ⚠` : String(v);
      });
      L.push(`| ${m.ns} | ${cells.join(' | ')} |`);
    }
    L.push('');
    L.push('⚠ = key count differs from `en`. English is the source of truth, so a');
    L.push('mismatch means a missing key — that is a bug, not a fallback.');
  }
  L.push('');

  return L.join('\n');
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, render(), 'utf8');
console.log(`✓ ${rel(OUT)}`);
