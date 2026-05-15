import { View } from 'react-native';

interface SlideProgressDotsProps {
  total: number;
  current: number;
}

export function SlideProgressDots({ total, current }: SlideProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor:
              i === current ? '#ffffff' : 'rgba(255,255,255,0.35)',
          }}
        />
      ))}
    </View>
  );
}
