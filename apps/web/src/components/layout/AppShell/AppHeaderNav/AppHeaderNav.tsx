import { useEffect, useState } from 'react';

import Logo from '@/components/ui/Logo';
import AvatarButton from '@/src/components/ui/AvatarButton';
import Button from '@/src/components/ui/Button';
import Dropdown from '@/src/components/ui/Dropdown';
import NavLink from '@/src/components/ui/NavLink';
import { MOCK_PROFILE } from '@/src/data/profile/profile.mock';
import { useTheme } from '@/src/hooks/global/useTheme';
import {
  BellIcon,
  LogOutIcon,
  MoonOutlineIcon,
  ProfileOutlineIcon,
  SettingsOutlineIcon,
  SunOutlineIcon,
} from '@/src/icons/base';
import { NAV_ITEMS, OPTIONS_POSITION, THEME } from '@/src/lib/constants/common.const';
import { cn } from '@/src/lib/ui/utils/cn';

export interface AppHeaderNavProps {
  activePath: string;
  className?: string;
}

export default function AppHeader({ activePath, className }: AppHeaderNavProps) {
  const profile = MOCK_PROFILE;

  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      className={cn(
        'md:z-header top-0 w-full md:sticky',
        'border-border-primary bg-dots-subtle border-b',
        className,
      )}
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="mli-auto pli-4 flex h-14 items-center gap-10">
        <div className="hidden shrink-0 items-center lg:flex">
          <Logo variant="wordmark" size="md" />
        </div>
        <div className="flex shrink-0 items-center lg:hidden">
          <Logo variant="mark" size="sm" />
        </div>

        <nav className="hidden flex-1 items-end gap-1 self-end md:flex" aria-label="Main Nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              variant="desktop"
              isActive={activePath === item.href}
            />
          ))}
        </nav>

        <div className="mis-auto flex items-center gap-4">
          <Button
            aria-label={
              mounted
                ? theme === THEME.dark
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
                : 'Toggle theme'
            }
            className="bg-base size-10 rounded-full border-2 p-0"
            onClick={toggleTheme}
            variant="press"
          >
            {mounted ? (
              theme === THEME.dark ? (
                <SunOutlineIcon size={20} />
              ) : (
                <MoonOutlineIcon size={20} />
              )
            ) : (
              <SunOutlineIcon size={20} aria-hidden />
            )}
          </Button>
          <Dropdown
            align={OPTIONS_POSITION.end}
            groups={[
              {
                items: [
                  { label: 'View profile', icon: ProfileOutlineIcon, href: '/profile' },
                  { label: 'Settings', icon: SettingsOutlineIcon, href: '/settings' },
                  { label: 'Notifications', icon: BellIcon, href: '/notifications' },
                ],
              },
              {
                items: [
                  { label: 'Sign out', icon: LogOutIcon, onClick: () => {}, variant: 'danger' },
                ],
              },
            ]}
            trigger={<AvatarButton initials={profile.initials} />}
          />
        </div>
      </div>
    </header>
  );
}
