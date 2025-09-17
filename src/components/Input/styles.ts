import { Colors } from '@/theme/colors'
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    wrapper: {
        width: "80%",

    },
    wrapperWithLabel: {
        marginVertical: 12,
    },

    container: {
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.primary,
        fontSize: 16,
        color: Colors.primary
    },
    
    label: {
        position: 'absolute',
        top: -12,
        left: 16,
        backgroundColor: Colors.background,
        paddingHorizontal: 6,
        zIndex: 1,
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
})