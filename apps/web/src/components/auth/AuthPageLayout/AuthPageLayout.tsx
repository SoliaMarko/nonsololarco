'use client';

import { ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import LoginFooter from '@/src/components/auth/LoginFooter';
import LoginHero from '@/src/components/auth/LoginHero';
import OAuthButton from '@/src/components/auth/OAuthButton';
import ThemeToggle from '@/src/components/shared/ThemeToggle';
import Divider from '@/src/components/ui/Divider';
import Spinner from '@/src/components/ui/Spinner';
import { GithubIcon, GoogleIcon } from '@/src/icons/brand';
import { API_URL } from '@/src/lib/api/client';
import { ORIENTATION } from '@/src/lib/constants/common.const';
import { cn } from '@/src/utils/cn';

export interface AuthPageLayoutProps {
  /** Bottom section below OAuth buttons (links to the other auth page, terms, etc.) */
  children: ReactNode;
  /** Divider label above the OAuth buttons */
  heading: string;
  /** Show a spinner overlay on top of the card content while loading. */
  loading?: boolean;
  /** Divider label between buttons and bottom section */
  switchLabel: string;
}

export default function AuthPageLayout({
  children,
  heading,
  loading,
  switchLabel,
}: AuthPageLayoutProps) {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  return (
    <div
      className={cn(
        'pli-4 plb-8 bg-btn-fill relative flex min-h-dvh w-full flex-col items-center justify-center',
        'border-border-primary shadow-[4px_4px_0px_0px_var(--border-primary)] xl:border-t-[2.5px] xl:border-l-[2.5px]',
      )}
    >
      <div className="flex w-full max-w-lg flex-col">
        <div className="border-primary-dark bg-card relative flex flex-col overflow-hidden border-[3px] shadow-[4px_4px_0px_0px_var(--color-primary-dark)]">
          <ThemeToggle className="absolute top-4 right-4 hidden sm:inline-flex" />

          <LoginHero />

          <div className="relative">
            {loading && (
              <div className="bg-card/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px]">
                <Spinner size="lg" label={tCommon('status.loading')} />
              </div>
            )}

            <div className="pli-8 plb-8 flex flex-col gap-5">
              <Divider
                orientation={ORIENTATION.horizontal}
                label={heading}
                color="tertiary"
                thickness={1}
                labelClassName="font-mono text-[10px] font-bold tracking-widest uppercase"
              />

              <div className="flex gap-3 sm:flex-col">
                <OAuthButton
                  href={`${API_URL}/auth/google`}
                  icon={<GoogleIcon />}
                  label={t('login.continueWithGoogle')}
                />
                <OAuthButton
                  href={`${API_URL}/auth/github`}
                  icon={<GithubIcon />}
                  label={t('login.continueWithGithub')}
                />
              </div>

              <Divider
                orientation={ORIENTATION.horizontal}
                label={switchLabel}
                color="tertiary"
                thickness={1}
                labelClassName="font-mono text-[10px] font-bold tracking-widest uppercase"
              />

              {children}
            </div>
          </div>

          <LoginFooter />
        </div>

        <p className="text-fg-tertiary mbs-5 text-center font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
          {tCommon('tagline')}
        </p>
      </div>
    </div>
  );
}
