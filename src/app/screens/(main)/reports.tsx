import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppAnimatedSafeAreaView,
  AppAnimatedScrollView,
} from '@/lib/animation';
import { useAppColorScheme } from '@/theme/colorMode';
import { TAB_BAR_HEIGHT } from '@/theme/constants';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportsEmptyState } from '@/components/reports/ReportsEmptyState';
import type { ReportItem } from '@/components/reports/ReportCard';

const MOCK_REPORTS: ReportItem[] = [
  {
    id: '1',
    fileId: 'RESQ-2025-001234',
    title: 'Road accident - Maryland',
    location: 'Maryland, Lagos',
    timeAgo: '2 hours ago',
    status: 'submitted',
    category: 'accident',
    attendingAgencies: [
      { id: 'p1', name: 'Police', logoUri: 'https://ui-avatars.com/api/?name=Police&size=56&background=1e3a5f&color=fff', requestingFeedback: false },
      { id: 'f1', name: 'FRSC', logoUri: 'https://ui-avatars.com/api/?name=FRSC&size=56&background=c2410c&color=fff', requestingFeedback: true },
    ],
    needsUserFeedback: true,
  },
  {
    id: '2',
    fileId: 'RESQ-2025-001198',
    title: 'Suspicious activity reported',
    location: 'Ikeja GRA, Lagos',
    timeAgo: '1 day ago',
    status: 'submitted',
    category: 'crime',
    attendingAgencies: [
      { id: 'p1', name: 'Police', logoUri: 'https://ui-avatars.com/api/?name=Police&size=56&background=1e3a5f&color=fff', requestingFeedback: false },
    ],
  },
  {
    id: '3',
    fileId: 'RESQ-2025-001267',
    title: 'Fallen pole - Ojodu',
    location: 'Ojodu Berger, Lagos',
    timeAgo: '30 min ago',
    status: 'pending',
    category: 'hazard',
    attendingAgencies: [],
  },
];

export default function ReportsScreen() {
  const { theme } = useAppColorScheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = TAB_BAR_HEIGHT + insets.bottom + 24;
  const hasReports = MOCK_REPORTS.length > 0;

  return (
    <AppAnimatedSafeAreaView
      className={`flex-1 ${theme.background}`}
      edges={['top', 'left', 'right']}
      header={<ReportsHeader />}
    >
      <AppAnimatedScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {hasReports ? (
          <>
            <ReportsList reports={MOCK_REPORTS} onReportPress={() => {}} />
          </>
        ) : (
          <ReportsEmptyState />
        )}
      </AppAnimatedScrollView>
    </AppAnimatedSafeAreaView>
  );
}
