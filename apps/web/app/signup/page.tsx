'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AuthPageLayout from '@/src/components/auth/AuthPageLayout';
import Text from '@/src/components/typography/Text';
import { useAuth } from '@/src/hooks/global/useAuth';

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthPageLayout heading="Create an account" switchLabel="Or log in" loading={isLoading}>
      <div className="flex flex-col items-center gap-2">
        <Text size="sm" color="secondary" className="text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-main hover:text-accent-red font-semibold">
            Log in
          </Link>
        </Text>
        <Text size="xs" color="tertiary" className="text-center">
          By continuing you agree to the{' '}
          <Link href="/terms" className="text-emerald-main hover:text-accent-red font-semibold">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-emerald-main hover:text-accent-red font-semibold">
            Privacy Policy
          </Link>
          .
        </Text>
      </div>
    </AuthPageLayout>
  );
}
