import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Where `auth.setup.ts` writes the signed-in browser state for the other
 * projects to reuse. Gitignored — it holds a real (short-lived) JWT.
 *
 * Lives here rather than in `playwright.config.ts` because a spec importing
 * the config makes Playwright re-evaluate it while collecting tests, which
 * fails with "did not expect test() to be called here".
 */
export const STORAGE_STATE = path.join(dirname, '.auth/user.json');
