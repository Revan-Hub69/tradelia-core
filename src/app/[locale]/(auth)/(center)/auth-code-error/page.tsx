'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

const AuthCodeErrorPage = () => {
  const t = useTranslations('AuthError');

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-6 text-center">
      <div className="space-y-4">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="size-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          {t('title')}
        </h1>

        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>

      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/sign-in">
            {t('try_again')}
          </Link>
        </Button>

        <Button variant="outline" asChild className="w-full">
          <Link href="/">
            {t('back_home')}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AuthCodeErrorPage;
