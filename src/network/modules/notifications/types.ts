import type { InAppNotificationTypeName } from '@/network/modules/notifications/constants';

export type ListNotificationsParams = {
  page_size?: number;
};

export type InAppNotificationResponse = {
  delivery_id: number;
  notification_id: number;
  type: InAppNotificationTypeName | (string & {});
  payload: Record<string, unknown>;
  created_at: string;
  read_at?: string;
  title?: string;
  body?: string;
};

export type InAppNotificationPage = {
  items: InAppNotificationResponse[];
  next_cursor?: string;
};
