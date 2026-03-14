import { router } from 'expo-router';
import { NewReportDetailsStep } from './components';
import { useReportDraftStore } from '@/stores/report-draft-store';
import { usePreventDoublePress } from '@/hooks/usePreventDoublePress';

export default function NewReportDetailsScreen() {
  const mediaUris = useReportDraftStore((s) => s.mediaUris);

  const handleBack = usePreventDoublePress(() => router.back());
  const handleSubmit = usePreventDoublePress(() => {
    // TODO: submit report, then router.back() or navigate to reports list
    router.back();
  });

  return (
    <NewReportDetailsStep
      mediaUris={mediaUris}
      onBack={handleBack}
      onSubmitPress={handleSubmit}
    />
  );
}
