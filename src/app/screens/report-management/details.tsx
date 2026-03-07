import { router } from 'expo-router';
import { NewReportDetailsStep } from '@/components/report-management/NewReportDetailsStep';

export default function NewReportDetailsScreen() {
  const handleBack = () => router.back();
  const handleSubmit = () => {
    // TODO: submit report, then router.back() or navigate to reports list
    router.back();
  };

  return (
    <NewReportDetailsStep
      onBack={handleBack}
      onSubmitPress={handleSubmit}
    />
  );
}
