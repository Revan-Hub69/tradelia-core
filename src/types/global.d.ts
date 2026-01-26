// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');

// Namespace messages (modular translation system)
type CommonMessages = typeof import('../../messages/en/common.json');
type DashboardSettingsMessages = typeof import('../../messages/en/dashboard-settings.json');
type ContactMessages = typeof import('../../messages/en/contact.json');
type ChallengesMessages = typeof import('../../messages/en/challenges.json');
type MyChallengesMessages = typeof import('../../messages/en/my-challenges.json');
type SignalsMessages = typeof import('../../messages/en/signals.json');

// Merge all message types
type AllMessages = Messages & {
  Common: CommonMessages;
  DashboardSettings: DashboardSettingsMessages;
  Contact: ContactMessages;
  Challenges: ChallengesMessages;
  MyChallenges: MyChallengesMessages;
  Signals: SignalsMessages;
};

// eslint-disable-next-line ts/consistent-type-definitions
declare interface IntlMessages extends AllMessages {}
