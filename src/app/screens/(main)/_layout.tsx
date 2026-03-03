import { Tabs } from 'expo-router';
import { AppTabBar } from '@/components/navigation/AppTabBar';

export default function MainLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="watchme" options={{ title: 'Watch Me' }} />
      <Tabs.Screen name="main" options={{ title: 'Report' }} />
      <Tabs.Screen name="evidence" options={{ title: 'Evidence' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
