// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');

// Namespace messages (modular translation system)
type CommonMessages = typeof import('../../messages/en/common.json');
type DashboardSettingsMessages = typeof import('../../messages/en/dashboard-settings.json');
type ContactMessages = typeof import('../../messages/en/contact.json');

// Merge all message types
type AllMessages = Messages & {
  Common: CommonMessages;
  'DashboardSettings': DashboardSettingsMessages;
  Contact: ContactMessages;
};

// eslint-disable-next-line ts/consistent-type-definitions
declare interface IntlMessages extends AllMessages {}
