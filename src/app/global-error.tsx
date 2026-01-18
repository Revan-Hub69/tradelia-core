'use client';

import NextError from 'next/error';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  params?: { locale?: string };
}) {
  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error:', props.error);
  }

  // Fallback to 'en' if locale is not available
  const locale = props.params?.locale || 'en';

  return (
    <html lang={locale}>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
