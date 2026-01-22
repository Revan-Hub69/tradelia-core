import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - Tradelia',
  description: 'The requested page could not be found.',
};

/**
 * Root Layout for Global 404 Pages
 * 
 * This layout is required for the root not-found.tsx page
 * to prevent Next.js build errors about missing root layouts.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}