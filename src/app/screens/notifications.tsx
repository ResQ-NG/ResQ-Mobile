import { FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppColorScheme } from '@/theme/colorMode';
import { AppAnimatedSafeAreaView } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import {
  useInAppNotificationsInfinite,
} from '@/network/modules/notifications/queries';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import { NotificationsHeader } from '@/components/notifications/NotificationsHeader';
import { NotificationCard } from '@/components/notifications/NotificationCard';
import { NotificationsEmptyState } from '@/components/notifications/NotificationsEmptyState';
import { useEffect } from 'react';
import { useTabBadgesStore } from '@/stores/tab-badges-store';
import { router } from 'expo-router';
import { useNotificationsMarkAsRead } from '@/network/modules/notifications/_hooks/useNotificationsMarkAsRead';

export default function NotificationsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const clearNotificationsUnread = useTabBadgesStore(
    (s) => s.removeUnreadBadgeFromNotifications
  );

  const q = useInAppNotificationsInfinite({ page_size: 20 });
  const { items } = useCursorPagination(q.data?.pages);
  const { viewabilityConfig, onViewableItemsChanged } = useNotificationsMarkAsRead({
    items,
  });

  useEffect(() => {
    clearNotificationsUnread();
  }, [clearNotificationsUnread]);

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      header={<NotificationsHeader />}
    >
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.delivery_id)}
        renderItem={({ item }) => (
          <NotificationCard
            item={item}
            onPress={() => {
              if (item.type === 'contact_joined') {
                router.push('/screens/start-watch-me/contacts');
              }
            }}
          />
        )}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
          gap: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={q.isRefetching}
            onRefresh={() => q.refetch()}
            tintColor={theme.textMuted}
          />
        }
        ListEmptyComponent={
          q.isLoading ? (
            <View className="px-6 pt-8">
              <AppText variant="caption">Loading…</AppText>
            </View>
          ) : q.isError ? (
            <View className="px-6 pt-8">
              <AppText variant="caption">Could not load notifications.</AppText>
            </View>
          ) : (
            <NotificationsEmptyState />
          )
        }
        onEndReachedThreshold={0.6}
        onEndReached={() => {
          if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
        }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListFooterComponent={
          q.isFetchingNextPage ? (
            <View className="px-6 pt-4">
              <AppText variant="caption">Loading more…</AppText>
            </View>
          ) : null
        }
      />
    </AppAnimatedSafeAreaView>
  );
}
