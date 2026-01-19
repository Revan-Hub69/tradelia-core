'use client';

import { BadgeShowcase } from '@/components/gamification/ProfessionalBadge';
import { StreakIndicator } from '@/components/gamification/StreakIndicator';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { PremiumButton } from '@/components/ui/premium-button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { useUserData } from '@/hooks/useUserData';
import { PROFESSIONAL_BADGES, type ProfessionalBadge } from '@/libs/gamification';

const DashboardIndexPage = () => {
  const { userData, isLoading } = useUserData();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={`skeleton-${i}`} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">
            Errore di autenticazione
          </h1>
          <p className="mt-2 text-muted-foreground">
            Non è stato possibile caricare i dati utente.
          </p>
        </div>
      </div>
    );
  }

  // Mock badges for demonstration (in real app, fetch from API)
  const userBadges: ProfessionalBadge[] = [
    PROFESSIONAL_BADGES.foundation_specialist,
    ...(userData.progress.completedLessons > 0 && userData.progress.badges > 1 ? [PROFESSIONAL_BADGES.methodology_expert] : []),
    ...(userData.progress.currentStreak >= 7 ? [PROFESSIONAL_BADGES.consistency_professional] : []),
  ].filter((badge): badge is ProfessionalBadge => badge !== undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Section with Gamification */}
        <div className="space-y-4">
          <TitleBar
            title={`Benvenuto, ${userData.name}!`}
            description="Continua il tuo percorso di apprendimento crypto"
          />

          {/* XP Progress */}
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
            <XPProgressBar
              totalXP={userData.progress.totalXP}
              showDetails
              size="lg"
              animated
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Lessons Completed */}
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.progress.completedLessons}
            </div>
            <div className="text-sm text-muted-foreground">Lezioni completate</div>
          </div>

          {/* Total XP */}
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {userData.progress.totalXP.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Punti XP</div>
          </div>

          {/* Current Streak */}
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {userData.progress.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Giorni consecutivi</div>
          </div>

          {/* Badges */}
          <div className="rounded-lg border bg-card p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userData.progress.badges}
            </div>
            <div className="text-sm text-muted-foreground">Certificazioni</div>
          </div>
        </div>

        {/* Gamification Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Streak & Milestones */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Streak & Traguardi</h2>
            <StreakIndicator
              currentStreak={userData.progress.currentStreak}
              longestStreak={userData.progress.currentStreak} // In real app, track separately
              lastActivityDate={new Date()}
              size="md"
              showMilestones
            />
          </div>

          {/* Badges Showcase */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Certificazioni Professionali</h2>
            {userBadges.length > 0 ? (
              <div className="space-y-4">
                <BadgeShowcase badges={userBadges} maxDisplay={6} size="lg" showCelebration={false} />
                <div className="text-sm text-muted-foreground">
                  Hai ottenuto {userBadges.length} certificazione{userBadges.length !== 1 ? 'i' : ''} professionale{userBadges.length !== 1 ? 'i' : ''}!
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="mb-2 text-4xl">�</div>
                <p>Completa le lezioni per ottenere le tue prime certificazioni professionali!</p>
              </div>
            )}
          </div>
        </div>

        {/* Learning Path Progress */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Il tuo percorso attuale</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{userData.progress.pathName}</h3>
                <p className="text-sm text-muted-foreground">
                  {userData.progress.completedLessons}
                  {' '}
                  di
                  {' '}
                  {userData.progress.totalLessons}
                  {' '}
                  lezioni completate
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {userData.progress.progressPercentage}
                  %
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full rounded-full bg-muted">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                style={{ width: `${userData.progress.progressPercentage}%` }}
              />
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <PremiumButton
                variant="primary"
                size="lg"
                className="w-full"
                glow
                icon={userData.progress.completedLessons === 0 ? '🚀' : '📚'}
                iconPosition="left"
              >
                {userData.progress.completedLessons === 0
                  ? 'Inizia il Percorso Professionale'
                  : 'Continua la Formazione'}
              </PremiumButton>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Prossimi passi</h2>
          <div className="space-y-3">
            {userData.progress.completedLessons === 0
              ? (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>Inizia con la prima lezione: "Che cos'è Bitcoin?"</span>
                  </div>
                )
              : (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <div className="size-2 rounded-full bg-primary" />
                    <span>Continua con la prossima lezione del percorso</span>
                  </div>
                )}

            <div className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
              <div className="size-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">
                Sblocca percorsi avanzati completando "Percorso Base"
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;