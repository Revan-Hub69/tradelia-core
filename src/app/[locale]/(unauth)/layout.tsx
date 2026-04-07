import '@/styles/landing.css';

import { ScrollProgressBar } from '@/templates/ScrollProgressBar';

export default async function UnauthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await props.params;

  return (
    <>
      {/* iOS 26 scroll progress — client boundary isolato */}
      <ScrollProgressBar />
      {props.children}
    </>
  );
}
