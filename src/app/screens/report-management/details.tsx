import { router } from 'expo-router';
import { NewReportDetailsStep } from '@/components/report-management/NewReportDetailsStep';
import { useReportDraftStore } from '@/stores/report-draft-store';

export default function NewReportDetailsScreen() {
  const mediaUris = useReportDraftStore((s) => s.mediaUris);

  const handleBack = () => router.back();
  const handleSubmit = () => {
    // TODO: submit report, then router.back() or navigate to reports list
    router.back();
  };

  return (
    <NewReportDetailsStep
      mediaUris={mediaUris}
      onBack={handleBack}
      onSubmitPress={handleSubmit}
    />
  );
}
