import { AppAnimatedView, brandFadeIn } from '@/lib/animation';
import { RoundedButton } from '@/components/ui/RoundedButton';
import { useAppColorScheme } from '@/theme/colorMode';
import SolarBoltBoldIcon from '@/components/icons/solar/bolt-bold';
import SolarVideocameraRecordBoldIcon from '@/components/icons/solar/videocamera-record-bold';
import SolarMicrophoneBoldIcon from '@/components/icons/solar/microphone-bold';
import SolarTextBoldIcon from '@/components/icons/solar/text-bold';

import type { ComponentType } from 'react';
import SolarSmartphoneRotateAngleBoldIcon from '../icons/solar/smartphone-rotate-angle-bold';
import SolarFileBoldIcon from '../icons/solar/file-bold';

type IconComponent = ComponentType<{
  width: number;
  height: number;
  color: string;
}>;

interface SidebarButtonConfig {
  key: string;
  Icon: IconComponent;
  onPress?: () => void;
}

interface CameraOverlaySidebarProps {
  onFlash?: () => void;
  onVideoToggle?: () => void;
  onFlip?: () => void;
  onMic?: () => void;
  onText?: () => void;
  onLens?: () => void;
  onAddFile?: () => void;
}

export function CameraOverlaySidebar({
  onFlash,
  onVideoToggle,
  onMic,
  onText,
  onLens,
  onAddFile,
}: CameraOverlaySidebarProps) {
  const { theme } = useAppColorScheme();
  const buttons: SidebarButtonConfig[] = [
    { key: 'flash', Icon: SolarBoltBoldIcon, onPress: onFlash },
    {
      key: 'video',
      Icon: SolarVideocameraRecordBoldIcon,
      onPress: onVideoToggle,
    },
    { key: 'mic', Icon: SolarMicrophoneBoldIcon, onPress: onMic },
    { key: 'text', Icon: SolarTextBoldIcon, onPress: onText },
    { key: 'lens', Icon: SolarSmartphoneRotateAngleBoldIcon, onPress: onLens },
    { key: 'file', Icon: SolarFileBoldIcon, onPress: onAddFile },
  ];

  return (
    <AppAnimatedView
      entering={brandFadeIn}
      className="absolute right-[14px] top-[22%] gap-4"
    >
      {buttons.map(({ key, Icon, onPress }, index) => (
        <AppAnimatedView key={key} entering={brandFadeIn.delay(index * 50)}>
          <RoundedButton
            onPress={onPress}
            icon={<Icon width={20} height={20} color={theme.iconOnAccent} />}
            className="bg-[rgba(80,80,80,0.55)]"
          />
        </AppAnimatedView>
      ))}
    </AppAnimatedView>
  );
}
