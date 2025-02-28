import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';

type TabIconProps = {
    focused: boolean;
    color: string;
    iconName: keyof typeof Ionicons.glyphMap;
}

type TabLabelProps = {
    focused: boolean;
    label: string;
    fontSize?: number;
}

const TabIcon = ({ focused, color, iconName }: TabIconProps) => (
    <Ionicons
        name={iconName}
        size={24}
        color={focused ? Colors.brandConstants.primaryRed : color}
        style={{ opacity: focused ? 1 : 0.8 }}
    />
);

const TabLabel = ({ focused, label, fontSize = 12 }: TabLabelProps) => (
    focused ? (
        <Text style={{
            color: Colors.brandConstants.primaryRed,
            fontSize
        }}>
            {label}
        </Text>
    ) : null
);

const tabScreenConfig = [
    {
        name: "status-updates",
        iconName: "document-text",
        label: "Reports"
    },
    {
        name: "maps",
        iconName: "map",
        label: "Maps"
    },
    {
        name: "index",
        iconName: "videocam",
        label: "Live"
    },
    {
        name: "family-friends",
        iconName: "people",
        label: "Family"
    },
    {
        name: "broadcast",
        iconName: "radio",
        label: "Broadcasts"
    }
] as const;

export default function MainLayout() {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    const tabBarStyle = {
        backgroundColor,
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
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle,
                tabBarActiveTintColor: Colors.brandConstants.primaryRed,
                tabBarInactiveTintColor: textColor,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium'
                }
            }}
            initialRouteName="index"
        >
            {tabScreenConfig.map((screen) => (
                <Tabs.Screen
                    key={screen.name}
                    name={screen.name}
                    options={{
                        tabBarIcon: ({ focused, color }) => (
                            <TabIcon
                                focused={focused}
                                color={color}
                                iconName={screen.iconName as keyof typeof Ionicons.glyphMap}
                            />
                        ),
                        tabBarLabel: ({ focused }) => (
                            <TabLabel
                                focused={focused}
                                label={screen.label}
                                fontSize={12}
                            />
                        )
                    }}
                />
            ))}
        </Tabs>
    );
}
