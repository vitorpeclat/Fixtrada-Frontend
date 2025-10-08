import { Colors } from '@/theme/colors';
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        paddingTop: 20,
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '5%',
    },
    backButtonText: {
        color: Colors.primary,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.secondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    rowItem: {
        flex: 1,
    },
    optionalContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    optionalToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginVertical: 5,
    },
    optionalText: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: Colors.background,
    },
});