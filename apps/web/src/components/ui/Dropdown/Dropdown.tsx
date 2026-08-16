import { ElementType, Fragment, ReactNode } from 'react';

import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { VariantProps } from 'class-variance-authority';

import { CheckSolidIcon } from '@/src/icons/base';
import { OPTIONS_POSITION } from '@/src/lib/constants/common.const';
import { OptionsPositionType } from '@/src/lib/types/common.types';
import { dropdownItemVariants } from '@/src/lib/variants/dropdown-item.variants';
import { cn } from '@/src/utils/cn';

type DropdownVariantProps = VariantProps<typeof dropdownItemVariants>;

type DropdownItemBase = DropdownVariantProps & {
  disabled?: boolean;
  icon?: ElementType;
  label: string;
  /**
   * Arbitrary ReactNode rendered before the label — use when the leading
   * visual is a parameterised element (e.g. a locale stamp) rather than a
   * plain icon. Mutually exclusive with `icon`; if both are provided,
   * `leadingContent` wins.
   */
  leadingContent?: ReactNode;
  /** When true, renders a checkmark on the trailing edge. Useful for sort/view pickers. */
  selected?: boolean;
};

type DropdownItemWithClick = DropdownItemBase & {
  href?: never;
  onClick: () => void;
};

type DropdownItemWithHref = DropdownItemBase & {
  href: string;
  onClick?: never;
};

export type DropdownItem = DropdownItemWithClick | DropdownItemWithHref;

export type DropdownGroup = {
  items: DropdownItem[];
  /** Optional label rendered above the group in uppercase monospace. */
  label?: string;
  /**
   * When `'single'`, items render as `RadioItem` inside a `RadioGroup`,
   * exposing `menuitemradio` role and `aria-checked` to assistive technology.
   * Use for mutually exclusive choices (locale picker, sort order).
   */
  selectionMode?: 'single';
};

export type DropdownVariant = 'default' | 'stamp';

export interface DropdownProps {
  align?: OptionsPositionType;
  className?: string;
  /** Groups of items — groups are separated by a dotted divider */
  groups: DropdownGroup[];
  /** Which side of the trigger the menu opens on. Defaults to `"bottom"`. */
  side?: 'bottom' | 'top';
  /** Trigger element — button, avatar, icon, anything */
  trigger: ReactNode;
  /**
   * Visual variant.
   * - `"default"` — rounded card with subtle shadow (profile menus, context actions)
   * - `"stamp"` — sharp-cornered retro card with 4 px offset shadow and dotted
   *   dividers between items, matching the postage-stamp aesthetic (locale
   *   switcher, avatar menu)
   */
  variant?: DropdownVariant;
}

/* ---------- content wrapper ---------- */

const CONTENT_CLASS: Record<DropdownVariant, string> = {
  default: cn(
    'bg-card border-edge z-dropdown w-fit min-w-40 rounded-lg border',
    'shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
  ),
  stamp: cn(
    'bg-control-surface border-fg-primary z-dropdown w-fit min-w-[14.75rem] border-2',
    'shadow-[4px_4px_0_0_var(--color-primary-dark)]',
  ),
};

const ANIMATE_CLASS =
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95';

/* ---------- group label ---------- */

const LABEL_CLASS: Record<DropdownVariant, string> = {
  default:
    'text-fg-tertiary font-label pli-3 plb-2 pbs-3 text-[0.625rem] font-bold uppercase tracking-widest select-none',
  stamp:
    'text-fg-tertiary font-label pli-3 pbs-2 pbe-[6px] text-[0.625rem] font-bold uppercase tracking-[0.18em] select-none border-be border-dotted border-edge',
};

/* ---------- separator ---------- */

const SEPARATOR_CLASS: Record<DropdownVariant, string> = {
  default: 'border-edge mlb-1 border-bs border-dotted',
  stamp: 'border-edge border-bs border-dotted',
};

/* ---------- item ---------- */

