import { TouchableOpacity, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import type { InAppNotificationResponse } from '@/network/modules/notifications/types';
import { formatRelativeTime } from '@/lib/utils/datetime';
import {
  IN_APP_NOTIFICATION_TYPE_LABEL,
  type InAppNotificationTypeName,
} from '@/network/modules/notifications/constants';
import { getNotificationTypeIcon } from '@/components/notifications/NotificationTypeIcon';

function pickPayloadPreview(payload: Record<string, unknown>): string | null {
  for (const k of ['title', 'message', 'body', 'text', 'description'] as const) {
    const v = payload[k];
    if (typeof v === 'string' && v.trim().length > 0) return v.trim();
  }
  return null;
}

export function NotificationCard({
  item,
  onPress,
}: {
  item: InAppNotificationResponse;
  onPress?: () => void;
}) {
  const isRead = Boolean(item.read_at);
  const title =
    item.title?.trim() ||
    (IN_APP_NOTIFICATION_TYPE_LABEL[item.type as InAppNotificationTypeName] ??
      item.type);
  const body = item.body?.trim() || pickPayloadPreview(item.payload);
  const TypeIcon = getNotificationTypeIcon(
    (item.type as InAppNotificationTypeName) || 'report_update'
  );

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="px-6"
      accessibilityRole="button"
      accessibilityLabel={`Notification ${item.type}`}
    >
      <View
        className={`rounded-2xl overflow-hidden border px-4 py-4 ${
          isRead
            ? 'bg-surface-light dark:bg-surface-dark border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.12)]'
            : 'bg-white dark:bg-[#141414] border-[rgba(37,99,235,0.22)] dark:border-[rgba(37,99,235,0.28)]'
        }`}
      >
        <View className="flex-row items-start gap-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isRead
                ? 'bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.10)]'
                : 'bg-transparent border border-[rgba(37,99,235,0.40)] dark:border-[rgba(37,99,235,0.45)]'
            }`}
          >
            <TypeIcon width={20} height={20} color={isRead ? '#9ca3af' : '#93c5fd'} />
          </View>

          <View className="flex-1 min-w-0">
            <View className="flex-row items-center justify-between gap-3">
              <AppText className="font-metropolis-semibold flex-1" numberOfLines={1}>
                {title}
              </AppText>
              <View
                className={`w-2 h-2 rounded-full ${
                  isRead ? 'bg-[#d1d5db] dark:bg-[#404040]' : 'bg-[#ef4444]'
                }`}
              />
            </View>

            {body ? (
              <AppText className="mt-2" numberOfLines={2}>
                {body}
              </AppText>
            ) : null}

            <View className="flex-row items-center justify-between mt-3">
              <AppText variant="caption">{formatRelativeTime(item.created_at)}</AppText>
              <AppText
                variant="caption"
                className="text-captionDark dark:text-captionDark-dark"
              >
                {isRead ? 'Read' : 'New'}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
