import { Image, TouchableOpacity, View } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';
import SolarFolderOpenBoldIcon from '@/components/icons/solar/folder-open-bold';
import SolarGalleryAddBoldIcon from '@/components/icons/solar/gallery-add-bold';
import SolarUsersGroupRoundedBoldIcon from '@/components/icons/solar/users-group-rounded-bold';
import SolarInfoCircleBoldIcon from '@/components/icons/solar/info-circle-bold';
import HugeiconsArrowRight01Icon from '@/components/icons/hugeicons/arrow-right-01';
import type { ReportItem, ReportAgency } from './ReportCard';

const ICON_SIZE = 22;
const COVER_HEIGHT = 100;
const AGENCY_LOGO_SIZE = 28;
const AGENCY_PLACEHOLDER_COUNT = 3;

const CATEGORY_COLORS: Record<NonNullable<ReportItem['category']>, string> = {
  accident: '#f97316',
  crime: '#dc2626',
  hazard: '#eab308',
  other: '#2563eb',
};

interface ReportsListProps {
  reports: ReportItem[];
  onReportPress?: (item: ReportItem) => void;
}

function AgencyChip({ agency }: { agency: ReportAgency }) {
  const initial = agency.name.charAt(0).toUpperCase();
  return (
    <View className="flex-row items-center gap-2 rounded-full bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)] pl-1 pr-2.5 py-1">
      <View
        className="rounded-full overflow-hidden bg-surface-light dark:bg-surface-dark items-center justify-center"
        style={{ width: AGENCY_LOGO_SIZE, height: AGENCY_LOGO_SIZE }}
      >
        {agency.logoUri ? (
          <Image
            source={{ uri: agency.logoUri }}
            style={{ width: AGENCY_LOGO_SIZE, height: AGENCY_LOGO_SIZE }}
            resizeMode="cover"
          />
        ) : (
          <AppText className="text-xs font-metropolis-bold text-captionDark dark:text-captionDark-dark">
            {initial}
          </AppText>
        )}
      </View>
      <AppText variant="caption" className="text-xs font-metropolis-medium" numberOfLines={1}>
        {agency.name}
      </AppText>
      {agency.requestingFeedback && (
        <View className="rounded-full bg-accent-red/20 dark:bg-accent-red-dark/20 p-0.5">
          <SolarInfoCircleBoldIcon width={14} height={14} color="#F00033" />
        </View>
      )}
    </View>
  );
}

export function ReportsList({ reports, onReportPress }: ReportsListProps) {
  return (
    <View className="gap-4">
      {reports.map((item) => {
        const iconBg = item.category ? CATEGORY_COLORS[item.category] : '#2563eb';
        const agencies = item.attendingAgencies ?? [];

        return (
          <AppAnimatedView
            key={item.id}
            entering={brandFadeInUp.delay(80)}
            className="rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark"
          >
            <TouchableOpacity
              onPress={() => onReportPress?.(item)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${item.fileId}`}
            >
              {/* Cover image – own space at top; status badge on image */}
              <View
                className="w-full overflow-hidden bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.08)]"
                style={{ height: COVER_HEIGHT }}
              >
                {item.coverImageUri ? (
                  <Image
                    source={{ uri: item.coverImageUri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <SolarGalleryAddBoldIcon width={32} height={32} color="#9ca3af" />
                  </View>
                )}
                <View className="absolute top-3 right-3">
                  <View
                    className={`rounded-full px-2.5 py-1.5 ${
                      item.status === 'submitted'
                        ? 'bg-success-green dark:bg-success-green-dark'
                        : 'bg-[#f97316] dark:bg-[#f97316]'
                    }`}
                  >
                    <AppText className="text-white font-metropolis-bold text-[10px]">
                      {item.status === 'submitted' ? 'Submitted' : 'Pending'}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Content below cover */}
              <View className="flex-row  gap-3 px-4 py-3.5">
                <View
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: iconBg }}
                >
                  <SolarFolderOpenBoldIcon width={ICON_SIZE} height={ICON_SIZE} color="#fff" />
                </View>

                <View className="flex-1 min-w-0">
                  <AppText variant="body" className="font-metropolis-semibold" numberOfLines={1}>
                    {item.title}
                  </AppText>
                  <AppText
                    variant="caption"
                    className="text-sm text-captionDark dark:text-captionDark-dark"
                    numberOfLines={1}
                  >
                    {item.fileId}
                  </AppText>
                  {/* Agencies: chips with logo + name; feedback icon on chip when that agency has a question */}
                  <View className="mt-2">
                    {agencies.length > 0 ? (
                      <View className="flex-row items-center gap-1.5 flex-wrap">
                        <SolarUsersGroupRoundedBoldIcon width={12} height={12} color="#9ca3af" />
                        {agencies.map((agency) => (
                          <AgencyChip key={agency.id} agency={agency} />
                        ))}
                      </View>
                    ) : (
                      <View className="flex-row items-center gap-1.5">
                        <SolarUsersGroupRoundedBoldIcon width={12} height={12} color="#9ca3af" />
                        <View className="flex-row items-center gap-1">
                          {Array.from({ length: AGENCY_PLACEHOLDER_COUNT }).map((_, i) => (
                            <View
                              key={i}
                              className="rounded-full bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.1)]"
                              style={{ width: 20, height: 20 }}
                            />
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View className="items-end justify-center">
                  <HugeiconsArrowRight01Icon width={18} height={18} color="#9ca3af" />
                </View>
              </View>
            </TouchableOpacity>
          </AppAnimatedView>
        );
      })}
    </View>
  );
}
