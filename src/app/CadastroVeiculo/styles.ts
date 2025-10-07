import { Colors } from '@/theme/colors';
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 20,
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
        textAlign: 'center',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginBottom: 20,
    },
    form: {
        width: "100%",
        alignItems: "center",
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
    },
    optionalToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginVertical: 10,
    },
    optionalText: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    optionalSectionTitle: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: 10,
        marginBottom: -5
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
});