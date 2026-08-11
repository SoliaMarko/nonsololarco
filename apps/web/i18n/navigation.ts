import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * Locale-aware navigation utilities.
 *
 * Drop-in replacements for Next.js navigation hooks that automatically
 * handle the `[locale]` URL prefix. Use these instead of importing
 * directly from `next/navigation`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
