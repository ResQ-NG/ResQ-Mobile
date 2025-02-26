import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';



export default function SplashLayout () {
    const colorScheme = useColorScheme();


    return (
        <Stack
        screenOptions={{
                headerShown: false
            }}>
            <Stack.Screen name="splash-two" options={{ headerShown: false }} />
        </Stack>
    )
}
