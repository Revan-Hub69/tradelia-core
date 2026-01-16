'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { createClient } from '@/libs/supabase/client';

const UserProfilePage = () => {
  const t = useTranslations('UserProfile');
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser({ email: currentUser.email || '', id: currentUser.id });
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="rounded-lg bg-card p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Account Information</h2>

        {user && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
            </div>

            <div className="pt-4">
              <Button variant="destructive" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfilePage;
