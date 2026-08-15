'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';

import AuthPageLayout from '@/src/components/auth/AuthPageLayout';
import Text from '@/src/components/typography/Text';
import { useAuth } from '@/src/hooks/global/useAuth';

import { Link, useRouter } from '@/i18n/navigation';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthPageLayout heading={t('login.heading')} switchLabel={t('login.switchLabel')} loading={isLoading}>
      <div className="flex flex-col items-center gap-2">
        <Text size="sm" color="secondary" className="text-center">
          {t('signup.newToNonsololarco')}{' '}
          <Link href="/signup" className="text-emerald-main hover:text-accent-red font-semibold">
            {t('login.switchLink')}
          </Link>
        </Text>
        <Text size="xs" color="tertiary" className="text-center">
          {/* TODO: create app/[locale]/terms and app/[locale]/privacy routes */}
          {tCommon('legal.agreementPrefix')}{' '}
          <Link href="/terms" className="text-emerald-main hover:text-accent-red">
            {tCommon('legal.terms')}
          </Link>{' '}
          {tCommon('legal.and')}{' '}
          <Link href="/privacy" className="text-emerald-main hover:text-accent-red">
            {tCommon('legal.privacyPolicy')}
          </Link>
          .
        </Text>
      </div>
    </AuthPageLayout>
  );
}
