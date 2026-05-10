import type { ComponentType } from 'react';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarBellBingBoldIcon from '@/components/icons/solar/bell-bing-bold';
import type { InAppNotificationTypeName } from '@/network/modules/notifications/constants';

type IconComponent = ComponentType<{ width: number; height: number; color: string }>;

export function getNotificationTypeIcon(
  type: InAppNotificationTypeName | string
): IconComponent {
  switch (type) {
    case 'contact_joined':
    case 'contact_added':
      return SolarUsersGroupRoundedBoldIcon;
    case 'report_update':
      return SolarBellBingBoldIcon;
    case 'watch_me_created':
      return SolarMapPointBoldIcon;
    default:
      return SolarBellBingBoldIcon;
  }
}

