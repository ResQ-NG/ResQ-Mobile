import {
  createApiMutation,
  createCursorInfiniteApiQuery,
} from '@/network/config/api-client';
import { NotificationsRoutes } from '@/network/modules/notifications/routes';
import { NotificationsKeys } from '@/network/modules/notifications/keys';
import type { InAppNotificationResponse } from '@/network/modules/notifications/types';

export type ListNotificationsParams = {
  page_size?: number;
};

export const useInAppNotificationsInfinite = createCursorInfiniteApiQuery<
  ListNotificationsParams,
  InAppNotificationResponse
>({
  endpoint: NotificationsRoutes.List,
  operationName: 'List In-App Notifications',
  queryKey: [NotificationsKeys.List],
  cursorParamKey: 'cursor',
  transformResponse: (item) => item as InAppNotificationResponse,
});

export const useMarkAsRead = createApiMutation<
  { delivery_id: string },
  unknown
>({
  endpoint: (vars) => NotificationsRoutes.MarkAsRead(String(vars.delivery_id)),
  operationName: 'Mark As Read',
  method: 'patch',
  suppressSuccessMessage: true,
  suppressErrorMessage: true,
  invalidateQueries: [[NotificationsKeys.List]],
});
