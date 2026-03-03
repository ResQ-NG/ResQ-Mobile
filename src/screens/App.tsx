import '../../global.css';

import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import { useMetropolisFonts } from '../hooks/useMetropolisFonts';
import { useAppStore } from '../store/useAppStore';

export default function App() {
  const { loaded, error } = useMetropolisFonts();
  const { count, increment, decrement } = useAppStore();

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1 bg-white items-center justify-center font-sans">
      <Text className="font-metropolis-regular text-xl text-gray-800 mb-4">
        Open up App.tsx to start working on your app!
      </Text>
      <View className="flex-row items-center gap-4">
        <Pressable
          className="px-4 py-2 bg-blue-100 rounded-lg"
          onPress={decrement}
        >
          <Text className="font-metropolis-bold text-2xl text-blue-600">-</Text>
        </Pressable>
        <Text className="font-metropolis-semibold text-2xl text-gray-900">
          {count}
        </Text>
        <Pressable
          className="px-4 py-2 bg-blue-100 rounded-lg"
          onPress={increment}
        >
          <Text className="font-metropolis-bold text-2xl text-blue-600">+</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
