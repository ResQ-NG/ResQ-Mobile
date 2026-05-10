export const InAppNotificationTypes = {
  ContactJoined: 'contact_joined',
  ReportUpdate: 'report_update',
  WatchMeCreated: 'watch_me_created',
  ContactAdded: 'contact_added',
} as const;

export type InAppNotificationTypeName =
  (typeof InAppNotificationTypes)[keyof typeof InAppNotificationTypes];

export const IN_APP_NOTIFICATION_TYPE_LABEL: Record<InAppNotificationTypeName, string> = {
  contact_joined: 'Contact joined',
  report_update: 'Report update',
  watch_me_created: 'Watch Me created',
  contact_added: 'Contact added',
};
