'use client';

import { type HTMLAttributes, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { type VariantProps } from 'class-variance-authority';

import { tabsListVariants } from '@/src/lib/variants/tabs.variants';
import { cn } from '@/src/utils/cn';

import TabsContext from './TabsContext';
import TabsIndicator from './TabsIndicator';

interface IndicatorRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof tabsListVariants> {
  /**
   * Enables the sliding indicator animation — a background highlight and
   * accent underline that smoothly transition between active tabs.
   */
  animated?: boolean;
  children: ReactNode;
  className?: string;
  /**
   * Accessible label for the tab list — required when the purpose isn't
   * obvious from surrounding context (i.e. most of the time).
   */
  label?: string;
  /**
   * Wraps the list in a horizontally-scrollable container.
   * Enabled by default for the `panel` variant.
   */
  scrollable?: boolean;
}

/**
 * Measures the active tab element (`[aria-selected="true"]`) relative to
 * its container and returns the rect, or `null` if none is found.
 */
function measureActiveTab(container: HTMLElement): IndicatorRect | null {
  const active = container.querySelector<HTMLElement>('[aria-selected="true"]');
  if (!active) return null;

  return {
    height: active.offsetHeight,
    left: active.offsetLeft,
    top: active.offsetTop,
    width: active.offsetWidth,
  };
}

/**
 * Horizontal tab list container. Renders `role="tablist"` so screen readers
 * announce the group. Pair with `TabItem` children.
 *
 * Pass `animated` to enable a sliding indicator (background + underline)
 * that transitions smoothly when the active tab changes.
 *
 * The `panel` variant scrolls horizontally by default; `nav` does not.
 */
export default function Tabs({
  animated = false,
  children,
  className,
  label,
  scrollable,
  variant = 'panel',
  ...rest
}: TabsProps) {
  const shouldScroll = scrollable ?? variant === 'panel';
  const listRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [hasTransitioned, setHasTransitioned] = useState(false);

  const sync = useCallback(() => {
    if (!listRef.current) return;
    const next = measureActiveTab(listRef.current);
    setRect((prev) => {
      if (!prev) return next;
      if (
        next &&
        prev.left === next.left &&
        prev.width === next.width &&
        prev.top === next.top &&
        prev.height === next.height
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!animated || !listRef.current) return;

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(listRef.current, {
      attributes: true,
      attributeFilter: ['aria-selected'],
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(sync);
    resizeObserver.observe(listRef.current);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, [animated, sync]);

  useEffect(() => {
    if (!rect || hasTransitioned) return;
    const id = requestAnimationFrame(() => setHasTransitioned(true));
    return () => cancelAnimationFrame(id);
  }, [rect, hasTransitioned]);

  return (
    <div
      className={cn(shouldScroll && 'overflow-x-auto overflow-y-hidden', className)}
      role="tablist"
      aria-label={label}
      {...rest}
    >
      <TabsContext.Provider value={{ animated, variant: variant ?? 'panel' }}>
        <div ref={listRef} className={cn(tabsListVariants({ variant }), animated && 'relative')}>
          {animated && rect ? (
            <TabsIndicator
              animate={hasTransitioned}
              rect={rect}
              variant={variant ?? 'panel'}
            />
          ) : null}
          {children}
        </div>
      </TabsContext.Provider>
    </div>
  );
}
