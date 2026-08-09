import { type ButtonHTMLAttributes, type ReactNode } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';

import { tabItemVariants } from '@/src/lib/variants/tabs.variants';
import { cn } from '@/src/utils/cn';

import { useTabsContext } from '../TabsContext';

type TabItemVariantProps = VariantProps<typeof tabItemVariants>;

export interface TabItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    TabItemVariantProps {
  /**
   * When true, merges props onto the immediate child element instead of
   * rendering a `<button>`. Use this to render a `<Link>` or any other
   * element as the tab trigger.
   */
  asChild?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Individual tab trigger inside a `Tabs` list.
 *
 * Renders a `<button>` by default. Pass `asChild` to delegate rendering to a
 * child element (e.g. Next.js `<Link>`), which receives the tab's styling and
 * aria attributes via Radix `Slot`.
 *
 * When the parent `Tabs` has `animated` enabled, the active border and
 * background are suppressed — the sliding indicator handles them instead.
 */
export default function TabItem({
  asChild = false,
  children,
  className,
  isActive = false,
  variant: variantProp,
  ...rest
}: TabItemProps) {
  const ctx = useTabsContext();
  const variant = variantProp ?? ctx.variant ?? 'panel';
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      role="tab"
      aria-selected={isActive ?? false}
      className={cn(
        tabItemVariants({ variant, isActive }),
        ctx.animated && 'relative z-[1] border-b-transparent bg-transparent',
        ctx.animated && isActive && 'text-fg-primary',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
