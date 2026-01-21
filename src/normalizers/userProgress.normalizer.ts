import type {
  CompleteUserDataNormalized,
  CompleteUserDataRaw,
  UserProgressNormalized,
  UserProgressRaw,
} from '@/contracts/userProgress.contract';

export function normalizeUserProgress(
  raw: UserProgressRaw | null | undefined,
): UserProgressNormalized {
  const today = new Date().toISOString().split('T')[0]!;

  return {
    total_xp: raw?.total_xp ?? 0,
    level: raw?.level ?? 1,
    current_streak: raw?.current_streak ?? 0,
    longest_streak: raw?.longest_streak ?? 0,
    last_activity_date: raw?.last_activity_date ?? today,
  };
}

export function normalizeCompleteUserData(
  raw: CompleteUserDataRaw | null | undefined,
): CompleteUserDataNormalized {
  return {
    profile: {
      name: raw?.profile?.name ?? 'Utente',
    },
    progress: normalizeUserProgress(raw?.progress),
    completions: raw?.completions ?? [],
    badges: raw?.badges ?? [],
  };
}
