import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';

export default function MainLayout() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: backgroundColor,
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -3,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    height: 90,
                    paddingBottom: 8,
                    paddingTop: 8
                },
                tabBarActiveTintColor: Colors.brandConstants.primaryRed,
                tabBarInactiveTintColor: textColor,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium'
                }
            }}
            initialRouteName="index"
        >
            <Tabs.Screen
                name="emergency-broadcasts"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="alert-circle"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Broadcasts</Text> : null
                }}
            />
            <Tabs.Screen
                name="status-updates"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="newspaper"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Reports</Text> : null
                }}
            />
            <Tabs.Screen
                name="maps"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="map"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Maps</Text> : null
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="videocam"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Live</Text> : null
                }}
            />
            <Tabs.Screen
                name="family-friends"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="people"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Family</Text> : null
                }}
            />
            <Tabs.Screen
                name="watch-me"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name="shield-checkmark"
                            size={24}
                            color={focused ? Colors.brandConstants.primaryRed : color}
                            style={{ opacity: focused ? 1 : 0.8 }}
                        />
                    ),
                    tabBarLabel: ({ focused }) => focused ? <Text style={{color: Colors.brandConstants.primaryRed}}>Watch Me</Text> : null
                }}
            />
        </Tabs>
    );
}
