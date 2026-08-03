'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthPageLayout from '@/src/components/auth/AuthPageLayout';
import Text from '@/src/components/typography/Text';
import { useAuth } from '@/src/hooks/global/useAuth';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthPageLayout heading="Sign in to continue" switchLabel="Or sign up" loading={isLoading}>
      <div className="flex flex-col items-center gap-2">
        <Text size="sm" color="secondary" className="text-center">
          New to nonsololarco?{' '}
          <Link href="/signup" className="text-emerald-main hover:text-accent-red font-semibold">
            Create an account
          </Link>
        </Text>
        <Text size="xs" color="tertiary" className="text-center">
          By continuing you agree to the{' '}
          <Link href="/terms" className="text-emerald-main hover:text-accent-red">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-emerald-main hover:text-accent-red">
            Privacy Policy
          </Link>
          .
        </Text>
      </div>
    </AuthPageLayout>
  );
}
