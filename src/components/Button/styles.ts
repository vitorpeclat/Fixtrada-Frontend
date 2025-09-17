import { Colors } from "@/theme/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create ({
    container: {
        backgroundColor: Colors.primary,
        height:48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: Colors.background,
        fontSize: 14,
        fontWeight: 600,
    },
})