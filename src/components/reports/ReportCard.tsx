import { TouchableOpacity, View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarMapPointBoldIcon from '@/components/icons/solar/map-point-bold';
import SolarClockCircleBoldIcon from '@/components/icons/solar/clock-circle-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import HugeiconsArrowRight01Icon from '@/components/icons/hugeicons/arrow-right-01';

export type ReportStatus = 'pending' | 'submitted';

/** Agency handling the report; optional logo. Set requestingFeedback when they have a question for the user. */
export interface ReportAgency {
  id: string;
  name: string;
  logoUri?: string | null;
  /** When true, show a feedback icon on this agency’s chip (they have a question). */
  requestingFeedback?: boolean;
}

export interface ReportItem {
  id: string;
  /** Display file ID e.g. RESQ-2025-001234 */
  fileId: string;
  title: string;
  location: string;
  timeAgo: string;
  status: ReportStatus;
  /** Optional category for icon color; defaults to primary blue */
  category?: 'accident' | 'crime' | 'hazard' | 'other';
  /** Agencies currently attending; show with logo + name. */
  attendingAgencies?: ReportAgency[];
  /** When true, show "Feedback needed" and highlight agencies asking for feedback. */
  needsUserFeedback?: boolean;
  /** Optional cover image URI; when absent, a placeholder is shown. */
  coverImageUri?: string | null;
}

const ICON_SIZE = 22;

const CATEGORY_COLORS: Record<NonNullable<ReportItem['category']>, string> = {
  accident: '#f97316',
  crime: '#dc2626',
  hazard: '#eab308',
  other: '#2563eb',
};

interface ReportCardProps {
  item: ReportItem;
  onPress?: () => void;
  delay?: number;
}

export function ReportCard({ item, onPress, delay = 0 }: ReportCardProps) {
  const iconBg = item.category ? CATEGORY_COLORS[item.category] : '#2563eb';
  const agencies = item.attendingAgencies ?? [];
  const hasAgencies = agencies.length > 0;
  const agenciesLabel = hasAgencies ? agencies.map((a) => a.name).join(', ') : 'No agencies attending';

  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(delay)}
      className="mb-3"
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark flex-row items-center gap-3 px-4 py-3.5"
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.location}`}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <SolarMapPointBoldIcon
            width={ICON_SIZE}
            height={ICON_SIZE}
            color="#fff"
          />
        </View>

        <View className="flex-1 min-w-0">
          <AppText variant="caption" className="text-xs font-metropolis-medium text-captionDark dark:text-captionDark-dark">
            {item.fileId}
          </AppText>
          <AppText variant="body" className="font-metropolis-semibold mt-0.5" numberOfLines={1}>
            {item.title}
          </AppText>
          <View className="flex-row items-center gap-2 mt-0.5">
            <SolarMapPointBoldIcon width={14} height={14} color="#6b7280" />
            <AppText variant="caption" className="text-xs flex-1" numberOfLines={1}>
              {item.location}
            </AppText>
          </View>
          <View className="flex-row items-center gap-2 mt-0.5">
            <SolarClockCircleBoldIcon width={14} height={14} color="#6b7280" />
            <AppText variant="caption" className="text-xs">
              {item.timeAgo}
            </AppText>
          </View>
          <View className="mt-2 self-start">
            <View
              className={`px-2.5 py-1 rounded-full ${
                item.status === 'submitted'
                  ? 'bg-success-green/20 dark:bg-success-green-dark/20'
                  : 'bg-[#f97316]/20 dark:bg-[#f97316]/30'
              }`}
            >
              <AppText
                variant="caption"
                className={`text-xs font-metropolis-semibold ${
                  item.status === 'submitted'
                    ? 'text-success-green dark:text-success-green-dark'
                    : 'text-[#ea580c] dark:text-[#fb923c]'
                }`}
              >
                {item.status === 'submitted' ? 'Submitted' : 'Pending'}
              </AppText>
            </View>
          </View>
          <View className="flex-row items-center gap-1.5 mt-1.5">
            <SolarUsersGroupRoundedBoldIcon width={14} height={14} color="#6b7280" />
            <AppText variant="caption" className="text-xs text-captionDark dark:text-captionDark-dark" numberOfLines={1}>
              {agenciesLabel}
            </AppText>
          </View>
        </View>

        <View className="items-end justify-center gap-1">
          {item.needsUserFeedback && (
            <View className="rounded-full bg-accent-red dark:bg-accent-red-dark px-2.5 py-1">
              <AppText className="text-white font-metropolis-bold text-[10px]">
                FEEDBACK NEEDED
              </AppText>
            </View>
          )}
          <HugeiconsArrowRight01Icon width={18} height={18} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    </AppAnimatedView>
  );
}
