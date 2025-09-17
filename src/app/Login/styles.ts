import { Colors } from '@/theme/colors'
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 30,
        width: '100%',
    },
    logo: {
        marginBottom: 20,
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 7,
    },
})