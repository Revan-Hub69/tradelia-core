import { EnterpriseRuntimeClient } from '@/components/runtime/EnterpriseRuntimeClient';
import { UserDataProvider } from '@/providers/UserDataProvider';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  await props.params;

  return (
    <EnterpriseRuntimeClient>
      <UserDataProvider>{props.children}</UserDataProvider>
    </EnterpriseRuntimeClient>
  );
}
