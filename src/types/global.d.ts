// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');

// Namespace messages (modular translation system)
type DashboardMessages = typeof import('../../messages/en/dashboard.json');
type CommonMessages = typeof import('../../messages/en/common.json');
type DashboardSettingsMessages = typeof import('../../messages/en/dashboard-settings.json');

// Merge all message types
type AllMessages = Messages & {
  Dashboard: DashboardMessages;
  Common: CommonMessages;
  'DashboardSettings': DashboardSettingsMessages;
};

// eslint-disable-next-line ts/consistent-type-definitions
declare interface IntlMessages extends AllMessages {}
