const VersionAlias = 'v1';
const NotificationsAlias = 'notifications';

export const NotificationsRoutes = {
    List: `${VersionAlias}/${NotificationsAlias}`,
    MarkAsRead: (notificationId: string) => `${VersionAlias}/${NotificationsAlias}/${notificationId}/read`,
} as const;
