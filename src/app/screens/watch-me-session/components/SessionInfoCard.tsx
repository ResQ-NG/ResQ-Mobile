import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useRouteAnalysisStore } from '@/stores/route-analysis-store';

interface SessionInfoCardProps {
  sessionStartedAt: number | null;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, '0')}m`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatStartTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SessionInfoCard({ sessionStartedAt }: SessionInfoCardProps) {
  const [elapsed, setElapsed] = useState(
    sessionStartedAt ? Date.now() - sessionStartedAt : 0
  );
  const destination = useRouteAnalysisStore((s) => s.destination);
  const selectedRoute = useRouteAnalysisStore((s) => s.selectedRoute);

  useEffect(() => {
    if (!sessionStartedAt) return;
    const id = setInterval(() => {
      setElapsed(Date.now() - sessionStartedAt);
    }, 1000);
    return () => clearInterval(id);
  }, [sessionStartedAt]);

  return (
    <Animated.View entering={FadeInDown.delay(60).springify()}>
      <LinearGradient
        colors={['#14532d', '#166534']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 20, overflow: 'hidden' }}
      >
        <View className="p-5">
          <View className="flex-row items-center gap-2 mb-4">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#4ade80' }}
            />
            <AppText className="text-white font-metropolis-semibold text-sm">
              Watch Me is active
            </AppText>
          </View>

          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {destination ? (
                <>
                  <AppText className="text-white/60 text-xs font-metropolis-regular mb-0.5">
                    Destination
                  </AppText>
                  <AppText className="text-white font-metropolis-bold text-lg mb-1">
                    {destination}
                  </AppText>
                  {selectedRoute ? (
                    <AppText className="text-white/50 text-xs font-metropolis-regular">
                      {selectedRoute.via}
                    </AppText>
                  ) : null}
                </>
              ) : (
                <AppText className="text-white font-metropolis-bold text-base">
                  Session in progress
                </AppText>
              )}
            </View>

            <View className="items-end">
              <AppText className="text-white/60 text-xs font-metropolis-regular mb-0.5">
                Duration
              </AppText>
              <AppText className="text-white font-metropolis-bold text-xl">
                {formatDuration(elapsed)}
              </AppText>
              {sessionStartedAt ? (
                <AppText className="text-white/50 text-xs font-metropolis-regular">
                  Started {formatStartTime(sessionStartedAt)}
                </AppText>
              ) : null}
            </View>
          </View>

          {selectedRoute ? (
            <View
              className="mt-4 flex-row items-center gap-2 rounded-full py-2 px-3 self-start"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#4ade80"
              />
              <AppText className="text-white/80 text-xs font-metropolis-medium">
                Route safety score {selectedRoute.safetyScore}/100
              </AppText>
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
