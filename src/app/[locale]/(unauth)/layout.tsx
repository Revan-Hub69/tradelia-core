import '@/styles/landing.css';

export default async function UnauthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await props.params;

  return <>{props.children}</>;
}
