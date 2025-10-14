// styles.ts do componente Input
import { Colors } from '@/theme/colors'
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    wrapperWithLabel: {
        marginVertical: 8,
    },
    container: {
        backgroundColor: Colors.background,
        height: 48,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
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

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fundo cinza semi-transparente
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        width: '80%',
        maxHeight: '60%',
        paddingVertical: 10,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalOption: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.background, 
    },
    modalOptionText: {
        fontSize: 16,
        color: Colors.primary,
        textAlign: 'center',
    },
})