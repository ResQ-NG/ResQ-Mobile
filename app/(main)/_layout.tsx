import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MainLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'black',
                    borderTopWidth: 0
                }
            }}
            initialRouteName="camera"
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="camera"
                            size={24}
                            color={focused ? '#fff' : '#666'}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="chatbubbles"
                            size={24}
                            color={focused ? '#fff' : '#666'}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="stories"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="people"
                            size={24}
                            color={focused ? '#fff' : '#666'}
                        />
                    )
                }}
            />
        </Tabs>
    );
}
