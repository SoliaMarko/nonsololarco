import { useTranslations } from 'next-intl';

import Logo from '@/components/ui/Logo';
import AiButton from '@/src/components/repertoire/buttons/AiButton';
import ThemeToggle from '@/src/components/shared/ThemeToggle';
import Heading from '@/src/components/typography/Heading';
import AvatarButton from '@/src/components/ui/AvatarButton';
import Dropdown from '@/src/components/ui/Dropdown';
import NavLink from '@/src/components/ui/NavLink';
import Tabs from '@/src/components/ui/Tabs';
import { useAuth } from '@/src/hooks/global/useAuth';
import { BellIcon, LogOutIcon, ProfileOutlineIcon, SettingsOutlineIcon } from '@/src/icons/base';
import { NAV_ITEMS, OPTIONS_POSITION } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

import { Link, usePathname } from '@/i18n/navigation';

export interface AppHeaderNavProps {
  activePath: string;
  activeTitle?: string;
  className?: string;
}

export default function AppHeader({ activePath, activeTitle, className }: AppHeaderNavProps) {
  const { user, logout } = useAuth();
  const t = useTranslations('common');

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '??';

  const pathname = usePathname();

  const isRepertoirePageActive = pathname === '/repertoire';

  return (
    <header
      className={cn(
        'md:z-header top-0 w-full md:sticky',
        'border-border-primary bg-dots-subtle bg-surface border-b',
        className,
      )}
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="mli-auto pli-4 flex h-14 items-center justify-between gap-6 sm:gap-10">
        <Link href="/">
          <div className="hidden shrink-0 items-center lg:flex">
            <Logo variant="wordmark" size="md" />
          </div>
          <div className="flex shrink-0 items-center lg:hidden">
            <Logo variant="mark" size="sm" />
          </div>
        </Link>

        <nav className="hidden flex-1 self-end md:flex" aria-label="Main Nav">
          <Tabs animated variant="nav" scrollable={false}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.labelKey)}
                badge={item.badge}
                variant="desktop"
                isActive={activePath === item.href}
              />
            ))}
          </Tabs>
        </nav>

        <div
          className={cn(
            'flex items-center gap-4',
            activeTitle ? 'xs:w-full flex-row justify-between md:w-auto' : 'mis-auto',
          )}
        >
          {activeTitle ? (
            <Heading className="xs:block hidden text-lg uppercase md:hidden" tag="h1">
              {activeTitle}
            </Heading>
          ) : null}

          <div className="flex gap-3 md:gap-4">
            {isRepertoirePageActive ? (
              <AiButton className="bg-yellow-main md:hidden" textClassName="text-primary-dark" />
            ) : null}

            <ThemeToggle />
            <Dropdown
              align={OPTIONS_POSITION.end}
              groups={[
                {
                  items: [
                    { label: t('nav.viewProfile'), icon: ProfileOutlineIcon, href: '/profile' },
                    { label: t('nav.settings'), icon: SettingsOutlineIcon, href: '/settings' },
                    { label: t('nav.notifications'), icon: BellIcon, href: '/notifications' },
                  ],
                },
                {
                  items: [
                    { label: t('nav.signOut'), icon: LogOutIcon, onClick: logout, variant: 'danger' },
                  ],
                },
              ]}
              trigger={<AvatarButton initials={initials} frame="portrait" />}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
