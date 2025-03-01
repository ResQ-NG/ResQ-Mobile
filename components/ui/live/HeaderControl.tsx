import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity, View, StyleSheet, GestureResponderEvent} from "react-native"

export const HeaderControls = () => {
    function handleProfilePress(event: GestureResponderEvent): void {
        throw new Error("Function not implemented.");
    }

    function handleNotificationsPress(event: GestureResponderEvent): void {
        throw new Error("Function not implemented.");
    }

    return (
        <View style={styles.headerControlsSection}>
            <TouchableOpacity
                style={styles.controlButton}
                onPress={handleProfilePress}
            >
                <Ionicons
                    name="person-circle"
                    size={28}
                    color="white"
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.controlButton}
                onPress={handleNotificationsPress}
            >
                <Ionicons
                    name="notifications"
                    size={26}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    headerControlsSection: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        zIndex: 1,
      }
  });
