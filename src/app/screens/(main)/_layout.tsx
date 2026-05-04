import { Tabs } from 'expo-router';
import { AppTabBar } from '@/components/navigation/AppTabBar';
import { useSyncUserLocation } from '@/hooks/useSyncUserLocation';

export default function MainLayout() {
  useSyncUserLocation();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="watchme" options={{ title: 'Watch Me' }} />
      <Tabs.Screen name="main" options={{ title: 'Report' }} />
      <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
