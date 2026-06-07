import { ElementType, Fragment, ReactNode } from 'react';

import * as RadixDropdown from '@radix-ui/react-dropdown-menu';
import { VariantProps } from 'class-variance-authority';

import { OPTIONS_POSITION } from '@/src/lib/constants/common.const';
import { OptionsPositionType } from '@/src/lib/types/common.types';
import { cn } from '@/src/lib/ui/utils/cn';
import { dropdownItemVariants } from '@/src/lib/ui/variants/dropdown-item.variants';

type DropdownVariantProps = VariantProps<typeof dropdownItemVariants>;

type DropdownItemBase = DropdownVariantProps & {
  disabled?: boolean;
  icon?: ElementType;
  label: string;
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
};

export interface DropdownProps {
  align?: OptionsPositionType;
  className?: string;
  /** Groups of items — groups are separated by a dotted divider */
  groups: DropdownGroup[];
  /** Trigger element — button, avatar, icon, anything */
  trigger: ReactNode;
}

/**
 * Floating action menu built on Radix UI DropdownMenu.
 * Supports icon items, danger variant, links and click handlers.
 * Groups are separated by dotted dividers.
 *
 * @example
 * <Dropdown
 *   trigger={<AvatarButton initials="SM" size="sm" />}
 *   groups={[
 *     { items: [
 *       { label: 'View profile', icon: UserIcon, href: '/profile/me' },
 *       { label: 'Settings', icon: SettingsIcon, href: '/settings' },
 *     ]},
 *     { items: [
 *       { label: 'Sign out', icon: LogoutIcon, onClick: signOut, variant: 'danger' },
 *     ]},
 *   ]}
 * />
 */
function Dropdown({ trigger, groups, align = OPTIONS_POSITION.end, className }: DropdownProps) {
  return (
    <RadixDropdown.Root>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>

      <RadixDropdown.Portal>
        <RadixDropdown.Content
          align={align}
          sideOffset={6}
          className={cn(
            'bg-card border-edge z-50 w-fit min-w-40 rounded-lg border',
            'shadow-[0_4px_16px_rgba(0,0,0,0.3)]',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            className,
          )}
        >
          {groups.map((group, groupIndex) => (
            <Fragment key={groupIndex}>
              {groupIndex > 0 ? (
                <RadixDropdown.Separator className="border-t-edge mlb-1 border-t border-dotted" />
              ) : null}

              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const variant = item.variant ?? 'default';
                const itemClass = cn(dropdownItemVariants({ variant }));
                if (item.href) {
                  return (
                    <RadixDropdown.Item key={itemIndex} asChild disabled={item.disabled}>
                      <a href={item.href} className={itemClass}>
                        {Icon ? <Icon size={15} aria-hidden="true" /> : null}
                        {item.label}
                      </a>
                    </RadixDropdown.Item>
                  );
                }

                return (
                  <RadixDropdown.Item
                    key={itemIndex}
                    className={itemClass}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                  >
                    {Icon ? <Icon size="15" aria-hidden="true" /> : null}
                    {item.label}
                  </RadixDropdown.Item>
                );
              })}
            </Fragment>
          ))}
        </RadixDropdown.Content>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
}

export default Dropdown;
