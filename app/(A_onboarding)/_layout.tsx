import { Stack } from 'expo-router';


export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'white'
                }
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding-two" />
            <Stack.Screen name="onboarding-three" />
        </Stack>
    )
}
