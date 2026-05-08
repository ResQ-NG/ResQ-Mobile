const VersionAlias = 'v1';
const NotificationsAlias = 'notifications';

export const NotificationsRoutes = {
    List: `${VersionAlias}/${NotificationsAlias}/in-app`,
    MarkAsRead: (delivery_id: string) => `${VersionAlias}/${NotificationsAlias}/in-app/${delivery_id}/read`,
} as const;
