import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'fullScreenModal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="enable-location" />
      <Stack.Screen name="image-preview" />
      <Stack.Screen name="watch-me-onboarding" />
      <Stack.Screen name="how-to-use-app" />
      <Stack.Screen name="watch-me-status" />
      <Stack.Screen name="in-call" options={{ presentation: 'modal' }} />
      <Stack.Screen name="chat" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
