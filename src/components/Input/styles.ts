// styles.ts do componente Input
import { Colors } from '@/theme/colors'
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    wrapperWithLabel: {
        marginVertical: 12,
    },
    container: {
        backgroundColor: Colors.background,
        height: 48,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    inputField: {
        flex: 1, 
        fontSize: 16,
        color: Colors.primary,
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