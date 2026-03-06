import { TouchableOpacity } from 'react-native';
import { AppAnimatedView, brandFadeInUp } from '@/lib/animation';
import { AppText } from '@/components/ui/AppText';

export type BroadcastSegment = 'general' | 'community';

interface BroadcastSegmentControlProps {
  active: BroadcastSegment;
  onChange: (segment: BroadcastSegment) => void;
}

const SEGMENTS: { key: BroadcastSegment; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'community', label: 'Community' },
];

export function BroadcastSegmentControl({
  active,
  onChange,
}: BroadcastSegmentControlProps) {
  return (
    <AppAnimatedView
      entering={brandFadeInUp.delay(60)}
      className="flex-row mt-4 mb-2 w-full px-4"
    >
      {SEGMENTS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            activeOpacity={0.8}
            className={`py-3 flex-1 items-center justify-center rounded-full ${isActive ? 'bg-surface-light dark:bg-surface-dark' : ''}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
          >
            <AppText
              variant="body"
              className={`font-metropolis-semibold ${isActive ? 'text-primaryDark dark:text-primaryDark-dark' : 'text-captionDark dark:text-captionDark-dark'}`}
            >
              {label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </AppAnimatedView>
  );
}
