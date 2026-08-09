'use client';

import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 * Avoids React's SSR warning without losing the synchronous-before-paint
 * timing on the client.
 */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface UseLockedHeightResult<T extends HTMLElement> {
  /** Apply as `style={{ minHeight }}` — `undefined` while unlocked */
  minHeight: number | undefined;
  /** Attach to the element whose height should be held */
  ref: RefObject<T | null>;
}

/**
 * Holds an element's height steady while a transition is in flight.
 *
 * Measures on the frame `isLocked` turns true and returns that as a
 * `minHeight` floor, so content that shrinks or empties mid-update can't
 * collapse the layout underneath the user. Releases when `isLocked` goes
 * false, letting the new content size the element normally.
 *
 * It's a floor, not a fixed height — content taller than the locked value
 * still grows, so nothing gets clipped.
 *
 * Measures in a layout effect, before paint, so the lock lands in the same
 * frame the content is removed rather than one frame late.
 *
 * @example
 * const { minHeight, ref } = useLockedHeight<HTMLDivElement>(isFetching);
 * <div ref={ref} style={{ minHeight }}>{rows}</div>
 */
export function useLockedHeight<T extends HTMLElement>(
  isLocked: boolean,
): UseLockedHeightResult<T> {
  const ref = useRef<T>(null);
  const [minHeight, setMinHeight] = useState<number>();

  useIsomorphicLayoutEffect(() => {
    if (!isLocked) {
      setMinHeight(undefined);
      return;
    }

    setMinHeight(ref.current?.offsetHeight);
  }, [isLocked]);

  return { minHeight, ref };
}