function itemClass(variant: DropdownVariant, item: DropdownItem, hasLabel: boolean): string {
  if (variant === 'stamp') {
    return cn(
      'flex items-center gap-[10px] w-full pli-3 plb-[9px] cursor-pointer outline-none select-none',
      'font-prose text-[0.875rem] text-fg-primary',
      'border-be border-dotted border-edge last:border-be-0',
      'data-highlighted:bg-control-surface-hover',
      'data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
      item.selected && 'font-semibold',
    );
  }

  const cvVariant = item.variant ?? 'default';
  return cn(
    dropdownItemVariants({ variant: cvVariant }),
    item.selected && 'text-fg-primary font-semibold',
    hasLabel && 'first:pbs-2 first:rounded-ss-none first:rounded-se-none',
  );
}

/* ---------- checkmark ---------- */

function Checkmark({ variant }: { variant: DropdownVariant }) {
  if (variant === 'stamp') {
    return (
      <span className="font-label text-emerald-main mis-auto text-xs" aria-hidden="true">
        ✓
      </span>
    );
  }
  return <CheckSolidIcon size={16} className="text-emerald-main mis-auto shrink-0" aria-hidden="true" />;
}

/**
 * Floating action menu built on Radix UI DropdownMenu.
 *
 * Two visual variants:
 * - `"default"` — rounded card with subtle shadow (profile menus, action lists)
 * - `"stamp"` — sharp-cornered retro card with offset shadow and dotted
 *   dividers, matching the project's postage-stamp aesthetic
 *
 * Both variants support grouped items with optional group labels,
 * `leadingContent` / `icon`, selected checkmarks, and `onClick` / `href`.
 *
 * @example
 * <Dropdown
 *   variant="stamp"
 *   trigger={<button>UK ▼</button>}
 *   groups={[{
 *     label: 'Interface language',
 *     items: [
 *       { label: 'English', leadingContent: <LocaleStamp locale="en" />, onClick: pick, selected: true },
 *     ],
 *   }]}
 * />
 */
function Dropdown({
  align = OPTIONS_POSITION.end,
  className,
  groups,
  side = 'bottom',
  trigger,
  variant = 'default',
}: DropdownProps) {
  return (
    /**
     * `modal={false}` is deliberate: the modal mode locks body scroll and
     * compensates for the scrollbar with padding, which fights the global
     * `scrollbar-gutter: stable` and makes the page jump on open.
     */
    <RadixDropdown.Root modal={false}>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          side={side}
          sideOffset={6}
          className={cn(CONTENT_CLASS[variant], ANIMATE_CLASS, className)}
        >
          {groups.map((group, groupIndex) => {
            const hasLabel = !!group.label;
            const isRadio = group.selectionMode === 'single';
            const selectedValue = isRadio
              ? group.items.find((i) => i.selected)?.label ?? ''
              : '';

            const renderedItems = group.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const cls = itemClass(variant, item, hasLabel);
              const leading = item.leadingContent ?? (Icon ? <Icon size={15} aria-hidden="true" /> : null);

              if (item.href) {
                return (
                  <RadixDropdown.Item key={itemIndex} asChild disabled={item.disabled}>
                    <a href={item.href} className={cls}>
                      {leading}
                      {item.label}
                      {item.selected ? <Checkmark variant={variant} /> : null}
                    </a>
                  </RadixDropdown.Item>
                );
              }

              if (isRadio) {
                return (
                  <RadixDropdown.RadioItem
                    key={itemIndex}
                    className={cls}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                    value={item.label}
                  >
                    {leading}
                    {item.label}
                    {item.selected ? <Checkmark variant={variant} /> : null}
                  </RadixDropdown.RadioItem>
                );
              }

              return (
                <RadixDropdown.Item key={itemIndex} className={cls} disabled={item.disabled} onSelect={item.onClick}>
                  {leading}
                  {item.label}
                  {item.selected ? <Checkmark variant={variant} /> : null}
                </RadixDropdown.Item>
              );
            });

            return (
              <Fragment key={groupIndex}>
                {groupIndex > 0 ? <RadixDropdown.Separator className={SEPARATOR_CLASS[variant]} /> : null}

                {group.label ? (
                  <RadixDropdown.Label className={LABEL_CLASS[variant]}>{group.label}</RadixDropdown.Label>
                ) : null}

                {isRadio ? (
                  <RadixDropdown.RadioGroup value={selectedValue}>
                    {renderedItems}
                  </RadixDropdown.RadioGroup>
                ) : (
                  renderedItems
                )}
              </Fragment>
            );
          })}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export default Dropdown;
