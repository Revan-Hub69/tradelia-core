import { UserDataProvider } from '@/providers/UserDataProvider';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // params is awaited but not used in this layout
  await props.params;
  
  return (
    <UserDataProvider>
      {props.children}
    </UserDataProvider>
  );
}
