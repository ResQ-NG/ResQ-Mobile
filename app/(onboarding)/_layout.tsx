import { Stack } from 'expo-router';



export default function OnboardingLayout () {
    return (
        <Stack
        screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding-two" options={{ headerShown: false }} />
        </Stack>
    )
}
